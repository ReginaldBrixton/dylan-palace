-- Dylan's Palace commerce hardening migration
-- Back up the production database before applying this migration.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'verified', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "InventoryReason" AS ENUM ('order', 'manual_adjustment', 'restock', 'return', 'cancellation');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status "PaymentStatus" NOT NULL DEFAULT 'pending';

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL,
  color TEXT,
  price_override NUMERIC(10,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_active ON public.product_variants(product_id, active);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON public.product_variants(stock_quantity);

INSERT INTO public.product_variants (product_id, sku, size, stock_quantity, active)
SELECT
  ps.product_id,
  'DP-' || upper(substr(replace(ps.product_id::text, '-', ''), 1, 8)) || '-' || upper(regexp_replace(ps.size, '[^a-zA-Z0-9]+', '', 'g')),
  ps.size,
  CASE WHEN ps.in_stock THEN GREATEST(p.stock_quantity, 1) ELSE 0 END,
  ps.in_stock
FROM public.product_sizes ps
JOIN public.products p ON p.id = ps.product_id
ON CONFLICT (sku) DO NOTHING;

ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS variant_id UUID;
DO $$ BEGIN
  ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey
    FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  delta INTEGER NOT NULL CHECK (delta <> 0),
  reason "InventoryReason" NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_variant_created ON public.inventory_movements(variant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_actor ON public.inventory_movements(actor_id);

CREATE TABLE IF NOT EXISTS public.order_status_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  from_status "OrderStatus",
  to_status "OrderStatus" NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_status_events_order_created ON public.order_status_events(order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.admin_audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_entity ON public.admin_audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_created ON public.admin_audit_events(created_at DESC);

CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.store_settings (key, value)
VALUES
  ('shipping', '{"baseFee":30,"freeThreshold":500,"pickupLabel":"Odorkor pickup"}'::jsonb),
  ('contact', '{"email":"","phone":"","whatsapp":""}'::jsonb),
  ('serviceCopy', '{"delivery":"Fast delivery within Accra","pickup":"Free pickup available"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'seller'
  );
$$;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product variants are publicly readable" ON public.product_variants;
CREATE POLICY "Product variants are publicly readable" ON public.product_variants FOR SELECT USING (active = TRUE OR public.is_seller());
DROP POLICY IF EXISTS "Product variants seller write" ON public.product_variants;
CREATE POLICY "Product variants seller write" ON public.product_variants FOR ALL USING (public.is_seller()) WITH CHECK (public.is_seller());

DROP POLICY IF EXISTS "Inventory seller access" ON public.inventory_movements;
CREATE POLICY "Inventory seller access" ON public.inventory_movements FOR ALL USING (public.is_seller()) WITH CHECK (public.is_seller());
DROP POLICY IF EXISTS "Order events owner or seller" ON public.order_status_events;
CREATE POLICY "Order events owner or seller" ON public.order_status_events FOR SELECT USING (
  public.is_seller() OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Order events seller write" ON public.order_status_events;
CREATE POLICY "Order events seller write" ON public.order_status_events FOR INSERT WITH CHECK (public.is_seller());
DROP POLICY IF EXISTS "Audit seller access" ON public.admin_audit_events;
CREATE POLICY "Audit seller access" ON public.admin_audit_events FOR ALL USING (public.is_seller()) WITH CHECK (public.is_seller());
DROP POLICY IF EXISTS "Store settings public read" ON public.store_settings;
CREATE POLICY "Store settings public read" ON public.store_settings FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Store settings seller write" ON public.store_settings;
CREATE POLICY "Store settings seller write" ON public.store_settings FOR ALL USING (public.is_seller()) WITH CHECK (public.is_seller());

CREATE OR REPLACE FUNCTION public.update_commerce_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_variants_updated_at ON public.product_variants;
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.update_commerce_updated_at();
DROP TRIGGER IF EXISTS store_settings_updated_at ON public.store_settings;
CREATE TRIGGER store_settings_updated_at BEFORE UPDATE ON public.store_settings
FOR EACH ROW EXECUTE FUNCTION public.update_commerce_updated_at();

CREATE OR REPLACE FUNCTION public.place_order(payload JSONB, items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id UUID := uuid_generate_v4();
  new_order_number TEXT := 'DP-' || to_char(clock_timestamp(), 'YYMMDDHH24MISS') || '-' || upper(substr(md5(random()::text), 1, 4));
  item JSONB;
  selected_variant public.product_variants%ROWTYPE;
  selected_product public.products%ROWTYPE;
  item_quantity INTEGER;
  item_price NUMERIC(10,2);
  calculated_subtotal NUMERIC(10,2) := 0;
  supplied_shipping NUMERIC(10,2) := COALESCE((payload->>'shippingCost')::numeric, 0);
BEGIN
  IF jsonb_typeof(items) <> 'array' OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  IF COALESCE(trim(payload->>'fullName'), '') = ''
    OR COALESCE(trim(payload->>'email'), '') = ''
    OR COALESCE(trim(payload->>'phone'), '') = ''
    OR COALESCE(trim(payload->>'address'), '') = ''
    OR COALESCE(trim(payload->>'city'), '') = '' THEN
    RAISE EXCEPTION 'Required customer details are missing';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    item_quantity := GREATEST(COALESCE((item->>'quantity')::integer, 0), 0);
    IF item_quantity < 1 THEN RAISE EXCEPTION 'Invalid item quantity'; END IF;

    SELECT * INTO selected_variant
    FROM public.product_variants
    WHERE id = (item->>'variantId')::uuid AND active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'Product variant is unavailable'; END IF;
    IF selected_variant.stock_quantity < item_quantity THEN RAISE EXCEPTION 'Insufficient stock for %', selected_variant.sku; END IF;

    SELECT * INTO selected_product FROM public.products WHERE id = selected_variant.product_id;
    IF NOT FOUND OR selected_product.in_stock = FALSE THEN RAISE EXCEPTION 'Product is unavailable'; END IF;

    item_price := COALESCE(selected_variant.price_override, selected_product.price);
    calculated_subtotal := calculated_subtotal + (item_price * item_quantity);
  END LOOP;

  INSERT INTO public.orders (
    id, order_number, user_id, status, payment_status, total_amount, subtotal, shipping_cost,
    full_name, email, phone, address, city, zip, payment_method, momo_network, momo_number, notes
  ) VALUES (
    new_order_id,
    new_order_number,
    auth.uid(),
    'pending',
    'pending',
    calculated_subtotal + supplied_shipping,
    calculated_subtotal,
    supplied_shipping,
    trim(payload->>'fullName'),
    lower(trim(payload->>'email')),
    trim(payload->>'phone'),
    trim(payload->>'address'),
    trim(payload->>'city'),
    NULLIF(trim(payload->>'zip'), ''),
    (payload->>'paymentMethod')::"PaymentMethod",
    NULLIF(payload->>'momoNetwork', ''),
    NULLIF(payload->>'momoNumber', ''),
    NULLIF(payload->>'notes', '')
  );

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    item_quantity := (item->>'quantity')::integer;
    SELECT * INTO selected_variant FROM public.product_variants WHERE id = (item->>'variantId')::uuid FOR UPDATE;
    SELECT * INTO selected_product FROM public.products WHERE id = selected_variant.product_id;
    item_price := COALESCE(selected_variant.price_override, selected_product.price);

    INSERT INTO public.order_items (
      order_id, product_id, variant_id, product_name, product_image, size, quantity, unit_price
    ) VALUES (
      new_order_id,
      selected_product.id,
      selected_variant.id,
      selected_product.name,
      item->>'productImage',
      selected_variant.size,
      item_quantity,
      item_price
    );

    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - item_quantity
    WHERE id = selected_variant.id;

    INSERT INTO public.inventory_movements (variant_id, actor_id, delta, reason, note)
    VALUES (selected_variant.id, auth.uid(), -item_quantity, 'order', 'Order ' || new_order_number);
  END LOOP;

  UPDATE public.products p
  SET stock_quantity = totals.quantity,
      in_stock = totals.quantity > 0
  FROM (
    SELECT product_id, sum(stock_quantity)::integer AS quantity
    FROM public.product_variants
    WHERE product_id IN (
      SELECT DISTINCT (pv.product_id)
      FROM public.product_variants pv
      JOIN jsonb_array_elements(items) i ON pv.id = (i->>'variantId')::uuid
    )
    GROUP BY product_id
  ) totals
  WHERE p.id = totals.product_id;

  INSERT INTO public.order_status_events (order_id, actor_id, from_status, to_status, note)
  VALUES (new_order_id, auth.uid(), NULL, 'pending', 'Order placed');

  RETURN jsonb_build_object('orderId', new_order_id, 'orderNumber', new_order_number);
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(JSONB, JSONB) TO anon, authenticated;
