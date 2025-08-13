/*
  # Sistema de Promoções e Sorteios

  1. New Tables
    - `sweepstakes` - Promoções e sorteios capturados automaticamente
    - `user_sweepstakes` - Participações dos usuários
    - `sweepstakes_sources` - Fontes de dados para crawler

  2. Security
    - Enable RLS on all tables
    - Add policies for data access

  3. Indexes
    - Performance indexes for sweepstakes queries
*/

-- Sweepstakes table
CREATE TABLE IF NOT EXISTS sweepstakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  brand text,
  url text UNIQUE NOT NULL,
  image_url text,
  start_date date,
  end_date date,
  prize_description text,
  participation_type text DEFAULT 'online', -- online, in_store, hybrid
  requirements text[],
  is_active boolean DEFAULT true,
  source text DEFAULT 'manual', -- manual, crawler, api
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sweepstakes participation
CREATE TABLE IF NOT EXISTS user_sweepstakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sweepstake_id uuid REFERENCES sweepstakes(id) ON DELETE CASCADE,
  participated_at timestamptz DEFAULT now(),
  participation_method text, -- website, app, store
  notes text,
  UNIQUE(user_id, sweepstake_id)
);

-- Sweepstakes sources for crawler
CREATE TABLE IF NOT EXISTS sweepstakes_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  selector_config jsonb, -- CSS selectors for scraping
  is_active boolean DEFAULT true,
  last_crawled_at timestamptz,
  crawl_frequency_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sweepstakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sweepstakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sweepstakes_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view active sweepstakes"
  ON sweepstakes FOR SELECT
  TO authenticated
  USING (is_active = true AND end_date >= CURRENT_DATE);

CREATE POLICY "Users can manage their sweepstakes participation"
  ON user_sweepstakes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage sweepstakes sources"
  ON sweepstakes_sources FOR ALL
  TO authenticated
  USING (true); -- Add proper admin check later

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sweepstakes_dates ON sweepstakes(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_sweepstakes_active ON sweepstakes(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_sweepstakes_brand ON sweepstakes(brand);
CREATE INDEX IF NOT EXISTS idx_user_sweepstakes_user_id ON user_sweepstakes(user_id);
CREATE INDEX IF NOT EXISTS idx_sweepstakes_sources_active ON sweepstakes_sources(is_active);

-- Insert sample sweepstakes sources
INSERT INTO sweepstakes_sources (name, url, selector_config) VALUES
('Portal da Promo', 'https://portaldapromo.com.br/promocoes/ativas', '{
  "container": ".promo-card",
  "title": ".promo-title",
  "url": "a",
  "image": "img",
  "dates": ".promo-validity",
  "brand": ".promo-brand"
}'),
('Colheita de Prêmios', 'https://colheitadepremios.com.br/promocoes', '{
  "container": ".promocao-item",
  "title": ".titulo",
  "url": ".link",
  "image": ".imagem",
  "dates": ".periodo",
  "brand": ".marca"
}');

-- Insert sample sweepstakes
INSERT INTO sweepstakes (title, description, brand, url, image_url, start_date, end_date, prize_description, participation_type, requirements) VALUES
('Promoção Verão 2025', 'Concorra a uma viagem para o Caribe comprando produtos de verão', 'Supermercado ABC', 'https://example.com/promo-verao', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', CURRENT_DATE, CURRENT_DATE + interval '30 days', 'Viagem para o Caribe para 2 pessoas', 'in_store', ARRAY['Compra mínima de R$ 100', 'Produtos participantes', 'Cadastro no app']),
('Natal Premiado', 'Sorteio de cestas natalinas e vale-compras', 'Rede XYZ', 'https://example.com/natal-premiado', 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', CURRENT_DATE - interval '5 days', CURRENT_DATE + interval '25 days', '10 cestas natalinas + vale-compras de R$ 500', 'hybrid', ARRAY['Compra de produtos natalinos', 'Participação online ou na loja']),
('Ano Novo, Vida Nova', 'Concorra a um ano de compras grátis', 'Mercado 123', 'https://example.com/ano-novo', 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', CURRENT_DATE + interval '10 days', CURRENT_DATE + interval '40 days', 'Um ano de compras grátis (até R$ 10.000)', 'online', ARRAY['Cadastro no site', 'Compartilhar nas redes sociais']);