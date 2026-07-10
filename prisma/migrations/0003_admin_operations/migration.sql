-- Normalize variant stock created by 0002 and add atomic admin operations.

WITH ranked AS (
  SELECT
    pv.id,
    pv.product_id,
    p.stock_quantity AS product_stock,
    count(*) OVER (PARTITION BY pv.product_id) AS variant_count,
    row_number() OVER (PARTITION BY pv.product_id ORDER BY pv.created_at, pv.id) AS variant_position
  FROM public.product_variants pv
  JOIN public.products p ON p.id = pv.product_id
), allocated AS (
  SELECT
    id,
    CASE
      WHEN variant_count = 0 THEN 0
      ELSE floor(product_stock::numeric / variant_count)::integer
        + CASE WHEN variant_position <= (product_stock % variant_count) THEN 1 ELSE 0 END
    END AS normalized_stock
  FROM ranked
)
UPDATE public.product_variants pv
SET stock_quantity = allocated.normalized_stock
FROM allocated
WHERE pv.id = allocated.id;

CREATE OR REPLACE FUNCTION public.adjust_inventory(
  p_variant_id UUID,
  p_delta INTEGER,
  p_note TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_variant public.product_variants%ROWTYPE;
  next_quantity INTEGER;
BEGIN
  IF NOT public.is_seller() THEN
    RAISE EXCEPTION 'Seller access required';
  END IF;
  IF p_delta = 0 THEN
    RAISE EXCEPTION 'Inventory adjustment must not be zero';
  END IF;

  SELECT * INTO current_variant
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  next_quantity := current_variant.stock_quantity + p_delta;
  IF next_quantity < 0 THEN
    RAISE EXCEPTION 'Inventory cannot be negative';
  END IF;

  UPDATE public.product_variants
  SET stock_quantity = next_quantity,
      active = CASE WHEN next_quantity > 0 THEN TRUE ELSE active END
  WHERE id = p_variant_id;

  INSERT INTO public.inventory_movements (variant_id, actor_id, delta, reason, note)
  VALUES (
    p_variant_id,
    auth.uid(),
    p_delta,
    CASE WHEN p_delta > 0 THEN 'restock'::"InventoryReason" ELSE 'manual_adjustment'::"InventoryReason" END,
    NULLIF(trim(p_note), '')
  );

  UPDATE public.products p
  SET stock_quantity = totals.quantity,
      in_stock = totals.quantity > 0
  FROM (
    SELECT product_id, sum(stock_quantity)::integer AS quantity
    FROM public.product_variants
    WHERE product_id = current_variant.product_id
    GROUP BY product_id
  ) totals
  WHERE p.id = totals.product_id;

  INSERT INTO public.admin_audit_events (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    'inventory.adjust',
    'product_variant',
    p_variant_id::text,
    jsonb_build_object('delta', p_delta, 'quantity', next_quantity, 'note', p_note)
  );

  RETURN next_quantity;
END;
$$;

REVOKE ALL ON FUNCTION public.adjust_inventory(UUID, INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.adjust_inventory(UUID, INTEGER, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_events (order_id, actor_id, from_status, to_status, note)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status, 'Status updated in admin');

    INSERT INTO public.admin_audit_events (actor_id, action, entity_type, entity_id, metadata)
    VALUES (
      auth.uid(),
      'order.status_update',
      'order',
      NEW.id::text,
      jsonb_build_object('from', OLD.status, 'to', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_status_history ON public.orders;
CREATE TRIGGER orders_status_history
AFTER UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.record_order_status_change();

CREATE OR REPLACE FUNCTION public.record_store_setting_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_audit_events (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    'store_setting.update',
    'store_setting',
    NEW.key,
    jsonb_build_object('value', NEW.value)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS store_settings_audit ON public.store_settings;
CREATE TRIGGER store_settings_audit
AFTER INSERT OR UPDATE ON public.store_settings
FOR EACH ROW EXECUTE FUNCTION public.record_store_setting_change();
