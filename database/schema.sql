-- ============================================
-- SOLARA AUTO - Schema do Banco de Dados
-- Supabase (PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STORES - Lojas cadastradas
-- ============================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    phone TEXT NOT NULL,
    city TEXT,
    plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'premium', 'parceiro', 'exclusivo')),
    active BOOLEAN DEFAULT true,
    trial_ends_at TIMESTAMPTZ,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca rápida por slug
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_active ON stores(active);

-- ============================================
-- 2. VEHICLES - Veículos anunciados
-- ============================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('carro', 'moto')),
    brand TEXT NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX idx_vehicles_store_id ON vehicles(store_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX idx_vehicles_price ON vehicles(price);

-- ============================================
-- 3. VEHICLE_MEDIA - Fotos e vídeos
-- ============================================
CREATE TABLE vehicle_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    "order" INTEGER NOT NULL DEFAULT 0,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_media_vehicle_id ON vehicle_media(vehicle_id);
CREATE INDEX idx_media_store_id ON vehicle_media(store_id);
CREATE INDEX idx_media_order ON vehicle_media(vehicle_id, "order");

-- ============================================
-- 4. STORE_USERS - Usuários da loja
-- ============================================
CREATE TABLE store_users (
    id UUID PRIMARY KEY, -- Same as auth.users.id
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_store_users_store_id ON store_users(store_id);
CREATE INDEX idx_store_users_email ON store_users(email);

-- ============================================
-- 5. VEHICLE_VIEWS - Analytics (visualizações)
-- ============================================
CREATE TABLE vehicle_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Indexes
CREATE INDEX idx_views_vehicle_id ON vehicle_views(vehicle_id);
CREATE INDEX idx_views_store_id ON vehicle_views(store_id);
CREATE INDEX idx_views_date ON vehicle_views(viewed_at DESC);

-- ============================================
-- 6. VEHICLE_CONTACTS - Analytics (cliques WhatsApp)
-- ============================================
CREATE TABLE vehicle_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    contacted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET
);

-- Indexes
CREATE INDEX idx_contacts_vehicle_id ON vehicle_contacts(vehicle_id);
CREATE INDEX idx_contacts_store_id ON vehicle_contacts(store_id);
CREATE INDEX idx_contacts_date ON vehicle_contacts(contacted_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_contacts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies - STORES
-- ============================================

-- Público pode ver lojas ativas
CREATE POLICY "Stores are viewable by everyone when active"
    ON stores FOR SELECT
    USING (active = true);

-- Usuários autenticados podem ver sua própria loja
CREATE POLICY "Users can view their own store"
    ON stores FOR SELECT
    USING (
        id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS Policies - VEHICLES
-- ============================================

-- Público pode ver veículos disponíveis
CREATE POLICY "Vehicles are viewable by everyone when available"
    ON vehicles FOR SELECT
    USING (status = 'available');

-- Usuários autenticados podem ver todos os veículos da sua loja
CREATE POLICY "Users can view all vehicles from their store"
    ON vehicles FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- Usuários podem inserir veículos na sua loja
CREATE POLICY "Users can insert vehicles to their store"
    ON vehicles FOR INSERT
    WITH CHECK (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- Usuários podem atualizar veículos da sua loja
CREATE POLICY "Users can update vehicles from their store"
    ON vehicles FOR UPDATE
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- Usuários podem deletar veículos da sua loja
CREATE POLICY "Users can delete vehicles from their store"
    ON vehicles FOR DELETE
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS Policies - VEHICLE_MEDIA
-- ============================================

-- Público pode ver mídias
CREATE POLICY "Media is viewable by everyone"
    ON vehicle_media FOR SELECT
    USING (true);

-- Usuários podem gerenciar mídias da sua loja
CREATE POLICY "Users can insert media to their store"
    ON vehicle_media FOR INSERT
    WITH CHECK (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update media from their store"
    ON vehicle_media FOR UPDATE
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete media from their store"
    ON vehicle_media FOR DELETE
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS Policies - STORE_USERS
-- ============================================

-- Usuários podem ver outros usuários da sua loja
CREATE POLICY "Users can view users from their store"
    ON store_users FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS Policies - VEHICLE_VIEWS
-- ============================================

-- Insert público (qualquer um pode criar view)
CREATE POLICY "Anyone can create views"
    ON vehicle_views FOR INSERT
    WITH CHECK (true);

-- Usuários podem ver stats da sua loja
CREATE POLICY "Users can view stats from their store"
    ON vehicle_views FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS Policies - VEHICLE_CONTACTS
-- ============================================

-- Insert público
CREATE POLICY "Anyone can create contacts"
    ON vehicle_contacts FOR INSERT
    WITH CHECK (true);

-- Usuários podem ver contatos da sua loja
CREATE POLICY "Users can view contacts from their store"
    ON vehicle_contacts FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM store_users WHERE id = auth.uid()
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Função para registrar view de veículo
CREATE OR REPLACE FUNCTION record_vehicle_view(
    p_vehicle_id UUID,
    p_store_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO vehicle_views (vehicle_id, store_id, ip_address, user_agent)
    VALUES (p_vehicle_id, p_store_id, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar contato WhatsApp
CREATE OR REPLACE FUNCTION record_vehicle_contact(
    p_vehicle_id UUID,
    p_store_id UUID,
    p_ip_address INET DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO vehicle_contacts (vehicle_id, store_id, ip_address)
    VALUES (p_vehicle_id, p_store_id, p_ip_address);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (opcional - para testes)
-- ============================================

-- Inserir loja de exemplo
-- INSERT INTO stores (slug, name, phone, city, plan)
-- VALUES ('garagem-exemplo', 'Garagem Exemplo', '5511999999999', 'São Paulo', 'pro');
