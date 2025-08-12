/*
  # Sistema de Feriados e Datas Comemorativas

  1. New Tables
    - `holidays` - Feriados e datas comemorativas
    - `holiday_recipes` - Receitas associadas a feriados
    - `holiday_promotions` - Promoções de supermercados para feriados
    - `user_holiday_preferences` - Preferências do usuário para feriados

  2. Security
    - Enable RLS on all tables
    - Add policies for data access

  3. Indexes
    - Performance indexes for holiday queries
*/

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date text NOT NULL, -- MM-DD format for recurring, YYYY-MM-DD for specific
  category text NOT NULL CHECK (category IN ('national', 'state', 'culinary', 'religious')),
  state text, -- For state holidays
  description text,
  suggested_dishes text[] DEFAULT '{}',
  dietary_restrictions text[] DEFAULT '{}',
  is_recurring boolean DEFAULT true,
  marketing_tags text[] DEFAULT '{}',
  promotion_ideas text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Holiday recipes association table
CREATE TABLE IF NOT EXISTS holiday_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id uuid REFERENCES holidays(id) ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  relevance_score integer DEFAULT 1, -- 1-10 scale
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(holiday_id, recipe_id)
);

-- Holiday promotions for supermarkets
CREATE TABLE IF NOT EXISTS holiday_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id uuid REFERENCES holidays(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount_percentage numeric,
  start_date date,
  end_date date,
  target_products text[] DEFAULT '{}',
  promotion_type text DEFAULT 'discount', -- discount, bundle, special_offer
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- User holiday preferences
CREATE TABLE IF NOT EXISTS user_holiday_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  holiday_id uuid REFERENCES holidays(id) ON DELETE CASCADE,
  is_interested boolean DEFAULT true,
  notification_enabled boolean DEFAULT true,
  preferred_dishes text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, holiday_id)
);

-- Enable Row Level Security
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_holiday_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view holidays"
  ON holidays FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Everyone can view holiday recipes"
  ON holiday_recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Everyone can view active promotions"
  ON holiday_promotions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage their holiday preferences"
  ON user_holiday_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_category ON holidays(category);
CREATE INDEX IF NOT EXISTS idx_holidays_state ON holidays(state);
CREATE INDEX IF NOT EXISTS idx_holidays_active ON holidays(is_active);
CREATE INDEX IF NOT EXISTS idx_holiday_recipes_holiday_id ON holiday_recipes(holiday_id);
CREATE INDEX IF NOT EXISTS idx_holiday_recipes_recipe_id ON holiday_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_holiday_promotions_holiday_id ON holiday_promotions(holiday_id);
CREATE INDEX IF NOT EXISTS idx_holiday_promotions_dates ON holiday_promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_user_holiday_preferences_user_id ON user_holiday_preferences(user_id);

-- Insert Brazilian holidays data
INSERT INTO holidays (name, date, category, state, description, suggested_dishes, dietary_restrictions, marketing_tags, promotion_ideas) VALUES
-- National Holidays
('Ano Novo', '01-01', 'national', NULL, 'Celebração do início do novo ano', 
 ARRAY['Lentilha com linguiça', 'Champagne e espumante', 'Uvas verdes', 'Romã', 'Tender assado'], 
 ARRAY[]::text[], 
 ARRAY['prosperidade', 'sorte', 'renovação', 'festa'], 
 ARRAY['Kit Ano Novo (lentilha + linguiça + uvas)', 'Promoção de espumantes', 'Cestas de frutas da sorte']),

('Carnaval', '02-12', 'national', NULL, 'Festa popular brasileira', 
 ARRAY['Feijoada completa', 'Caipirinha', 'Pastéis variados', 'Coxinha', 'Brigadeiro', 'Cerveja gelada'], 
 ARRAY[]::text[], 
 ARRAY['festa', 'tradição', 'alegria', 'comida de rua'], 
 ARRAY['Kit Feijoada completa', 'Promoção de bebidas geladas', 'Ingredientes para salgadinhos']),

('Tiradentes', '04-21', 'national', NULL, 'Feriado nacional em homenagem ao mártir da Inconfidência Mineira', 
 ARRAY['Pão de açúcar', 'Feijão tropeiro', 'Frango com quiabo', 'Doce de leite', 'Queijo minas'], 
 ARRAY[]::text[], 
 ARRAY['tradição mineira', 'feriado prolongado', 'família'], 
 ARRAY['Produtos típicos de Minas Gerais', 'Kit churrasco para feriado', 'Promoção de queijos']),

