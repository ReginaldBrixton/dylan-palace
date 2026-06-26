-- Auto-generated seed SQL

-- Temporarily disable RLS for seeding
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories DISABLE ROW LEVEL SECURITY;

-- Ensure TROUSERS sub-category exists
INSERT INTO public.sub_categories (name, display_name, slug, category_id)
SELECT 'TROUSERS', 'Trousers', 'trousers-pants', id FROM public.categories WHERE name = 'TROUSERS'
ON CONFLICT (slug) DO NOTHING;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Boxy Camp Collar Shirt', NULL, c.id, sc.id, 120, 'A relaxed camp collar shirt crafted from breathable cotton-blend. Features a sharp flat collar, horizontal hem line, and high-contrast horn-textured buttons.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEYCXcCWvzjkS9PKwZ46dx5W7iFzpNlXB1fnJO', 'Boxy Camp Collar Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Washed Charcoal Tee', NULL, c.id, sc.id, 85, 'Heavily weighted 280GSM organic cotton jersey with dry hand-feel. Features a relaxed drop shoulder, thick double-needle collar, and vintage charcoal wash tone.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEW924t7qsSuHLK1cqEvzP3Nr7ZV5MfetphyQF', 'Washed Charcoal Tee - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Bound Silk Tee', NULL, c.id, sc.id, 165, 'Impeccable silk-blend tee with clean bonded edge cuffs and hem. Seamless neckline finish creates a highly fluid editorial transition under suit jackets.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE1VacF5WzRjWsbvf5VBgi2QJD9CcOHToA4ue7', 'Bound Silk Tee - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Horizontal Blue Striped Knit Polo', NULL, c.id, sc.id, 135, 'A luxurious short sleeve knit polo shirt adorned with grey and blue horizontal stripes. Features a sharp dark navy contrast collar and premium lightweight yarn construction.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEOAgJWrdcKbzxkGFZ9BuHrNQ7EytMsUiIq8pe', 'Horizontal Blue Striped Knit Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Beige Striped Knit Polo', NULL, c.id, sc.id, 135, 'An elegant fine-knit polo shirt styled with subtle beige and tan stripes. Complemented by a solid taupe ribbed collar, presenting a highly sophisticated casual asset.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEZ33SWmGlqI12CPHO8Udiyf4GTpzk73sKwX0b', 'Beige Striped Knit Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Olive Striped Knit Polo', NULL, c.id, sc.id, 135, 'Short sleeve fine-knit polo styled with elegant olive green and charcoal grey horizontal stripes. Complete with an olive ribbed collar and structured fit.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEHRixe3ARlSmHIkYjFBQP250ZDKehxarUs1c7', 'Olive Striped Knit Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Two-Tone Grey Knit Polo', NULL, c.id, sc.id, 145, 'A striking premium knit polo shirt designed with a textured heather-grey body contrasted beautifully by a pristine white collar and modern flat placket.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEExbxwkCagF2MXmvKkuNz3A1JqWUE87R0bdBr', 'Two-Tone Grey Knit Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Crochet Floral Patchwork Shirt', NULL, c.id, sc.id, 240, 'An editorial masterpiece constructed from handmade colorful crochet sunflower patches. Bold, breathable open-work design finished with a classic camp collar and real wood buttons.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEUB9HkVIIo9MFDkO5fRB3lPSNg1YhribZKuz6', 'Crochet Floral Patchwork Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Black Diamond Crochet Shirt', NULL, c.id, sc.id, 220, 'Artisanal short sleeve resort knit shirt featuring a rich black crochet body highlighted by a high-contrast white diamond-lattice open lace overlay.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEwSiukIUBDAC8WEZxFwrH9uk36YnIlVMd7mTL', 'Black Diamond Crochet Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Retro Grey Striped Polo', NULL, c.id, sc.id, 155, 'A premium heavy-weighted grey knit polo shirt featuring wide horizontal black stripes and delicate white accent lines. Infuses retro sport aesthetics into modern luxury.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEL6aLozHYhg8XVNWlCRG2Fbxofwv4apiTKrkA', 'Retro Grey Striped Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Ribbed-Panel Black Polo', NULL, c.id, sc.id, 150, 'A sleek black luxury knit polo shirt defined by elegant vertical ribbed columns across the chest, creating high-fashion geometric texture depth.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEa2sDclKV8HLDWcCTGblFhZ4qKQSwsoapX79k', 'Ribbed-Panel Black Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Patterned Forest Green Polo', NULL, c.id, sc.id, 160, 'Rich forest green short sleeve knit polo boasting sophisticated cream horizontal geometric diamond patterns. Perfect blend of heritage golf feel and high street luxury.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEmV8a9gnTUJ87deH3OEFhALBywD5QfVS4scoI', 'Patterned Forest Green Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Burgundy Ribbed Knit Polo', NULL, c.id, sc.id, 140, 'Luxury short sleeve polo shirt cut from super soft combed burgundy yarn. Standard ribbed texture throughout delivers highly tactile luxury comfort.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEG3hL63FeYz7lKRVuNS6Ph5x4O18TLIbifCFp', 'Burgundy Ribbed Knit Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Ghana Federation Home Jersey', NULL, c.id, sc.id, 110, 'The official white home jersey for the Ghana national football team. Displays abstract high-contrast line graphical layout in pan-African red, yellow, and green, complete with the iconic bold black star at center.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE74B5bF9F5bZsWuYNVxLR2M3oXJvcmD4Ky06i', 'Ghana Federation Home Jersey - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XXL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Ghana Federation Away Jersey', NULL, c.id, sc.id, 110, 'The spectacular away jersey of the Ghana national team in rich yellow-gold. Styled with traditional woven fabric pattern textures and contrast green collar detailing, centering the Black Star.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE1pOUPzWzRjWsbvf5VBgi2QJD9CcOHToA4ue7', 'Ghana Federation Away Jersey - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XXL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Structured Linen Shirt', NULL, c.id, sc.id, 145, 'An uncompromising approach to summer shirting. Crafted from heavyweight, structured linen that maintains its architectural silhouette throughout the day. Features a hidden placket and zero visible stitching for extreme precision.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKED77osoTO7ksmn0ACFv2l3yw1gPEYGI6pxSBh', 'Structured Linen Shirt - Image 1', 0);
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEmSmZUSTUJ87deH3OEFhALBywD5QfVS4scoIk', 'Structured Linen Shirt - Image 2', 1);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Oxford Poplin Shirt', NULL, c.id, sc.id, 180, 'Impeccably tailored white button-down shirt. Features crisp single-needle stitching, structured premium double-ply cotton poplin for a crisp fall, and clean geometric lines.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE3QqD3w0HK8kJPavuLVz4Y6fNItxUsge1WDr0', 'Oxford Poplin Shirt - Image 1', 0);
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE4CPANPDQREUtukI1ALv5NWo8BKGXljFiV6rc', 'Oxford Poplin Shirt - Image 2', 1);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Denim Overshirt', NULL, c.id, sc.id, 220, 'Heavyweight raw denim overshirt styled with a stark, modern aesthetic. Silver polished button snaps and geometric double breast chest pockets provide high-contrast functionality.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE9VZK7dcLI7DOxT5ZHNtV3qF2s4jW8coG0Xyb', 'Denim Overshirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Silk Chiffon Shirt', NULL, c.id, sc.id, 310, 'Pure flowing off-white silk chiffon shirt. Extremely smooth drape with translucent features, giving a dramatic airy look that transitions beautifully between environments.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEXFPmL2PZRLziG3at9m4TAh7UPob5QxeIwqCF', 'Silk Chiffon Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Structured Shacket', NULL, c.id, sc.id, 450, 'A striking design hybrid between a structured jacket and a minimal shirt. Heavy architectural tailoring makes this charcoal beauty stand on its own feet.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEc8ZbrBt8eRPqlo7x1MrSztKYEZNJOIiQ0HLX', 'Structured Shacket - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Striped Poplin', NULL, c.id, sc.id, 195, 'Fine blue and white striped cotton poplin pattern with classic single-button cuffs. Crafted with high stitch density for maximum luxury and long-lasting editorial shape.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEZef4JbGlqI12CPHO8Udiyf4GTpzk73sKwX0b', 'Striped Poplin - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Ribbed Knit Singlet', NULL, c.id, sc.id, 75, 'Classic ribbed athletic singlet cut from heavy organic cotton-modal yarn. Deep scooped neckline, wide shoulder straps, and tailored side darts for a raw brutal shape.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SINGLETS' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEtIAGk1bTPtG2vAUWXSOqIKdDbh4Cl1oYj87F', 'Ribbed Knit Singlet - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Raw Asymmetric Vest', NULL, c.id, sc.id, 95, 'Architectural asymmetric knit singlet. Curved side slits and unfinished flat hems create a perfect layering tool with high visual rhythm.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SINGLETS' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEjgPTM4U3RMvmPor9q8lhWpXKxQ4ebLtVZHau', 'Raw Asymmetric Vest - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Abstract Earth Resort Shirt', NULL, c.id, sc.id, 155, 'A stunning resort-style shirt featuring an abstract earthy botanical pattern printed on ultra-fluid, sustainable tencel fiber. Styled with a classic cuban camp collar and clean casual fit.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEFKf2ni61V6J84DKrYbdxvZIW9BTiEOuzjhqf', 'Abstract Earth Resort Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Portuguese Linen Button-Up', NULL, c.id, sc.id, 165, 'Naturally breathable long-sleeve shirt crafted from premium Portuguese linen yarn. Featuring structural chest pockets, a sharp collar stand, and mother-of-pearl buttons.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEMqBAobs1qCJG1T6y5eWB4ivHK2INPbORwUkX', 'Portuguese Linen Button-Up - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Minimal Canvas Overshirt', NULL, c.id, sc.id, 185, 'The ultimate layering piece. Crafted from heavyweight wash-treated utility canvas, featuring an elegant flat placket, large architectural flap pockets, and a clean square hem.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEhUpb7uav1e0b3DZmJnv7Rzi4CM8tfUSPKlaF', 'Minimal Canvas Overshirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Signature Pinstripe Dress Shirt', NULL, c.id, sc.id, 195, 'An exquisite stripe shirt detailed with fine charcoal stripes. Expertly tailored in Italy with standard spread collar, curved hemline, and custom button cuffs.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LONG SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE2wFdlfuhtr93IaJWxTEhYF6cek8B15UdRjK2', 'Signature Pinstripe Dress Shirt - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Fine Pique Classic Polo', NULL, c.id, sc.id, 125, 'Crafted from soft comb-cotton pique weave. High tactile elegance, solid rib cuffs, and a dynamic two-button placket for complete stylistic versatility.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORT SLEEVES' AND sc.category_id = c.id
  WHERE c.name = 'SHIRTS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEbSRS3mLHrTK0gPNk1ex5lXIsYviC7aQj4dFD', 'Fine Pique Classic Polo - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Brutalist Cargo Shorts', NULL, c.id, sc.id, 110, 'Heavy architectural cotton shorts with flat cargo pockets flushed to the side seams. Hidden button flies, zero outward hardware, and clean raw edges.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORTS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE3fayMc0HK8kJPavuLVz4Y6fNItxUsge1WDr0', 'Brutalist Cargo Shorts - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '28', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '34', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '36', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Pleated Walk Shorts', NULL, c.id, sc.id, 135, 'Crisp wide-leg pleated shorts crafted from visual structure drill twill. Sharp front creasing ensures an impeccably modern street presence.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORTS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEtrK4fkbTPtG2vAUWXSOqIKdDbh4Cl1oYj87F', 'Pleated Walk Shorts - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '34', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '36', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Dual Chevron Athletic Shorts', NULL, c.id, sc.id, 95, 'Premium casual training shorts package containing a deep black pair and an off-white cream pair. Finished with a clean contrasting double-chevron logo at left hem.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORTS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEXM4RM2ZRLziG3at9m4TAh7UPob5QxeIwqCFr', 'Dual Chevron Athletic Shorts - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Circular Patch Sweat Shorts', NULL, c.id, sc.id, 85, 'Ultra cozy sweat shorts crafted in delicate pastel cream-yellow heavy fleece cotton. Featuring a high contrast custom circular branding emblem on left hem.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORTS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEAPi0y8oV5lNEKTWnCz1Up4vwd2Xgiek73Fht', 'Circular Patch Sweat Shorts - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'High-Waisted Denim Shorts', NULL, c.id, sc.id, 115, 'Relaxed premium high-waisted denim shorts. Authentic wash with raw cuffed hems and traditional five-pocket hardware.', 'FEMALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SHORTS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEVoOCZ3NNYWjzxmcAOB74Z8Hv2n1Ibr3Ch69s', 'High-Waisted Denim Shorts - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '26', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '28', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Architectural Pleated Trousers', NULL, c.id, sc.id, 175, 'Sculpted wide-leg pleated trousers in premium wool-blend twill. Deep front pleats create dramatic drape while maintaining a sharp architectural silhouette.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'TROUSERS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE87nSvsVIMZaPNfmeipXcLJWqKRH6QBhF94zs', 'Architectural Pleated Trousers - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '28', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '34', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '36', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Tailored Wool Trousers', NULL, c.id, sc.id, 220, 'Impeccably tailored flat-front trousers crafted from fine Italian wool. Clean lines, precise break, and a structured waistband for uncompromising elegance.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'TROUSERS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEcBGBc4t8eRPqlo7x1MrSztKYEZNJOIiQ0HLX', 'Tailored Wool Trousers - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '34', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '36', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Relaxed Linen Trousers', NULL, c.id, sc.id, 155, 'Breathable premium linen trousers with a relaxed drape and tapered ankle. Effortless warm-weather tailoring with a refined editorial finish.', 'MALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'TROUSERS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEbj77xPLHrTK0gPNk1ex5lXIsYviC7aQj4dFD', 'Relaxed Linen Trousers - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'S', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'M', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'L', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'XL', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Pleated Wide-Leg Trousers', NULL, c.id, sc.id, 195, 'Avant-garde wide-leg pleated trousers with dramatic volume and fluid movement. High-waisted silhouette with crisp front creases for editorial impact.', 'FEMALE', true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'TROUSERS' AND sc.category_id = c.id
  WHERE c.name = 'TROUSERS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEYCE8dZNzjkS9PKwZ46dx5W7iFzpNlXB1fnJO', 'Pleated Wide-Leg Trousers - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '26', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '28', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '30', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '32', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Monolith Trail Runner', NULL, c.id, sc.id, 195, 'Tech trail performance runner utilizing highly structured panels, breathable mesh base, and thick vulcanized lug outer grips for maximalist contrast appeal.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SNEAKERS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEHHVwsmARlSmHIkYjFBQP250ZDKehxarUs1c7', 'Monolith Trail Runner - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '45', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Off-white Vulc Trainer', NULL, c.id, sc.id, 140, 'Clean low profile sneakers featuring premium calf leather linings, dual stitched canvas upper panels, and a completely flat vulcanized custom out-sole.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SNEAKERS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEe15UeFYhSxE5az8rKbufW4CFo3X6PAJsNVMk', 'Off-white Vulc Trainer - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '39', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Avant-Garde Oxford', NULL, c.id, sc.id, 290, 'Avant-garde black leather lace-ups resting elegantly. Highly detailed seamless crafting, hard polished outer finish, and standard low profile block heel for uncompromised styling.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'OXFORDS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEhfILNAv1e0b3DZmJnv7Rzi4CM8tfUSPKlaFL', 'Avant-Garde Oxford - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '39', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Polished Box-Calf Derbies', NULL, c.id, sc.id, 330, 'Classic derby lace-ups using highly polished glass surface box-calf leather. Structured Goodyear Welt stitch construction guarantees eternal utility.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'OXFORDS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE2ZvHP8htr93IaJWxTEhYF6cek8B15UdRjK2y', 'Polished Box-Calf Derbies - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Chelsea Platform Boot', NULL, c.id, sc.id, 410, 'Sleek black calf leather ankle chelsea boot utilizing robust side stretch elastic inserts, heavy stack platform outsoles, and direct fit double pull-tabs.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'BOOTS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE7axFkB9F5bZsWuYNVxLR2M3oXJvcmD4Ky06i', 'Chelsea Platform Boot - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '45', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Minimal Street Sneaker', NULL, c.id, sc.id, 320, 'A minimalist, high-fashion street sneaker. Clean lines and a monochromatic cohesive design created for ultimate street presence.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'SNEAKERS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEacnTLIKV8HLDWcCTGblFhZ4qKQSwsoapX79k', 'Minimal Street Sneaker - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '45', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Industrial Leather Boot', NULL, c.id, sc.id, 480, 'A bold, heavy-duty black leather platform boot with a brutalist high-fashion aesthetic.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'BOOTS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEZ6Scr2GlqI12CPHO8Udiyf4GTpzk73sKwX0b', 'Industrial Leather Boot - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '44', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Classic Dark Loafer', NULL, c.id, sc.id, 280, 'A highly polished, dark brown leather loafer shoe embodying a minimalist modern luxury aesthetic.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'LOAFERS' AND sc.category_id = c.id
  WHERE c.name = 'SHOES'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEWBG1ivqsSuHLK1cqEvzP3Nr7ZV5MfetphyQF', 'Classic Dark Loafer - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '39', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '40', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '41', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '42', true);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '43', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Structured Canvas Tote', NULL, c.id, sc.id, 220, 'A durable structured black canvas tote bag. Perfect rectangular silhouette with rigid corners, flat hand straps, and clean minimalistic metal rivet reinforcements.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'TOTES' AND sc.category_id = c.id
  WHERE c.name = 'BAGS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEFiClB61V6J84DKrYbdxvZIW9BTiEOuzjhqfA', 'Structured Canvas Tote - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'OS', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Sleek Leather Clasp Bag', NULL, c.id, sc.id, 380, 'Meticulously crafted black structured leather bag resting on stark architectural geometries. Heavy premium leather hardware with precise magnetic clasp alignment.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'CLUTCHES' AND sc.category_id = c.id
  WHERE c.name = 'BAGS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKE3dlsEr0HK8kJPavuLVz4Y6fNItxUsge1WDr0', 'Sleek Leather Clasp Bag - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'OS', true);
END $do$;

DO $do$
DECLARE
  _pid UUID;
BEGIN
  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)
  SELECT 'Monolith Tech Backpack', NULL, c.id, sc.id, 260, 'Matte custom weathercoat outer nylon pack with seamless taped zip dividers. Includes structured hidden internal tech sleeve slots.', NULL, true, 100, false, '{}', '{}'
  FROM public.categories c
  LEFT JOIN public.sub_categories sc ON sc.name = 'BACKPACKS' AND sc.category_id = c.id
  WHERE c.name = 'BAGS'
  RETURNING id INTO _pid;
  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, 'https://utfs.io/f/rcR5Ive7JRKEV1dhSGNNYWjzxmcAOB74Z8Hv2n1Ibr3Ch69s', 'Monolith Tech Backpack - Image 1', 0);
  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, 'OS', true);
END $do$;

-- Re-enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
