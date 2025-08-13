// project/lib/types.ts
import { z } from 'zod'

export type UserRole = 'user' | 'employee' | 'master' | 'b2b_client' | 'agency'

/* ================================
 * Business Account schema
 * ================================ */
export const BusinessAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }),
  category: z.enum(['supermarket', 'restaurant', 'food_service', 'distributor', 'other']),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
})

/* ================================
 * Promotion schema
 * ================================ */
export const PromotionSchema = z.object({
  id: z.string(),
  businessAccountId: z.string(),
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  imageUrl: z.string().url('URL da imagem inválida'),
  startDate: z.string(),
  endDate: z.string(),
  tags: z.array(z.string()).min(1, 'Adicione pelo menos uma tag'),
  targetRegions: z.array(z.string()).default(['SP']),
  promotionType: z.enum(['discount', 'bundle', 'special_offer', 'sweepstakes']),
  discountPercentage: z.number().min(0).max(100).optional(),
  originalPrice: z.number().min(0).optional(),
  promotionalPrice: z.number().min(0).optional(),
  link: z.string().url('Link inválido'),
  isActive: z.boolean().default(true),
  priority: z.number().min(1).max(10).default(1),
  viewCount: z.number().default(0),
  clickCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string()
})

/* ================================
 * Recipe schema (novo)
 * ================================ */
export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  prepTime: z.number().int().min(0).default(0),

  // Campos opcionais
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),       // <-- para bater a imagem com a receita
  videoUrl: z.string().url().optional(),
  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  servings: z.number().int().min(1).optional(),
  rating: z.number().min(0).max(5).optional(),

  // Metadados opcionais
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

/* ================================
 * User Account schema
 * ================================ */
export const UserAccountSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['user', 'employee', 'master', 'b2b_client', 'agency']),
  businessAccountId: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
})

/* ================================
 * Inferred types
 * ================================ */
export type BusinessAccount = z.infer<typeof BusinessAccountSchema>
export type Promotion = z.infer<typeof PromotionSchema>
export type Recipe = z.infer<typeof RecipeSchema>          // <-- novo tipo
export type UserAccount = z.infer<typeof UserAccountSchema>

/* ================================
 * Permission constants
 * ================================ */
export const PERMISSIONS = {
  // User
  VIEW_PROMOTIONS: 'view_promotions',
  VIEW_RECIPES: 'view_recipes',
  // Employee
  MANAGE_PROMOTIONS: 'manage_promotions',
  VIEW_ANALYTICS: 'view_analytics',
  // Master
  MANAGE_USERS: 'manage_users',
  MANAGE_BUSINESS_ACCOUNTS: 'manage_business_accounts',
  SYSTEM_ADMIN: 'system_admin',
  // B2B Client
  CREATE_PROMOTIONS: 'create_promotions',
  MANAGE_OWN_PROMOTIONS: 'manage_own_promotions',
  VIEW_PROMOTION_ANALYTICS: 'view_promotion_analytics',
  // Agency
  MANAGE_CLIENT_PROMOTIONS: 'manage_client_promotions',
  CREATE_CAMPAIGNS: 'create_campaigns'
} as const

/* ================================
 * Role permissions mapping
 * ================================ */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: [PERMISSIONS.VIEW_PROMOTIONS, PERMISSIONS.VIEW_RECIPES],
  employee: [
    PERMISSIONS.VIEW_PROMOTIONS,
    PERMISSIONS.VIEW_RECIPES,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  master: [
    PERMISSIONS.VIEW_PROMOTIONS,
    PERMISSIONS.VIEW_RECIPES,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_BUSINESS_ACCOUNTS,
    PERMISSIONS.SYSTEM_ADMIN
  ],
  b2b_client: [
    PERMISSIONS.VIEW_PROMOTIONS,
    PERMISSIONS.VIEW_RECIPES,
    PERMISSIONS.CREATE_PROMOTIONS,
    PERMISSIONS.MANAGE_OWN_PROMOTIONS,
    PERMISSIONS.VIEW_PROMOTION_ANALYTICS
  ],
  agency: [
    PERMISSIONS.VIEW_PROMOTIONS,
    PERMISSIONS.VIEW_RECIPES,
    PERMISSIONS.MANAGE_CLIENT_PROMOTIONS,
    PERMISSIONS.CREATE_CAMPAIGNS,
    PERMISSIONS.VIEW_ANALYTICS
  ]
}

/* ================================
 * Helpers
 * ================================ */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function canManagePromotions(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.MANAGE_PROMOTIONS) ||
         hasPermission(userRole, PERMISSIONS.CREATE_PROMOTIONS) ||
         hasPermission(userRole, PERMISSIONS.MANAGE_CLIENT_PROMOTIONS)
}

export function canViewAnalytics(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.VIEW_ANALYTICS) ||
         hasPermission(userRole, PERMISSIONS.VIEW_PROMOTION_ANALYTICS)
}
