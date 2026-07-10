-- Transactional product creation and editing for the seller portal.

CREATE OR REPLACE FUNCTION public.save_product(
  p_product_id UUID,
  p_payload JSONB,
  p_images JSONB,
  p_sizes JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id UUID := COALESCE(p_product_id, uuid_generate_v4());
  v_category_id INTEGER;
  v_image JSONB;
  v_size TEXT;
  v_size_count INTEGER;
  v_position INTEGER := 0;
  v_stock INTEGER := GREATEST(COALESCE((p_payload->>'stockQuantity')::integer, 0), 0);
  v_allocated INTEGER;
  v_index INTEGER := 0;
  v_sku TEXT;
BEGIN
  IF NOT public.is_seller() THEN
    RAISE EXCEPTION 'Seller access required';
  END IF;

  IF COALESCE(trim(p_payload->>'name'), '') = '' THEN RAISE EXCEPTION 'Product name is required'; END IF;
  IF COALESCE((p_payload->>'price')::numeric, 0) < 0 THEN RAISE EXCEPTION 'Product price must not be negative'; END IF;

  SELECT id INTO v_category_id
  FROM public.categories
  WHERE name = (p_payload->>'category')::"ProductCategoryName";
  IF v_category_id IS NULL THEN RAISE EXCEPTION 'Invalid category'; END IF;

  INSERT INTO public.products (
    id, name, brand, category_id, price, description, in_stock,
    stock_quantity, is_featured, tags, colors, created_by
  ) VALUES (
    v_product_id,
    trim(p_payload->>'name'),
    NULLIF(trim(p_payload->>'brand'), ''),
    v_category_id,
    (p_payload->>'price')::numeric,
    NULLIF(trim(p_payload->>'description'), ''),
    COALESCE((p_payload->>'inStock')::boolean, TRUE),
    v_stock,
    COALESCE((p_payload->>'isFeatured')::boolean, FALSE),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(p_payload->'tags')), ARRAY[]::text[]),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(p_payload->'colors')), ARRAY[]::text[]),
    auth.uid()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    in_stock = EXCLUDED.in_stock,
    stock_quantity = EXCLUDED.stock_quantity,
    is_featured = EXCLUDED.is_featured,
    tags = EXCLUDED.tags,
    colors = EXCLUDED.colors,
    updated_at = now();

  DELETE FROM public.product_images WHERE product_id = v_product_id;
  FOR v_image IN SELECT * FROM jsonb_array_elements(COALESCE(p_images, '[]'::jsonb))
  LOOP
    INSERT INTO public.product_images (product_id, url, alt_text, position)
    VALUES (
      v_product_id,
      v_image->>'url',
      COALESCE(NULLIF(v_image->>'altText', ''), trim(p_payload->>'name') || ' - image ' || (v_position + 1)),
      v_position
    );
    v_position := v_position + 1;
  END LOOP;

  IF jsonb_array_length(COALESCE(p_sizes, '[]'::jsonb)) = 0 THEN
    p_sizes := '["OS"]'::jsonb;
  END IF;

  v_size_count := jsonb_array_length(p_sizes);
  UPDATE public.product_variants SET active = FALSE WHERE product_id = v_product_id;
  DELETE FROM public.product_sizes WHERE product_id = v_product_id;

  FOR v_size IN SELECT jsonb_array_elements_text(p_sizes)
  LOOP
    v_index := v_index + 1;
    v_allocated := floor(v_stock::numeric / v_size_count)::integer
      + CASE WHEN v_index <= (v_stock % v_size_count) THEN 1 ELSE 0 END;
    v_sku := 'DP-' || upper(substr(replace(v_product_id::text, '-', ''), 1, 8)) || '-' || upper(regexp_replace(v_size, '[^a-zA-Z0-9]+', '', 'g'));

    INSERT INTO public.product_sizes (product_id, size, in_stock)
    VALUES (v_product_id, v_size, v_allocated > 0)
    ON CONFLICT (product_id, size) DO UPDATE SET in_stock = EXCLUDED.in_stock;

    INSERT INTO public.product_variants (product_id, sku, size, stock_quantity, active)
    VALUES (v_product_id, v_sku, v_size, v_allocated, COALESCE((p_payload->>'inStock')::boolean, TRUE))
    ON CONFLICT (sku) DO UPDATE SET
      size = EXCLUDED.size,
      stock_quantity = EXCLUDED.stock_quantity,
      active = EXCLUDED.active,
      updated_at = now();
  END LOOP;

  UPDATE public.products p
  SET stock_quantity = totals.quantity,
      in_stock = totals.quantity > 0 AND COALESCE((p_payload->>'inStock')::boolean, TRUE)
  FROM (
    SELECT product_id, sum(stock_quantity)::integer AS quantity
    FROM public.product_variants
    WHERE product_id = v_product_id AND active = TRUE
    GROUP BY product_id
  ) totals
  WHERE p.id = totals.product_id;

  INSERT INTO public.admin_audit_events (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    CASE WHEN p_product_id IS NULL THEN 'product.create' ELSE 'product.update' END,
    'product',
    v_product_id::text,
    jsonb_build_object('name', p_payload->>'name', 'imageCount', jsonb_array_length(COALESCE(p_images, '[]'::jsonb)), 'sizes', p_sizes)
  );

  RETURN v_product_id;
END;
$$;

REVOKE ALL ON FUNCTION public.save_product(UUID, JSONB, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_product(UUID, JSONB, JSONB, JSONB) TO authenticated;
