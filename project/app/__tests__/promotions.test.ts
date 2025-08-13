/**
 * Tests for promotions CRUD functionality (Module 6)
 * Testes para funcionalidade CRUD de promoções (Módulo 6)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  mockPromotions, 
  mockBusinessAccounts,
  getPromotionsByRegion,
  getBusinessAccountById,
  addPromotion,
  updatePromotion,
  deletePromotion,
  inMemoryPromotions
} from '@/lib/mock-promotions'
import { PromotionSchema, BusinessAccountSchema } from '@/lib/types'

describe('Promotions CRUD Functionality (Module 6)', () => {
  beforeEach(() => {
    // Reset in-memory promotions to original state
    inMemoryPromotions.length = 0
    inMemoryPromotions.push(...mockPromotions)
  })

  describe('Data Validation', () => {
    it('should validate business account schema', () => {
      const validBusinessAccount = {
        id: 'test-biz-1',
        name: 'Teste Supermercado',
        cnpj: '12.345.678/0001-90',
        email: 'teste@supermercado.com',
        address: {
          street: 'Rua Teste',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        category: 'supermarket' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = BusinessAccountSchema.safeParse(validBusinessAccount)
      expect(result.success).toBe(true)
    })

    it('should validate promotion schema', () => {
      const validPromotion = {
        id: 'test-promo-1',
        businessAccountId: 'biz-1',
        title: 'Promoção Teste Válida',
        description: 'Esta é uma descrição válida com mais de 10 caracteres',
        imageUrl: 'https://images.pexels.com/photos/123456/test.jpeg',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        tags: ['teste', 'válido'],
        targetRegions: ['SP'],
        promotionType: 'discount' as const,
        discountPercentage: 25,
        link: 'https://www.exemplo.com/promocao',
        isActive: true,
        priority: 5,
        viewCount: 0,
        clickCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = PromotionSchema.safeParse(validPromotion)
      expect(result.success).toBe(true)
    })

    it('should reject invalid promotion data', () => {
      const invalidPromotion = {
        id: 'test-promo-invalid',
        businessAccountId: 'biz-1',
        title: 'Curto', // Too short (< 5 chars)
        description: 'Curta', // Too short (< 10 chars)
        imageUrl: 'invalid-url', // Invalid URL
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        tags: [], // Empty tags array
        targetRegions: ['SP'],
        promotionType: 'discount' as const,
        link: 'invalid-link', // Invalid URL
        isActive: true,
        priority: 5,
        viewCount: 0,
        clickCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = PromotionSchema.safeParse(invalidPromotion)
      expect(result.success).toBe(false)
      expect(result.error?.errors.length).toBeGreaterThan(0)
    })
  })

  describe('getPromotionsByRegion', () => {
    it('should return promotions for specified region', () => {
      const spPromotions = getPromotionsByRegion('SP')
      
      expect(spPromotions.length).toBeGreaterThan(0)
      
      spPromotions.forEach(promo => {
        expect(promo.targetRegions).toContain('SP')
        expect(promo.isActive).toBe(true)
        
        // Should be within date range
        const now = new Date()
        expect(new Date(promo.startDate)).toBeLessThanOrEqual(now)
        expect(new Date(promo.endDate)).toBeGreaterThanOrEqual(now)
      })
    })

    it('should return empty array for region without promotions', () => {
      const acPromotions = getPromotionsByRegion('AC') // Acre
      expect(acPromotions).toEqual([])
    })

    it('should sort promotions by priority (highest first)', () => {
      const promotions = getPromotionsByRegion('SP')
      
      if (promotions.length > 1) {
        for (let i = 0; i < promotions.length - 1; i++) {
          expect(promotions[i].priority).toBeGreaterThanOrEqual(promotions[i + 1].priority)
        }
      }
    })
  })

  describe('CRUD Operations', () => {
    it('should add new promotion', () => {
      const initialCount = inMemoryPromotions.length
      
      const newPromotionData = {
        businessAccountId: 'biz-1',
        businessName: 'Supermercado Pão de Açúcar',
        title: 'Nova Promoção Teste',
        description: 'Descrição da nova promoção teste com mais de 10 caracteres',
        imageUrl: 'https://images.pexels.com/photos/123456/test.jpeg',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        tags: ['teste', 'novo'],
        targetRegions: ['SP'],
        promotionType: 'discount' as const,
        discountPercentage: 30,
        link: 'https://www.exemplo.com/nova-promocao',
        isActive: true,
        priority: 7
      }

      const newPromotion = addPromotion(newPromotionData)
      
      expect(inMemoryPromotions.length).toBe(initialCount + 1)
      expect(newPromotion.id).toBeDefined()
      expect(newPromotion.title).toBe(newPromotionData.title)
      expect(newPromotion.viewCount).toBe(0)
      expect(newPromotion.clickCount).toBe(0)
    })

    it('should update existing promotion', () => {
      const originalPromotion = inMemoryPromotions[0]
      const originalTitle = originalPromotion.title
      
      const updates = {
        title: 'Título Atualizado',
        description: 'Descrição atualizada com mais de 10 caracteres'
      }

      const updatedPromotion = updatePromotion(originalPromotion.id, updates)
      
      expect(updatedPromotion).toBeDefined()
      expect(updatedPromotion!.title).toBe(updates.title)
      expect(updatedPromotion!.title).not.toBe(originalTitle)
      expect(updatedPromotion!.description).toBe(updates.description)
      expect(updatedPromotion!.id).toBe(originalPromotion.id)
    })

    it('should delete existing promotion', () => {
      const initialCount = inMemoryPromotions.length
      const promotionToDelete = inMemoryPromotions[0]
      
      const deleted = deletePromotion(promotionToDelete.id)
      
      expect(deleted).toBe(true)
      expect(inMemoryPromotions.length).toBe(initialCount - 1)
      
      const stillExists = inMemoryPromotions.find(p => p.id === promotionToDelete.id)
      expect(stillExists).toBeUndefined()
    })
  })

  describe('getBusinessAccountById', () => {
    it('should return business account for valid ID', () => {
      const business = getBusinessAccountById('biz-1')
      
      expect(business).toBeDefined()
      expect(business!.id).toBe('biz-1')
      expect(business!.name).toBe('Supermercado Pão de Açúcar')
      expect(business!.category).toBe('supermarket')
    })

    it('should return null for invalid ID', () => {
      const business = getBusinessAccountById('invalid-id')
      expect(business).toBeNull()
    })
  })
})