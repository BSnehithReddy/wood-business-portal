-- ============================================================
-- MM WOOD BOARDS & LAMINATES - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. DEALERS TABLE
CREATE TABLE IF NOT EXISTS public.dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    firm_name TEXT NOT NULL,
    password TEXT NOT NULL,
    address TEXT DEFAULT 'Hyderabad',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. OWNERS TABLE
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. WORKERS TABLE
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    bay_no TEXT DEFAULT 'Bay 4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    spec TEXT,
    price NUMERIC NOT NULL,
    price_unit TEXT DEFAULT 'sheet',
    is_in_stock BOOLEAN DEFAULT true,
    min_order INTEGER DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    dealer_firm TEXT NOT NULL,
    contact TEXT NOT NULL,
    items JSONB NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    grand_total NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) and public access rules
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for portal operations
CREATE POLICY "Allow public all access on dealers" ON public.dealers FOR ALL USING (true);
CREATE POLICY "Allow public all access on owners" ON public.owners FOR ALL USING (true);
CREATE POLICY "Allow public all access on workers" ON public.workers FOR ALL USING (true);
CREATE POLICY "Allow public all access on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public all access on orders" ON public.orders FOR ALL USING (true);

-- Insert Default Owner
INSERT INTO public.owners (phone, name, password)
VALUES ('9849000000', 'Owner Proprietor', 'owner123')
ON CONFLICT (phone) DO NOTHING;

-- Insert Default Worker
INSERT INTO public.workers (phone, name, password, bay_no)
VALUES ('9000000000', 'Worker Staff', 'worker123', 'Bay 4')
ON CONFLICT (phone) DO NOTHING;

-- Insert Default Dealer
INSERT INTO public.dealers (phone, firm_name, password, address)
VALUES ('9849012345', 'Shree Venkateshwara Hardware & Timber', 'dealer123', 'Plot 42, Industrial Area, Phase II, Hyderabad')
ON CONFLICT (phone) DO NOTHING;
