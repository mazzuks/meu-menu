/**
 * Tests for promotions API functionality (Module 6)
 * Testes para funcionalidade da API de promoções (Módulo 6)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  mockPromotions, 
  mockBusinessAccounts,
  getPromotionsByRegion,
  searchPromotions,
  getBusinessAccountById,
  addPromotion,
  updatePromotion,
  deletePromotion,
  inMemoryPromotions
} from '@/lib/mock-promotions'
import { PromotionSchema, BusinessAccountSchema } from '@/lib/types'

describe('Promotions API Functionality (Module 6)', () => {
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

    it('should filter out inactive promotions', () => {
      const promotions = getPromotionsByRegion('SP')
      
      promotions.forEach(promo => {
        expect(promo.isActive).toBe(true)
      })
    })

    it('should filter out expired promotions', () => {
      const promotions = getPromotionsByRegion('SP')
      const now = new Date()
      
      promotions.forEach(promo => {
        expect(new Date(promo.endDate)).toBeGreaterThanOrEqual(now)
      })
    })
  })

  describe('searchPromotions', () => {
    it('should find promotions by title', () => {
      const results = searchPromotions('Mega Promoção', 'SP')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].title).toContain('Mega Promoção')
    })

    it('should find promotions by description', () => {
      const results = searchPromotions('carnes', 'SP')
      
      expect(results.length).toBeGreaterThan(0)
      
      const foundPromo = results.find(promo => 
        promo.description.toLowerCase().includes('carnes')
      )
      expect(foundPromo).toBeDefined()
    })

    it('should find promotions by tags', () => {
      const results = searchPromotions('desconto', 'SP')
      
      expect(results.length).toBeGreaterThan(0)
      
      const foundPromo = results.find(promo => 
        promo.tags.includes('desconto')
      )
      expect(foundPromo).toBeDefined()
    })

    it('should find promotions by business name', () => {
      const results = searchPromotions('Pão de Açúcar', 'SP')
      
      expect(results.length).toBeGreaterThan(0)
      
      const foundPromo = results.find(promo => 
        promo.businessName.includes('Pão de Açúcar')
      )
      expect(foundPromo).toBeDefined()
    })

    it('should return empty array for non-matching search', () => {
      const results = searchPromotions('termo-inexistente-xyz', 'SP')
      expect(results).toEqual([])
    })

    it('should be case insensitive', () => {
      const lowerResults = searchPromotions('mega promoção', 'SP')
      const upperResults = searchPromotions('MEGA PROMOÇÃO', 'SP')
      const mixedResults = searchPromotions('Mega Promoção', 'SP')
      
      expect(lowerResults.length).toBe(upperResults.length)
      expect(upperResults.length).toBe(mixedResults.length)
      expect(lowerResults.length).toBeGreaterThan(0)
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

    it('should return null when updating non-existent promotion', () => {
      const result = updatePromotion('non-existent-id', { title: 'Test' })
      expect(result).toBeNull()
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

    it('should return false when deleting non-existent promotion', () => {
      const deleted = deletePromotion('non-existent-id')
      expect(deleted).toBe(false)
    })
  })

  describe('Business Account Data', () => {
    it('should have valid business accounts', () => {
      expect(mockBusinessAccounts.length).toBeGreaterThan(0)
      
      mockBusinessAccounts.forEach(business => {
        expect(business.id).toBeDefined()
        expect(business.name.length).toBeGreaterThan(0)
        expect(business.cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        expect(business.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        expect(['supermarket', 'restaurant', 'food_service', 'distributor', 'other']).toContain(business.category)
      })
    })

    it('should have unique business IDs', () => {
      const ids = mockBusinessAccounts.map(business => business.id)
      const uniqueIds = [...new Set(ids)]
      
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('should have unique CNPJs', () => {
      const cnpjs = mockBusinessAccounts.map(business => business.cnpj)
      const uniqueCnpjs = [...new Set(cnpjs)]
      
      expect(cnpjs.length).toBe(uniqueCnpjs.length)
    })
  })

  describe('Promotion Data Integrity', () => {
    it('should have valid promotion data', () => {
      mockPromotions.forEach(promo => {
        expect(promo.id).toBeDefined()
        expect(promo.title.length).toBeGreaterThanOrEqual(5)
        expect(promo.description.length).toBeGreaterThanOrEqual(10)
        expect(promo.imageUrl).toMatch(/^https?:\/\/.+/)
        expect(promo.link).toMatch(/^https?:\/\/.+/)
        expect(promo.tags.length).toBeGreaterThan(0)
        expect(promo.targetRegions.length).toBeGreaterThan(0)
        expect(['discount', 'bundle', 'special_offer', 'sweepstakes']).toContain(promo.promotionType)
        expect(promo.priority).toBeGreaterThanOrEqual(1)
        expect(promo.priority).toBeLessThanOrEqual(10)
      })
    })

    it('should have valid business account references', () => {
      mockPromotions.forEach(promo => {
        const business = getBusinessAccountById(promo.businessAccountId)
        expect(business).toBeDefined()
        expect(business!.name).toBe(promo.businessName)
      })
    })

    it('should have valid date ranges', () => {
      mockPromotions.forEach(promo => {
        const startDate = new Date(promo.startDate)
        const endDate = new Date(promo.endDate)
        
        expect(startDate).toBeInstanceOf(Date)
        expect(endDate).toBeInstanceOf(Date)
        expect(endDate.getTime()).toBeGreaterThan(startDate.getTime())
      })
    })

    it('should have consistent discount data', () => {
      mockPromotions.forEach(promo => {
        if (promo.promotionType === 'discount' && promo.discountPercentage) {
          expect(promo.discountPercentage).toBeGreaterThan(0)
          expect(promo.discountPercentage).toBeLessThanOrEqual(100)
        }
        
        if (promo.originalPrice && promo.promotionalPrice) {
          expect(promo.promotionalPrice).toBeLessThan(promo.originalPrice)
        }
      })
    })
  })

  describe('Regional Filtering', () => {
    it('should filter promotions by multiple regions', () => {
      const spPromotions = getPromotionsByRegion('SP')
      const rjPromotions = getPromotionsByRegion('RJ')
      
      expect(spPromotions.length).toBeGreaterThan(0)
      
      // SP should have more or equal promotions than RJ (based on mock data)
      expect(spPromotions.length).toBeGreaterThanOrEqual(rjPromotions.length)
    })

    it('should handle case-sensitive region codes', () => {
      const upperSP = getPromotionsByRegion('SP')
      const lowerSP = getPromotionsByRegion('sp')
      
      // Should be case sensitive (SP ≠ sp)
      expect(upperSP.length).toBeGreaterThan(0)
      expect(lowerSP.length).toBe(0)
    })
  })

  describe('Memory Operations', () => {
    it('should maintain data consistency after multiple operations', () => {
      const initialCount = inMemoryPromotions.length
      
      // Add promotion
      const newPromo = addPromotion({
        businessAccountId: 'biz-1',
        businessName: 'Test Business',
        title: 'Test Promotion Title',
        description: 'Test promotion description with enough characters',
        imageUrl: 'https://example.com/image.jpg',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        tags: ['test'],
        targetRegions: ['SP'],
        promotionType: 'discount',
        link: 'https://example.com/promo',
        isActive: true,
        priority: 5
      })
      
      expect(inMemoryPromotions.length).toBe(initialCount + 1)
      
      // Update promotion
      const updated = updatePromotion(newPromo.id, { title: 'Updated Title' })
      expect(updated!.title).toBe('Updated Title')
      expect(inMemoryPromotions.length).toBe(initialCount + 1) // Count unchanged
      
      // Delete promotion
      const deleted = deletePromotion(newPromo.id)
      expect(deleted).toBe(true)
      expect(inMemoryPromotions.length).toBe(initialCount) // Back to original count
    })

    it('should preserve original mock data after operations', () => {
      const originalIds = mockPromotions.map(p => p.id)
      
      // Perform some operations
      addPromotion({
        businessAccountId: 'biz-1',
        businessName: 'Test',
        title: 'Test Title',
        description: 'Test description with enough characters',
        imageUrl: 'https://example.com/test.jpg',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        tags: ['test'],
        targetRegions: ['SP'],
        promotionType: 'discount',
        link: 'https://example.com',
        isActive: true,
        priority: 1
      })
      
      // Original promotions should still exist
      originalIds.forEach(id => {
        const exists = inMemoryPromotions.find(p => p.id === id)
        expect(exists).toBeDefined()
      })
    })
  })
})