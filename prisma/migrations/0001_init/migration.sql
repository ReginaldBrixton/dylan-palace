-- ============================================
-- Dylan's Palace — Prisma Schema Migration
-- Generated from prisma/schema.prisma
-- Apply this in the Supabase SQL Editor
-- ============================================

-- Drop old tables if they exist (clean slate)
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.product_sizes CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.sub_categories CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
-- Keep profiles if it exists (linked to auth.users)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- ENUM TYPES
-- ============================================
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('customer', 'seller');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ProductCategoryName" AS ENUM ('SHIRTS', 'TROUSERS', 'SHOES', 'BAGS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('MOMO', 'DELIVERY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role "UserRole" NOT NULL DEFAULT 'customer',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CATEGORIES TABLE (lookup)
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name "ProductCategoryName" NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- ============================================
-- SUB-CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sub_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "sub_categories_category_id_idx" ON public.sub_categories(category_id);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  sub_category_id INTEGER REFERENCES public.sub_categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  gender "Gender",
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON public.products(category_id);
CREATE INDEX IF NOT EXISTS "products_sub_category_id_idx" ON public.products(sub_category_id);
CREATE INDEX IF NOT EXISTS "products_is_featured_idx" ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS "products_in_stock_idx" ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS "products_price_idx" ON public.products(price);
CREATE INDEX IF NOT EXISTS "products_name_idx" ON public.products(name);
CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON public.products(created_at);
-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "products_category_id_in_stock_idx" ON public.products(category_id, in_stock);
CREATE INDEX IF NOT EXISTS "products_is_featured_in_stock_idx" ON public.products(is_featured, in_stock);

-- ============================================
-- PRODUCT IMAGES TABLE (separate, ordered)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS "product_images_product_id_position_idx" ON public.product_images(product_id, position);

-- ============================================
-- PRODUCT SIZES TABLE (per-size stock tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(product_id, size)
);
CREATE INDEX IF NOT EXISTS "product_sizes_product_id_idx" ON public.product_sizes(product_id);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status "OrderStatus" NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT,
  payment_method "PaymentMethod" NOT NULL,
  momo_network TEXT,
  momo_number TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON public.orders(status);
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS "orders_order_number_idx" ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS "orders_status_created_at_idx" ON public.orders(status, created_at);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS "order_items_order_id_product_id_idx" ON public.order_items(order_id, product_id);

-- ============================================
-- WISHLIST TABLE (many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS "wishlist_user_id_idx" ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS "wishlist_product_id_idx" ON public.wishlist(product_id);

-- ============================================
-- SEED CATEGORIES
-- ============================================
INSERT INTO public.categories (name, display_name, slug) VALUES
  ('SHIRTS', 'Shirts', 'shirts'),
  ('TROUSERS', 'Trousers', 'trousers'),
  ('SHOES', 'Shoes', 'shoes'),
  ('BAGS', 'Bags', 'bags')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED SUB-CATEGORIES
-- ============================================
INSERT INTO public.sub_categories (name, display_name, slug, category_id)
SELECT v.name, v.display_name, v.slug, c.id
FROM (VALUES
  ('SHORT SLEEVES', 'Short Sleeves', 'short-sleeves', 'SHIRTS'),
  ('LONG SLEEVES', 'Long Sleeves', 'long-sleeves', 'SHIRTS'),
  ('SINGLETS', 'Singlets', 'singlets', 'SHIRTS'),
  ('SHORTS', 'Shorts', 'shorts', 'TROUSERS'),
  ('TROUSERS', 'Trousers', 'trousers-pants', 'TROUSERS'),
  ('SNEAKERS', 'Sneakers', 'sneakers', 'SHOES'),
  ('OXFORDS', 'Oxfords', 'oxfords', 'SHOES'),
  ('LOAFERS', 'Loafers', 'loafers', 'SHOES'),
  ('BOOTS', 'Boots', 'boots', 'SHOES'),
  ('TOTES', 'Totes', 'totes', 'BAGS'),
  ('CLUTCHES', 'Clutches', 'clutches', 'BAGS'),
  ('BACKPACKS', 'Backpacks', 'backpacks', 'BAGS')
) AS v(name, display_name, slug, category_name)
JOIN public.categories c ON c.name = v.category_name::"ProductCategoryName"
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::"UserRole"
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Categories are public (no RLS needed, but enable for consistency)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

-- Profiles: owner or seller can read, owner can update
DROP POLICY IF EXISTS "Profiles viewable by owner or seller" ON public.profiles;
CREATE POLICY "Profiles viewable by owner or seller" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: public read
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
CREATE POLICY "Categories viewable by everyone" ON public.categories
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Sub-categories viewable by everyone" ON public.sub_categories;
CREATE POLICY "Sub-categories viewable by everyone" ON public.sub_categories
  FOR SELECT USING (true);

-- Products: public read, seller write
DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
CREATE POLICY "Products viewable by everyone" ON public.products
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Products insert by sellers only" ON public.products;
CREATE POLICY "Products insert by sellers only" ON public.products
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Products update by sellers only" ON public.products;
CREATE POLICY "Products update by sellers only" ON public.products
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Products delete by sellers only" ON public.products;
CREATE POLICY "Products delete by sellers only" ON public.products
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));

