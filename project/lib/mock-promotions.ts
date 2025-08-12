/**
 * Mock data for B2B promotions
 * Dados mockados para promoções B2B
 */

import { MockPromotion, MockBusinessAccount } from '@/lib/types'

// Mock business accounts
export const mockBusinessAccounts: MockBusinessAccount[] = [
  {
    id: 'biz-1',
    name: 'Supermercado Pão de Açúcar',
    cnpj: '33.041.260/0001-56',
    email: 'promocoes@paodeacucar.com.br',
    phone: '(11) 3003-4455',
    address: {
      street: 'Av. Brigadeiro Luís Antônio',
      number: '3126',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01402-901'
    },
    category: 'supermarket',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'biz-2',
    name: 'Extra Hipermercados',
    cnpj: '47.508.411/0001-56',
    email: 'marketing@extra.com.br',
    phone: '(11) 4004-1234',
    address: {
      street: 'Av. das Nações Unidas',
      number: '22540',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04795-000'
    },
    category: 'supermarket',
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'biz-3',
    name: 'Carrefour Brasil',
    cnpj: '45.543.915/0001-81',
    email: 'promocoes@carrefour.com.br',
    phone: '(11) 3779-8000',
    address: {
      street: 'Av. Morumbi',
      number: '8234',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05650-000'
    },
    category: 'supermarket',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-01-01')
  }
]

// Mock promotions
export const mockPromotions: MockPromotion[] = [
  {
    id: 'promo-1',
    businessAccountId: 'biz-1',
    businessName: 'Supermercado Pão de Açúcar',
    title: 'Mega Promoção de Verão 2025',
    description: 'Descontos de até 50% em frutas, verduras e produtos para churrasco. Aproveite o verão com sabor e economia!',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    tags: ['verão', 'desconto', 'frutas', 'churrasco'],
    targetRegions: ['SP', 'RJ', 'MG'],
    promotionType: 'discount',
    discountPercentage: 50,
    link: 'https://www.paodeacucar.com/promocoes/verao-2025',
    isActive: true,
    priority: 9,
    viewCount: 15420,
    clickCount: 2340,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'promo-2',
    businessAccountId: 'biz-2',
    businessName: 'Extra Hipermercados',
    title: 'Festival de Carnes Premium',
    description: 'As melhores carnes com preços especiais. Picanha, alcatra e fraldinha com até 40% de desconto.',
    imageUrl: 'https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2025-01-05',
    endDate: '2025-01-31',
    tags: ['carnes', 'premium', 'picanha', 'churrasco'],
    targetRegions: ['SP'],
    promotionType: 'discount',
    discountPercentage: 40,
    originalPrice: 89.90,
    promotionalPrice: 53.94,
    link: 'https://www.extra.com.br/carnes-premium',
    isActive: true,
    priority: 8,
    viewCount: 8750,
    clickCount: 1250,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'promo-3',
    businessAccountId: 'biz-3',
    businessName: 'Carrefour Brasil',
    title: 'Semana do Café Especial',
    description: 'Celebre o Dia Nacional do Café com grãos especiais, cafeteiras e acessórios com preços únicos.',
    imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2025-05-20',
    endDate: '2025-05-27',
    tags: ['café', 'especial', 'grãos', 'cafeteira'],
    targetRegions: ['SP', 'RJ', 'MG'],
    promotionType: 'bundle',
    link: 'https://www.carrefour.com.br/semana-cafe',
    isActive: true,
    priority: 7,
    viewCount: 5200,
    clickCount: 780,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
]

// In-memory storage
export let inMemoryPromotions: MockPromotion[] = [...mockPromotions]
export let inMemoryBusinessAccounts: MockBusinessAccount[] = [...mockBusinessAccounts]

// Helper functions
export function getPromotionsByRegion(region: string = 'SP'): MockPromotion[] {
  return inMemoryPromotions.filter(promo => 
    promo.isActive && 
    promo.targetRegions.includes(region) &&
    new Date(promo.startDate) <= new Date() &&
    new Date(promo.endDate) >= new Date()
  ).sort((a, b) => b.priority - a.priority)
}

export function getBusinessAccountById(id: string): MockBusinessAccount | null {
  return inMemoryBusinessAccounts.find(account => account.id === id) || null
}

export function getAllPromotions(): MockPromotion[] {
  return inMemoryPromotions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addPromotion(promotion: Omit<MockPromotion, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'clickCount'>): MockPromotion {
  const newPromotion: MockPromotion = {
    ...promotion,
    id: `promo-${Date.now()}`,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  inMemoryPromotions.unshift(newPromotion)
  return newPromotion
}

export function updatePromotion(id: string, updates: Partial<MockPromotion>): MockPromotion | null {
  const index = inMemoryPromotions.findIndex(promo => promo.id === id)
  if (index === -1) return null
  
  inMemoryPromotions[index] = {
    ...inMemoryPromotions[index],
    ...updates,
    updatedAt: new Date()
  }
  
  return inMemoryPromotions[index]
}

export function deletePromotion(id: string): boolean {
  const index = inMemoryPromotions.findIndex(promo => promo.id === id)
  if (index === -1) return false
  
  inMemoryPromotions.splice(index, 1)
  return true
}