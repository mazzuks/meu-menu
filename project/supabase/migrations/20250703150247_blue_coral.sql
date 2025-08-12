/*
  # Meu Menu 🤖 - Base Database Schema

  1. New Tables
    - `profiles` - User profiles with preferences and restrictions
    - `receipts` - Uploaded receipts (NFC-e/DANFE)
    - `receipt_items` - Items extracted from receipts
    - `recipes` - Recipe database with nutritional info
    - `recipe_ingredients` - Ingredients for each recipe
    - `shopping_lists` - User shopping lists
    - `shopping_list_items` - Items in shopping lists
    - `user_inventory` - User's current inventory
    - `budget_goals` - User budget goals and tracking
    - `meal_plans` - User meal planning
    - `campaigns` - Marketing campaigns and banners
    - `notifications` - User notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure admin functions

  3. Indexes
    - Performance indexes for common queries
    - Full-text search indexes for recipes
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  avatar_url text,
  dietary_preferences text[] DEFAULT '{}',
  food_restrictions text[] DEFAULT '{}',
  fitness_goal text DEFAULT 'maintain',
  weight_goal numeric,
  current_weight numeric,
  height numeric,
  age integer,
  activity_level text DEFAULT 'moderate',
  weekly_budget numeric DEFAULT 0,
  monthly_budget numeric DEFAULT 0,
  preferred_language text DEFAULT 'pt-BR',
  dark_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receipt_type text DEFAULT 'nfce',
  access_key text,
  store_name text,
  store_cnpj text,
  issue_date date,
  total_amount numeric,
  tax_amount numeric,
  file_url text,
  ocr_data jsonb,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Receipt items table
CREATE TABLE IF NOT EXISTS receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES receipts(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  brand text,
  category text,
  quantity numeric NOT NULL,
  unit text DEFAULT 'un',
  unit_price numeric,
  total_price numeric,
  barcode text,
  ncm_code text,
  created_at timestamptz DEFAULT now()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  prep_time integer, -- minutes
  cook_time integer, -- minutes
  servings integer DEFAULT 1,
  difficulty text DEFAULT 'easy',
  cuisine_type text,
  meal_type text[], -- breakfast, lunch, dinner, snack
  dietary_tags text[] DEFAULT '{}', -- vegetarian, vegan, gluten-free, etc.
  is_healthy boolean DEFAULT false,
  calories_per_serving numeric,
  protein_per_serving numeric,
  carbs_per_serving numeric,
  fat_per_serving numeric,
  fiber_per_serving numeric,
  instructions text,
  tips text,
  cost_estimate numeric,
  popularity_score integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipe ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  quantity numeric,
  unit text,
  is_optional boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Shopping lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_date date,
  estimated_cost numeric,
  actual_cost numeric,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shopping list items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity numeric,
  unit text,
  estimated_price numeric,
  actual_price numeric,
  category text,
  priority integer DEFAULT 1,
  is_purchased boolean DEFAULT false,
  store_preference text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- User inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity numeric,
  unit text,
  expiry_date date,
  purchase_date date,
  location text, -- pantry, fridge, freezer
  category text,
  estimated_value numeric,
  barcode text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Budget goals table
CREATE TABLE IF NOT EXISTS budget_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  period text NOT NULL, -- weekly, monthly
  target_amount numeric NOT NULL,
  current_spent numeric DEFAULT 0,
  category text,
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date,
  end_date date,
  target_calories numeric,
  target_protein numeric,
  target_carbs numeric,
  target_fat numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Meal plan items table
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes(id),
  date date,
  meal_type text, -- breakfast, lunch, dinner, snack
  servings numeric DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  banner_url text,
  campaign_type text, -- promotion, seasonal, announcement
  target_audience text[], -- all, new_users, premium, etc.
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 1,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info', -- info, warning, success, error
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own receipts"
  ON receipts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view receipt items from their receipts"
  ON receipt_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM receipts WHERE receipts.id = receipt_items.receipt_id AND receipts.user_id = auth.uid()
  ));

CREATE POLICY "Users can view public recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage their own recipes"
  ON recipes FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = recipe_ingredients.recipe_id AND (recipes.is_public = true OR recipes.created_by = auth.uid())
  ));

CREATE POLICY "Users can manage their own shopping lists"
  ON shopping_lists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their shopping list items"
  ON shopping_list_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM shopping_lists WHERE shopping_lists.id = shopping_list_items.shopping_list_id AND shopping_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own inventory"
  ON user_inventory FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budget goals"
  ON budget_goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own meal plans"
  ON meal_plans FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their meal plan items"
  ON meal_plan_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans WHERE meal_plans.id = meal_plan_items.meal_plan_id AND meal_plans.user_id = auth.uid()
  ));

CREATE POLICY "Everyone can view active campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_issue_date ON receipts(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_recipes_title_search ON recipes USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING gin(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes USING gin(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list_id ON shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_expiry_date ON user_inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_budget_goals_user_id ON budget_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan_id ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_date ON meal_plan_items(date);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active, priority);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- Insert sample data
INSERT INTO campaigns (title, description, banner_url, campaign_type, start_date, end_date, is_active, priority) VALUES
('Bem-vindo ao Meu Menu 🤖', 'Descubra receitas incríveis baseadas nas suas compras!', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'announcement', CURRENT_DATE, CURRENT_DATE + interval '30 days', true, 1),
('Receitas de Verão', 'Pratos frescos e saborosos para a estação mais quente do ano', 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'seasonal', CURRENT_DATE, CURRENT_DATE + interval '60 days', true, 2);

-- Insert sample recipes
INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, cuisine_type, meal_type, dietary_tags, is_healthy, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, instructions, tips, cost_estimate, is_public) VALUES
('Salada de Quinoa com Legumes', 'Uma salada nutritiva e colorida, perfeita para uma refeição saudável', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 15, 0, 4, 'easy', 'brasileira', ARRAY['lunch', 'dinner'], ARRAY['vegetarian', 'gluten-free', 'healthy'], true, 280, 12, 35, 8, 'Cozinhe a quinoa conforme as instruções da embalagem. Corte os legumes em cubos pequenos. Misture tudo em uma tigela grande e tempere com azeite, limão, sal e pimenta.', 'Deixe a salada na geladeira por 30 minutos antes de servir para os sabores se misturarem melhor.', 15.50, true),
('Frango Grelhado com Batata Doce', 'Prato balanceado rico em proteínas e carboidratos complexos', 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 10, 25, 2, 'easy', 'brasileira', ARRAY['lunch', 'dinner'], ARRAY['high-protein', 'healthy'], true, 420, 35, 28, 12, 'Tempere o frango com sal, pimenta e ervas. Grelhe por 6-8 minutos de cada lado. Asse a batata doce em fatias por 20 minutos a 200°C.', 'Marinar o frango por algumas horas deixa o sabor mais intenso.', 12.80, true),
('Smoothie Verde Detox', 'Bebida nutritiva para começar o dia com energia', 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 5, 0, 1, 'easy', 'internacional', ARRAY['breakfast', 'snack'], ARRAY['vegan', 'gluten-free', 'detox'], true, 180, 6, 28, 4, 'Bata todos os ingredientes no liquidificador até ficar homogêneo. Sirva imediatamente.', 'Adicione cubos de gelo para deixar mais refrescante.', 8.50, true);

-- Insert sample recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit, is_optional) VALUES
-- Salada de Quinoa
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Quinoa', 1, 'xícara', false),
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Tomate cereja', 200, 'g', false),
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Pepino', 1, 'unidade', false),
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Pimentão amarelo', 1, 'unidade', false),
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Azeite de oliva', 3, 'colheres de sopa', false),
((SELECT id FROM recipes WHERE title = 'Salada de Quinoa com Legumes'), 'Limão', 1, 'unidade', false),
-- Frango Grelhado
((SELECT id FROM recipes WHERE title = 'Frango Grelhado com Batata Doce'), 'Peito de frango', 500, 'g', false),
((SELECT id FROM recipes WHERE title = 'Frango Grelhado com Batata Doce'), 'Batata doce', 400, 'g', false),
((SELECT id FROM recipes WHERE title = 'Frango Grelhado com Batata Doce'), 'Alecrim', 1, 'ramo', true),
((SELECT id FROM recipes WHERE title = 'Frango Grelhado com Batata Doce'), 'Alho', 2, 'dentes', false),
-- Smoothie Verde
((SELECT id FROM recipes WHERE title = 'Smoothie Verde Detox'), 'Espinafre', 1, 'xícara', false),
((SELECT id FROM recipes WHERE title = 'Smoothie Verde Detox'), 'Banana', 1, 'unidade', false),
((SELECT id FROM recipes WHERE title = 'Smoothie Verde Detox'), 'Maçã verde', 1, 'unidade', false),
((SELECT id FROM recipes WHERE title = 'Smoothie Verde Detox'), 'Água de coco', 200, 'ml', false),
((SELECT id FROM recipes WHERE title = 'Smoothie Verde Detox'), 'Gengibre', 1, 'cm', true);