-- Product images: public read, seller write (via product ownership)
DROP POLICY IF EXISTS "Product images viewable by everyone" ON public.product_images;
CREATE POLICY "Product images viewable by everyone" ON public.product_images
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Product images insert by sellers" ON public.product_images;
CREATE POLICY "Product images insert by sellers" ON public.product_images
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Product images update by sellers" ON public.product_images;
CREATE POLICY "Product images update by sellers" ON public.product_images
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Product images delete by sellers" ON public.product_images;
CREATE POLICY "Product images delete by sellers" ON public.product_images
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));

-- Product sizes: public read, seller write
DROP POLICY IF EXISTS "Product sizes viewable by everyone" ON public.product_sizes;
CREATE POLICY "Product sizes viewable by everyone" ON public.product_sizes
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Product sizes insert by sellers" ON public.product_sizes;
CREATE POLICY "Product sizes insert by sellers" ON public.product_sizes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Product sizes update by sellers" ON public.product_sizes;
CREATE POLICY "Product sizes update by sellers" ON public.product_sizes
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));
DROP POLICY IF EXISTS "Product sizes delete by sellers" ON public.product_sizes;
CREATE POLICY "Product sizes delete by sellers" ON public.product_sizes
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));

-- Orders: owner or seller can read, authenticated can insert, seller can update
DROP POLICY IF EXISTS "Orders viewable by owner or seller" ON public.orders;
CREATE POLICY "Orders viewable by owner or seller" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
    )
  );
DROP POLICY IF EXISTS "Orders insert by authenticated users" ON public.orders;
CREATE POLICY "Orders insert by authenticated users" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Orders update by seller only" ON public.orders;
CREATE POLICY "Orders update by seller only" ON public.orders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
  ));

-- Order items: owner or seller can read, authenticated can insert
DROP POLICY IF EXISTS "Order items viewable by order owner or seller" ON public.order_items;
CREATE POLICY "Order items viewable by order owner or seller" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
    )))
  );
DROP POLICY IF EXISTS "Order items insert by authenticated users" ON public.order_items;
CREATE POLICY "Order items insert by authenticated users" ON public.order_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Wishlist: owner only
DROP POLICY IF EXISTS "Wishlist viewable by owner" ON public.wishlist;
CREATE POLICY "Wishlist viewable by owner" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Wishlist insert by owner" ON public.wishlist;
CREATE POLICY "Wishlist insert by owner" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Wishlist delete by owner" ON public.wishlist;
CREATE POLICY "Wishlist delete by owner" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);
