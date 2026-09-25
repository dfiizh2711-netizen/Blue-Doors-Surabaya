-- ========================================================
-- BLUE DOORS SURABAYA — DEDICATED SCHEMA 'bluedoors'
-- Run this script in your existing Supabase SQL Editor
-- ========================================================

-- 1. Create dedicated schema 'bluedoors' to prevent any conflict with existing tables
CREATE SCHEMA IF NOT EXISTS bluedoors;

-- 2. Create Products / Menu Catalog Table
CREATE TABLE IF NOT EXISTS bluedoors.products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  desc TEXT,
  img VARCHAR(255),
  badge VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Table Reservations / Bookings Table
CREATE TABLE IF NOT EXISTS bluedoors.bookings (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests VARCHAR(20) DEFAULT '1-2',
  area VARCHAR(50) DEFAULT 'Indoor AC',
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Orders Table for Midtrans Payments
CREATE TABLE IF NOT EXISTS bluedoors.orders (
  id VARCHAR(100) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  order_type VARCHAR(100) DEFAULT 'Dine-in',
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_status VARCHAR(30) DEFAULT 'pending',
  midtrans_snap_token TEXT,
  midtrans_redirect_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Users / Customer Directory Table
CREATE TABLE IF NOT EXISTS bluedoors.users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  favorite_area VARCHAR(50) DEFAULT 'Indoor AC',
  total_visits INTEGER DEFAULT 1,
  status VARCHAR(30) DEFAULT 'Aktif',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Initial Products Data into bluedoors.products
INSERT INTO bluedoors.products (id, name, category, price, desc, img, badge, in_stock) VALUES
('p1', 'Kyoto Latte', 'specialty', 42000, 'Latte dingin khas Jepang dengan manis yang pas dan tekstur ekstra halus.', 'menus/Kyoto Latte.png', 'Terfavorit', true),
('p2', 'Fleur Noire', 'specialty', 45000, 'Racikan specialty espresso dengan sentuhan floral & keharuman alami.', 'menus/Fleur Noire.png', 'Signature', true),
('p3', 'White Velvet Latte', 'specialty', 44000, 'Latte lembut berminyak dengan rasa vanilla bourbon alami & susu steaming sempurna.', 'menus/White Velvet Latte.png', 'Best Seller', true),
('p4', 'Swiss Latte', 'specialty', 43000, 'Espresso racikan dengan sentuhan hazelnut halus & kekayaan rasa khas Swiss.', 'menus/Swiss Latte.png', 'Populer', true),
('p5', 'Grand Latte', 'specialty', 42000, 'Cita rasa espresso mantap dikombinasikan susu segar berkualitas.', 'menus/Grand Latte.png', null, true),
('p6', 'Hot Black', 'black', 35000, 'Ekstraksi espresso murni hangat dengan aroma biji kopi pilihan.', 'menus/Hot Black.png', null, true),
('p7', 'Ice Black', 'black', 37000, 'Espresso dingin yang menyegarkan dengan kejernihan rasa otentik.', 'menus/Ice Black.png', null, true),
('p8', 'Piccolo', 'black', 36000, 'Ristretto konsentrat tinggi dengan sedikit susu lembut hangat.', 'menus/Piccolo.png', null, true),
('p9', 'Hot Regular White', 'white', 38000, 'Kopi putih hangat berbusa halus dengan keseimbangan rasa yang pas.', 'menus/Hot Regular White.png', null, true),
('p10', 'Hot Large White', 'white', 42000, 'Porsi besar kopi putih hangat untuk kenikmatan ngopi lebih lama.', 'menus/Hot Large White.png', null, true),
('p11', 'Ice White', 'white', 40000, 'Kopi susu dingin klasik dengan cita rasa gurih dan manis seimbang.', 'menus/Ice White.png', null, true),
('p12', 'Ice Sweetened', 'white', 41000, 'Kopi susu dingin dengan manis alami gula aren pilihan.', 'menus/Ice Sweetened.png', null, true),
('p13', 'Hot Mocha', 'chocolate', 44000, 'Perpaduan sempurna espresso hangat dan cokelat artisanal pekat.', 'menus/Hot Mocha.png', null, true),
('p14', 'Ice Mocha', 'chocolate', 46000, 'Es kopi mocha dingin berpadu siram cokelat pilihan yang kaya rasa.', 'menus/Ice Mocha.png', null, true),
('p15', 'Chocolate', 'chocolate', 42000, 'Minuman cokelat murni kaya cita rasa tanpa espresso.', 'menus/Chocolate.png', 'Non-Kopi', true),
('p16', 'Matcha', 'noncoffee', 45000, 'Matcha murni khas Uji Jepang yang otentik dan menenangkan.', 'menus/Matcha.png', 'Favorit', true),
('p17', 'Strawberry Matcha Latte', 'noncoffee', 48000, 'Kreasi unik matcha Jepang dipadu selai stroberi segar & susu.', 'menus/Strawberry Matcha Latte.png', 'Spesial', true),
('p18', 'The Au Citron', 'noncoffee', 38000, 'Teh lemon dingin segar dengan wangi teh berkualitas & keasaman alami.', 'menus/The Au Citron.png', 'Segar', true)
ON CONFLICT (id) DO NOTHING;
