/*
  # Sistema de Tipos de Usuário e Permissões

  1. New Tables
    - `user_roles` - Tipos de usuário (normal, manager, client)
    - `user_permissions` - Permissões específicas por usuário
    - `client_integrations` - Integrações de clientes com APIs
    - `manager_assignments` - Atribuições de gerenciadores

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure admin and client functions

  3. User Types
    - `normal` - Usuários finais (pessoas do dia a dia)
    - `manager` - Funcionários da empresa (gerenciadores)
    - `client` - Clientes empresariais (supermercados)
*/

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role_type text NOT NULL CHECK (role_type IN ('normal', 'manager', 'client')),
  role_level integer DEFAULT 1, -- 1=basic, 2=advanced, 3=admin
  company_name text, -- For client users
  company_cnpj text, -- For client users
  department text, -- For manager users
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Client integrations table
CREATE TABLE IF NOT EXISTS client_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type text NOT NULL, -- api, webhook, file_upload, etc.
  api_key text UNIQUE,
  webhook_url text,
  allowed_endpoints text[] DEFAULT '{}',
  rate_limit_per_hour integer DEFAULT 1000,
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  usage_count integer DEFAULT 0,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Manager assignments table
CREATE TABLE IF NOT EXISTS manager_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_type text DEFAULT 'support', -- support, sales, technical
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(manager_user_id, assigned_client_id, assignment_type)
);

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- API usage logs for clients
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id uuid REFERENCES client_integrations(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer,
  response_time_ms integer,
  request_size_bytes integer,
  response_size_bytes integer,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view roles of assigned clients"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
    ) AND (
      role_type = 'normal' OR 
      EXISTS (
        SELECT 1 FROM manager_assignments ma 
        WHERE ma.manager_user_id = auth.uid() 
        AND ma.assigned_client_id = user_roles.user_id
      )
    )
  );

CREATE POLICY "Managers can manage user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
      AND ur.role_level >= 2
    )
  );

-- RLS Policies for client_integrations
CREATE POLICY "Clients can manage their own integrations"
  ON client_integrations FOR ALL
  TO authenticated
  USING (auth.uid() = client_user_id);

CREATE POLICY "Managers can view client integrations"
  ON client_integrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
    ) AND (
      EXISTS (
        SELECT 1 FROM manager_assignments ma 
        WHERE ma.manager_user_id = auth.uid() 
        AND ma.assigned_client_id = client_integrations.client_user_id
      )
    )
  );

-- RLS Policies for manager_assignments
CREATE POLICY "Managers can view their assignments"
  ON manager_assignments FOR SELECT
  TO authenticated
  USING (auth.uid() = manager_user_id);

CREATE POLICY "Senior managers can manage assignments"
  ON manager_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
      AND ur.role_level >= 3
    )
  );

-- RLS Policies for activity logs
CREATE POLICY "Users can view their own activity"
  ON user_activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view activity of assigned users"
  ON user_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
    ) AND (
      EXISTS (
        SELECT 1 FROM manager_assignments ma 
        WHERE ma.manager_user_id = auth.uid() 
        AND ma.assigned_client_id = user_activity_logs.user_id
      ) OR
      EXISTS (
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = user_activity_logs.user_id
        AND ur2.role_type = 'normal'
      )
    )
  );

-- RLS Policies for API usage logs
CREATE POLICY "Clients can view their own API usage"
  ON api_usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = client_user_id);

CREATE POLICY "Managers can view API usage of assigned clients"
  ON api_usage_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role_type = 'manager'
    ) AND (
      EXISTS (
        SELECT 1 FROM manager_assignments ma 
        WHERE ma.manager_user_id = auth.uid() 
        AND ma.assigned_client_id = api_usage_logs.client_user_id
      )
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_type ON user_roles(role_type);
CREATE INDEX IF NOT EXISTS idx_client_integrations_user_id ON client_integrations(client_user_id);
CREATE INDEX IF NOT EXISTS idx_client_integrations_api_key ON client_integrations(api_key);
CREATE INDEX IF NOT EXISTS idx_manager_assignments_manager ON manager_assignments(manager_user_id);
CREATE INDEX IF NOT EXISTS idx_manager_assignments_client ON manager_assignments(assigned_client_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_client_id ON api_usage_logs(client_user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);

-- Functions to check user permissions
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role_type INTO user_role
  FROM user_roles
  WHERE user_id = user_uuid AND is_active = true;
  
  RETURN COALESCE(user_role, 'normal');
END;
$$;

CREATE OR REPLACE FUNCTION has_permission(user_uuid uuid, permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_permissions jsonb;
  user_role text;
BEGIN
  SELECT role_type, permissions INTO user_role, user_permissions
  FROM user_roles
  WHERE user_id = user_uuid AND is_active = true;
  
  -- Default permissions by role
  IF user_role = 'manager' THEN
    RETURN true; -- Managers have most permissions
  END IF;
  
  IF user_role = 'client' THEN
    -- Clients have limited permissions
    RETURN permission_name IN ('view_own_data', 'manage_integrations', 'view_analytics');
  END IF;
  
  -- Check specific permissions
  RETURN COALESCE((user_permissions->permission_name)::boolean, false);
END;
$$;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  user_uuid uuid,
  action_name text,
  resource_type_name text DEFAULT NULL,
  resource_id_value text DEFAULT NULL,
  details_json jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_activity_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    created_at
  ) VALUES (
    user_uuid,
    action_name,
    resource_type_name,
    resource_id_value,
    details_json,
    now()
  );
END;
$$;

-- Insert default roles for existing users (if any)
INSERT INTO user_roles (user_id, role_type, role_level)
SELECT 
  id,
  'normal',
  1
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample manager user
DO $$
DECLARE
  manager_id uuid;
BEGIN
  -- This would be set when creating the first manager user
  -- For now, we'll just create the structure
  NULL;
END $$;