('Dia do Trabalhador', '05-01', 'national', NULL, 'Dia Internacional do Trabalhador', 
 ARRAY['Churrasco', 'Cerveja', 'Farofa', 'Vinagrete', 'Pão de alho', 'Picanha', 'Linguiça'], 
 ARRAY[]::text[], 
 ARRAY['churrasco', 'família', 'descanso', 'confraternização'], 
 ARRAY['Kit churrasco completo', 'Promoção de carnes nobres', 'Combo bebidas + carvão']),

('Independência do Brasil', '09-07', 'national', NULL, 'Proclamação da Independência do Brasil', 
 ARRAY['Feijoada', 'Caipirinha', 'Brigadeiro', 'Beijinho', 'Coxinha', 'Pão de açúcar'], 
 ARRAY[]::text[], 
 ARRAY['patriotismo', 'tradição brasileira', 'verde e amarelo'], 
 ARRAY['Pratos típicos brasileiros', 'Decoração verde e amarela', 'Promoção de produtos nacionais']),

('Nossa Senhora Aparecida', '10-12', 'national', NULL, 'Padroeira do Brasil', 
 ARRAY['Peixe assado', 'Bacalhau', 'Arroz de forno', 'Legumes refogados', 'Suco natural'], 
 ARRAY['sem carne vermelha'], 
 ARRAY['religioso', 'peixe', 'simplicidade', 'devoção'], 
 ARRAY['Promoção de peixes frescos', 'Receitas com bacalhau', 'Ingredientes para pratos simples']),

('Finados', '11-02', 'national', NULL, 'Dia de oração pelos mortos', 
 ARRAY['Comida caseira simples', 'Sopa de legumes', 'Pão caseiro', 'Chá', 'Frutas'], 
 ARRAY[]::text[], 
 ARRAY['simplicidade', 'família', 'memória', 'caseiro'], 
 ARRAY['Ingredientes para comida caseira', 'Promoção de chás e cafés', 'Receitas tradicionais']),

('Proclamação da República', '11-15', 'national', NULL, 'Proclamação da República do Brasil', 
 ARRAY['Churrasco', 'Feijoada', 'Caipirinha', 'Farofa', 'Vinagrete'], 
 ARRAY[]::text[], 
 ARRAY['história', 'tradição', 'confraternização'], 
 ARRAY['Pratos históricos brasileiros', 'Kit churrasco patriótico', 'Bebidas tradicionais']),

('Natal', '12-25', 'national', NULL, 'Celebração do nascimento de Jesus Cristo', 
 ARRAY['Peru assado', 'Chester', 'Tender', 'Farofa de passas', 'Arroz à grega', 'Salpicão', 'Rabanada', 'Panettone'], 
 ARRAY[]::text[], 
 ARRAY['família', 'ceia', 'tradição', 'celebração'], 
 ARRAY['Kit ceia de Natal completa', 'Promoção de aves natalinas', 'Vinhos e espumantes especiais']),

-- Culinary Holidays
('Dia da Pizza', '07-10', 'culinary', NULL, 'Celebração da pizza no Brasil', 
 ARRAY['Massa de pizza', 'Molho de tomate', 'Queijo mussarela', 'Calabresa', 'Presunto', 'Champignon'], 
 ARRAY[]::text[], 
 ARRAY['pizza', 'família', 'praticidade', 'sabor'], 
 ARRAY['Kit pizza completo', 'Promoção de ingredientes para pizza', 'Massas prontas em oferta']),

('Dia Nacional da Cachaça', '09-13', 'culinary', NULL, 'Celebração da bebida nacional brasileira', 
 ARRAY['Cachaça artesanal', 'Limão', 'Açúcar cristal', 'Carne de sol', 'Queijo coalho'], 
 ARRAY[]::text[], 
 ARRAY['tradição brasileira', 'caipirinha', 'nordeste'], 
 ARRAY['Promoção de cachaças premium', 'Kit caipirinha', 'Petiscos nordestinos']),

('Dia Nacional do Café', '05-24', 'culinary', NULL, 'Celebração do café brasileiro', 
 ARRAY['Café especial', 'Café expresso', 'Pão de açúcar', 'Biscoitos', 'Bolo de fubá'], 
 ARRAY[]::text[], 
 ARRAY['café brasileiro', 'qualidade', 'tradição', 'energia'], 
 ARRAY['Degustação de cafés especiais', 'Kit café da manhã', 'Promoção de grãos premium']),

