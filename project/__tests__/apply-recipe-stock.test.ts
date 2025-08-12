/**
 * Tests for apply recipe to stock functionality (Module 2)
 * Testes para funcionalidade de aplicar receita ao estoque (Módulo 2)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { suggestByLeftovers } from '@/lib/suggest'
import { mockRecipes, getRecipeBySlug } from '@/lib/mock-data'
import { StockItem } from '@/lib/list'

// Mock implementation of applyRecipe logic for testing
function mockApplyRecipe(recipe: any, stock: StockItem[]): { debited: number; updatedStock: StockItem[] } {
  let debited = 0
  const updatedStock = [...stock]
  
  recipe.ingredients.forEach((ingredient: any) => {
    const normalizedIngredient = ingredient.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\d+/g, '')
      .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    const quantity = parseFloat(ingredient.amount) || 1
    
    const stockIndex = updatedStock.findIndex(stockItem => {
      const normalizedStock = stockItem.desc
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\d+/g, '')
        .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      return normalizedStock.includes(normalizedIngredient) || 
             normalizedIngredient.includes(normalizedStock)
    })
    
    if (stockIndex !== -1) {
      const stockItem = updatedStock[stockIndex]
      const newQuantity = Math.max(0, stockItem.qtd - quantity)
      debited++
      
      if (newQuantity === 0) {
        updatedStock.splice(stockIndex, 1)
      } else {
        updatedStock[stockIndex] = {
          ...stockItem,
          qtd: newQuantity,
          precoTotal: stockItem.preco ? newQuantity * stockItem.preco : undefined
        }
      }
    }
  })
  
  return { debited, updatedStock }
}

describe('Apply Recipe to Stock (Module 2)', () => {
  let mockStock: StockItem[]

  beforeEach(() => {
    mockStock = [
      {
        id: '1',
        desc: 'Tomate Salada 1kg',
        qtd: 3,
        un: 'kg',
        preco: 4.50,
        precoTotal: 13.50,
        categoria: 'Hortifruti'
      },
      {
        id: '2',
        desc: 'Queijo Mussarela 200g',
        qtd: 2,
        un: 'pc',
        preco: 8.90,
        precoTotal: 17.80,
        categoria: 'Laticínios'
      },
      {
        id: '3',
        desc: 'Massa de Pizza Pronta',
        qtd: 3,
        un: 'un',
        preco: 3.50,
        precoTotal: 10.50,
        categoria: 'Massas'
      },
      {
        id: '4',
        desc: 'Azeite Extra Virgem 500ml',
        qtd: 1,
        un: 'un',
        preco: 12.90,
        precoTotal: 12.90,
        categoria: 'Condimentos'
      }
    ]
  })

  describe('applyRecipe', () => {
    it('should debit ingredients from stock when recipe is applied', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const result = mockApplyRecipe(pizzaRecipe, mockStock)
      
      expect(result.debited).toBeGreaterThan(0)
      expect(result.updatedStock.length).toBeLessThanOrEqual(mockStock.length)
      
      // Should have fewer total items or reduced quantities
      const totalInitialItems = mockStock.reduce((sum, item) => sum + item.qtd, 0)
      const totalUpdatedItems = result.updatedStock.reduce((sum, item) => sum + item.qtd, 0)
      
      expect(totalUpdatedItems).toBeLessThan(totalInitialItems)
    })

    it('should remove items when quantity reaches zero', () => {
      const smallStock: StockItem[] = [
        {
          id: '1',
          desc: 'Massa de Pizza',
          qtd: 1, // Exactly what's needed
          un: 'un',
          preco: 3.50,
          precoTotal: 3.50,
          categoria: 'Massas'
        }
      ]
      
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const result = mockApplyRecipe(pizzaRecipe, smallStock)
      
      // Pizza dough should be removed as quantity goes to zero
      const pizzaDoughItem = result.updatedStock.find(item => 
        item.desc.toLowerCase().includes('massa')
      )
      
      expect(pizzaDoughItem).toBeUndefined()
    })

    it('should handle partial consumption correctly', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const result = mockApplyRecipe(pizzaRecipe, mockStock)
      
      // Find items that should be decremented but not removed
      const remainingItems = result.updatedStock.filter(item => 
        mockStock.some(original => original.id === item.id)
      )
      
      remainingItems.forEach(item => {
        const original = mockStock.find(orig => orig.id === item.id)!
        expect(item.qtd).toBeLessThanOrEqual(original.qtd)
        
        if (item.preco) {
          expect(item.precoTotal).toBe(item.qtd * item.preco)
        }
      })
    })

    it('should handle non-matching ingredients gracefully', () => {
      const limitedStock: StockItem[] = [
        {
          id: '1',
          desc: 'Ingrediente Inexistente',
          qtd: 5,
          un: 'un',
          preco: 1.00,
          precoTotal: 5.00,
          categoria: 'Outros'
        }
      ]
      
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const result = mockApplyRecipe(pizzaRecipe, limitedStock)
      
      // Stock should remain unchanged as no ingredients match
      expect(result.updatedStock).toEqual(limitedStock)
      expect(result.debited).toBe(0)
    })

    it('should normalize ingredient names for matching', () => {
      const stockWithAccents: StockItem[] = [
        {
          id: '1',
          desc: 'Açúcar Cristal 1kg',
          qtd: 2,
          un: 'kg',
          preco: 3.20,
          precoTotal: 6.40,
          categoria: 'Mercearia'
        }
      ]
      
      // Mock recipe with sugar
      const sugarRecipe = {
        id: 'test',
        ingredients: [
          { id: '1', name: 'Açúcar', amount: '100', unit: 'g' }
        ]
      }
      
      const result = mockApplyRecipe(sugarRecipe, stockWithAccents)
      
      expect(result.debited).toBe(1)
      expect(result.updatedStock[0].qtd).toBeLessThan(2)
    })
  })

  describe('suggestByLeftovers', () => {
    it('should return recipes ordered by ingredient intersection', () => {
      const suggestions = suggestByLeftovers(mockStock, mockRecipes, 3)
      
      expect(suggestions.length).toBeLessThanOrEqual(3)
      expect(suggestions.length).toBeGreaterThan(0)
      
      // Should include pizza recipe since we have tomato, mozzarella, and pizza dough
      const pizzaRecipe = suggestions.find(recipe => 
        recipe.title.toLowerCase().includes('pizza')
      )
      expect(pizzaRecipe).toBeDefined()
    })

    it('should return empty array for empty stock', () => {
      const suggestions = suggestByLeftovers([], mockRecipes, 3)
      expect(suggestions).toEqual([])
    })

    it('should limit results to specified limit', () => {
      const suggestions = suggestByLeftovers(mockStock, mockRecipes, 2)
      expect(suggestions.length).toBeLessThanOrEqual(2)
    })

    it('should prioritize recipes with higher match percentage', () => {
      const suggestions = suggestByLeftovers(mockStock, mockRecipes, 3)
      
      if (suggestions.length >= 2) {
        const firstRecipe = suggestions[0]
        const secondRecipe = suggestions[1]
        
        // Count matching ingredients for first recipe
        const firstMatches = firstRecipe.ingredients.filter(ingredient => {
          const normalized = ingredient.name.toLowerCase()
          return mockStock.some(stockItem => 
            stockItem.desc.toLowerCase().includes(normalized) ||
            normalized.includes(stockItem.desc.toLowerCase())
          )
        }).length
        
        // Count matching ingredients for second recipe
        const secondMatches = secondRecipe.ingredients.filter(ingredient => {
          const normalized = ingredient.name.toLowerCase()
          return mockStock.some(stockItem => 
            stockItem.desc.toLowerCase().includes(normalized) ||
            normalized.includes(stockItem.desc.toLowerCase())
          )
        }).length
        
        // First recipe should have equal or more matches
        expect(firstMatches).toBeGreaterThanOrEqual(secondMatches)
      }
    })

    it('should handle ingredient name normalization', () => {
      const stockWithVariations: StockItem[] = [
        {
          id: '1',
          desc: 'Tomate Italiano Premium 2kg',
          qtd: 1,
          un: 'kg',
          preco: 8.90,
          precoTotal: 8.90,
          categoria: 'Hortifruti'
        }
      ]
      
      const suggestions = suggestByLeftovers(stockWithVariations, mockRecipes, 3)
      
      // Should find recipes that use tomato
      const tomatoRecipes = suggestions.filter(recipe =>
        recipe.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes('tomate')
        )
      )
      
      expect(tomatoRecipes.length).toBeGreaterThan(0)
    })

    it('should return recipes with score > 0 only', () => {
      const irrelevantStock: StockItem[] = [
        {
          id: '1',
          desc: 'Produto Totalmente Irrelevante',
          qtd: 10,
          un: 'un',
          preco: 1.00,
          precoTotal: 10.00,
          categoria: 'Outros'
        }
      ]
      
      const suggestions = suggestByLeftovers(irrelevantStock, mockRecipes, 3)
      
      // Should return empty array as no ingredients match
      expect(suggestions).toEqual([])
    })
  })
})