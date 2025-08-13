/**
 * Tests for stock decrement functionality (Module 2)
 * Testes para funcionalidade de decremento do estoque (Módulo 2)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mockRecipes, getRecipeBySlug } from '@/lib/mock-data'

// Mock stock item interface
interface MockStockItem {
  id: string
  descricao: string
  quantidade: number
  unidade: string
  precoUnitario: number
  precoTotal: number
  categoria: string
}

// Mock implementation of stock decrement logic
function applyRecipeToStock(recipe: any, stock: MockStockItem[]): MockStockItem[] {
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
      const normalizedStock = stockItem.descricao
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
      const newQuantity = Math.max(0, stockItem.quantidade - quantity)
      
      if (newQuantity === 0) {
        updatedStock.splice(stockIndex, 1)
      } else {
        updatedStock[stockIndex] = {
          ...stockItem,
          quantidade: newQuantity,
          precoTotal: newQuantity * stockItem.precoUnitario
        }
      }
    }
  })
  
  return updatedStock
}

describe('Stock Decrement Functionality (Module 2)', () => {
  let mockStock: MockStockItem[]

  beforeEach(() => {
    mockStock = [
      {
        id: '1',
        descricao: 'Tomate Salada 1kg',
        quantidade: 3,
        unidade: 'kg',
        precoUnitario: 4.50,
        precoTotal: 13.50,
        categoria: 'Hortifruti'
      },
      {
        id: '2',
        descricao: 'Queijo Mussarela 200g',
        quantidade: 2,
        unidade: 'pc',
        precoUnitario: 8.90,
        precoTotal: 17.80,
        categoria: 'Laticínios'
      },
      {
        id: '3',
        descricao: 'Massa de Pizza Pronta',
        quantidade: 3,
        unidade: 'un',
        precoUnitario: 3.50,
        precoTotal: 10.50,
        categoria: 'Massas'
      },
      {
        id: '4',
        descricao: 'Azeite Extra Virgem 500ml',
        quantidade: 1,
        unidade: 'un',
        precoUnitario: 12.90,
        precoTotal: 12.90,
        categoria: 'Condimentos'
      },
      {
        id: '5',
        descricao: 'Manjericão Fresco Maço',
        quantidade: 2,
        unidade: 'maço',
        precoUnitario: 2.50,
        precoTotal: 5.00,
        categoria: 'Hortifruti'
      }
    ]
  })

  describe('applyRecipeToStock', () => {
    it('should decrement stock when recipe is applied', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, mockStock)
      
      // Stock should be modified
      expect(updatedStock).not.toEqual(mockStock)
      
      // Should have fewer total items or reduced quantities
      const totalInitialItems = mockStock.reduce((sum, item) => sum + item.quantidade, 0)
      const totalUpdatedItems = updatedStock.reduce((sum, item) => sum + item.quantidade, 0)
      
      expect(totalUpdatedItems).toBeLessThan(totalInitialItems)
    })

    it('should remove items when quantity reaches zero', () => {
      const smallStock: MockStockItem[] = [
        {
          id: '1',
          descricao: 'Massa de Pizza',
          quantidade: 1, // Exactly what's needed
          unidade: 'un',
          precoUnitario: 3.50,
          precoTotal: 3.50,
          categoria: 'Massas'
        }
      ]
      
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, smallStock)
      
      // Pizza dough should be removed as quantity goes to zero
      const pizzaDoughItem = updatedStock.find(item => 
        item.descricao.toLowerCase().includes('massa')
      )
      
      expect(pizzaDoughItem).toBeUndefined()
    })

    it('should handle partial consumption correctly', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, mockStock)
      
      // Find tomato item (should be decremented but not removed)
      const tomatoItem = updatedStock.find(item => 
        item.descricao.toLowerCase().includes('tomate')
      )
      
      if (tomatoItem) {
        expect(tomatoItem.quantidade).toBeLessThan(3) // Original was 3kg
        expect(tomatoItem.quantidade).toBeGreaterThan(0)
        expect(tomatoItem.precoTotal).toBe(tomatoItem.quantidade * tomatoItem.precoUnitario)
      }
    })

    it('should handle non-matching ingredients gracefully', () => {
      const limitedStock: MockStockItem[] = [
        {
          id: '1',
          descricao: 'Ingrediente Inexistente',
          quantidade: 5,
          unidade: 'un',
          precoUnitario: 1.00,
          precoTotal: 5.00,
          categoria: 'Outros'
        }
      ]
      
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, limitedStock)
      
      // Stock should remain unchanged as no ingredients match
      expect(updatedStock).toEqual(limitedStock)
    })

    it('should handle multiple recipe applications', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const soupRecipe = getRecipeBySlug('sopa-abobora')!
      
      // Apply pizza recipe first
      let updatedStock = applyRecipeToStock(pizzaRecipe, mockStock)
      const stockAfterPizza = [...updatedStock]
      
      // Apply soup recipe
      updatedStock = applyRecipeToStock(soupRecipe, updatedStock)
      
      // Stock should be further reduced
      const totalAfterPizza = stockAfterPizza.reduce((sum, item) => sum + item.quantidade, 0)
      const totalAfterSoup = updatedStock.reduce((sum, item) => sum + item.quantidade, 0)
      
      expect(totalAfterSoup).toBeLessThanOrEqual(totalAfterPizza)
    })

    it('should maintain stock item structure', () => {
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, mockStock)
      
      updatedStock.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('descricao')
        expect(item).toHaveProperty('quantidade')
        expect(item).toHaveProperty('unidade')
        expect(item).toHaveProperty('precoUnitario')
        expect(item).toHaveProperty('precoTotal')
        expect(item).toHaveProperty('categoria')
        
        expect(typeof item.quantidade).toBe('number')
        expect(item.quantidade).toBeGreaterThanOrEqual(0)
        expect(item.precoTotal).toBe(item.quantidade * item.precoUnitario)
      })
    })

    it('should handle ingredient name variations', () => {
      const stockWithVariations: MockStockItem[] = [
        {
          id: '1',
          descricao: 'Tomate Italiano Premium 1kg',
          quantidade: 2,
          unidade: 'kg',
          precoUnitario: 6.90,
          precoTotal: 13.80,
          categoria: 'Hortifruti'
        }
      ]
      
      const pizzaRecipe = getRecipeBySlug('pizza-margherita')!
      const updatedStock = applyRecipeToStock(pizzaRecipe, stockWithVariations)
      
      // Should match "Tomate" ingredient with "Tomate Italiano Premium"
      const tomatoItem = updatedStock.find(item => 
        item.descricao.toLowerCase().includes('tomate')
      )
      
      if (tomatoItem) {
        expect(tomatoItem.quantidade).toBeLessThan(2)
      } else {
        // Item was completely consumed
        expect(updatedStock.length).toBe(0)
      }
    })
  })
})