('Dia do Churrasco', '04-24', 'culinary', NULL, 'Celebração do churrasco brasileiro', 
 ARRAY['Picanha', 'Costela', 'Linguiça', 'Fraldinha', 'Farofa', 'Vinagrete', 'Pão de alho'], 
 ARRAY[]::text[], 
 ARRAY['churrasco', 'família', 'fim de semana', 'confraternização'], 
 ARRAY['Kit churrasco premium', 'Promoção de carnes nobres', 'Combo carvão + acendedor']),

-- Religious Holidays
('Sexta-feira Santa', '03-29', 'religious', NULL, 'Paixão e morte de Jesus Cristo', 
 ARRAY['Bacalhau', 'Peixe assado', 'Camarão', 'Arroz de forno', 'Legumes refogados'], 
 ARRAY['sem carne vermelha', 'sem carne de porco', 'sem frango'], 
 ARRAY['quaresma', 'peixe', 'reflexão', 'tradição cristã'], 
 ARRAY['Promoção especial de peixes', 'Receitas com bacalhau', 'Kit Sexta-feira Santa']),

('Páscoa', '03-31', 'religious', NULL, 'Ressurreição de Jesus Cristo', 
 ARRAY['Chocolate', 'Ovos de Páscoa', 'Colomba pascal', 'Cordeiro', 'Bacalhau', 'Peixe'], 
 ARRAY[]::text[], 
 ARRAY['páscoa', 'chocolate', 'família', 'renovação'], 
 ARRAY['Ovos de Páscoa em promoção', 'Kit almoço de Páscoa', 'Chocolates especiais']),

('Corpus Christi', '05-30', 'religious', NULL, 'Celebração do Corpo de Cristo', 
 ARRAY['Pão', 'Vinho', 'Peixe', 'Arroz branco', 'Legumes cozidos', 'Frutas'], 
 ARRAY[]::text[], 
 ARRAY['religioso', 'simplicidade', 'comunhão'], 
 ARRAY['Ingredientes para refeições simples', 'Pães especiais', 'Sucos naturais']),

-- Special Dates
('Dia das Mães', '05-12', 'culinary', NULL, 'Homenagem às mães', 
 ARRAY['Bolo de chocolate', 'Champagne', 'Salmão', 'Risotto', 'Sobremesas especiais', 'Frutas vermelhas'], 
 ARRAY[]::text[], 
 ARRAY['mães', 'carinho', 'especial', 'celebração'], 
 ARRAY['Kit almoço especial para mães', 'Ingredientes para sobremesas', 'Flores e chocolates']),

('Dia dos Pais', '08-11', 'culinary', NULL, 'Homenagem aos pais', 
 ARRAY['Churrasco', 'Cerveja especial', 'Picanha', 'Costela', 'Farofa', 'Vinagrete'], 
 ARRAY[]::text[], 
 ARRAY['pais', 'churrasco', 'confraternização', 'família'], 
 ARRAY['Kit churrasco do papai', 'Bebidas especiais', 'Carnes premium']),

('Dia dos Namorados', '06-12', 'culinary', NULL, 'Dia dos namorados no Brasil', 
 ARRAY['Chocolate', 'Morango', 'Champagne', 'Vinho tinto', 'Salmão', 'Camarão', 'Fondue'], 
 ARRAY[]::text[], 
 ARRAY['romance', 'jantar a dois', 'especial', 'intimidade'], 
 ARRAY['Kit jantar romântico', 'Vinhos e espumantes', 'Ingredientes para fondue']),

-- State Holidays (Examples)
('Aniversário de São Paulo', '01-25', 'state', 'SP', 'Fundação da cidade de São Paulo', 
 ARRAY['Mortadela', 'Pão francês', 'Pastel de feira', 'Caldo de cana', 'Pizza'], 
 ARRAY[]::text[], 
 ARRAY['paulistano', 'tradição urbana', 'comida de rua'], 
 ARRAY['Ingredientes para lanches paulistanos', 'Promoção de mortadela e pães']),

('Aniversário do Rio de Janeiro', '04-23', 'state', 'RJ', 'Fundação da cidade do Rio de Janeiro', 
 ARRAY['Feijoada carioca', 'Caipirinha', 'Biscoito Globo', 'Mate gelado', 'Açaí'], 
 ARRAY[]::text[], 
 ARRAY['carioca', 'praia', 'descontração'], 
 ARRAY['Kit feijoada carioca', 'Bebidas geladas', 'Produtos típicos do Rio']);