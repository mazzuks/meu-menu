/**
 * Tests for intelligent shopping list functionality (Module 3)
 * Testes para funcionalidade inteligente da lista de compras (Módulo 3)
 */

import { describe, it, expect } from 'vitest'
import { consolidate, missingFor } from '@/lib/list'
import { ShoppingListItem, Recipe, mockRecipes } from '@/lib/mock-data'
import { StockItem } from '@/lib/types'

describe('Shopping List Intelligence (Module 3)', () => {
  describe('consolidate', () => {
    it('should consolidate items with same name and unit', () => {
      const items: ShoppingListItem[] = [
        { id: '1', name: 'Tomate', amount: '2', unit: 'kg', category: 'Hortifruti', purchased: false },
        { id: '2', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: false },
        { id: '3', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false }
      ]

      const result = consolidate(items)
      
      expect(result).toHaveLength(2)
      
      const tomatoItem = result.find(item => item.name === 'Tomate')
      expect(tomatoItem).toBeDefined()
      expect(tomatoItem!.amount).toBe('3') // 2 + 1
      
      const onionItem = result.find(item => item.name === 'Cebola')
      expect(onionItem).toBeDefined()
      expect(onionItem!.amount).toBe('500')
    })

    it('should not consolidate items with different units', () => {
      const items: ShoppingListItem[] = [
        { id: '1', name: 'Açúcar', amount: '1', unit: 'kg', category: 'Mercearia', purchased: false },
        { id: '2', name: 'Açúcar', amount: '500', unit: 'g', category: 'Mercearia', purchased: false }
      ]
      
      const result = consolidate(items)
      expect(result).toHaveLength(2) // Should remain separate due to different units
    })

    it('should handle purchased status correctly', () => {
      const items: ShoppingListItem[] = [
        { id: '1', name: 'Leite', amount: '1', unit: 'litro', category: 'Laticínios', purchased: true },
        { id: '2', name: 'Leite', amount: '1', unit: 'litro', category: 'Laticínios', purchased: false }
      ]
      
      const result = consolidate(items)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe('2')
      expect(result[0].purchased).toBe(false) // Should be false if any item is not purchased
    })

    it('should handle empty list', () => {
      const result = consolidate([])
      expect(result).toEqual([])
    })

    it('should handle normalized descriptions', () => {
      const items: ShoppingListItem[] = [
        { id: '1', name: 'Açúcar cristal', amount: '1', unit: 'kg', category: 'Mercearia', purchased: false },
        { id: '2', name: 'AÇÚCAR CRISTAL', amount: '500', unit: 'g', category: 'Mercearia', purchased: false },
        { id: '3', name: 'açucar cristal', amount: '2', unit: 'kg', category: 'Mercearia', purchased: false }
      ]
      
      const result = consolidate(items)
      
      // Should consolidate kg items but keep g separate
      expect(result).toHaveLength(2)
      
      const kgItem = result.find(item => item.unit === 'kg')
      expect(kgItem).toBeDefined()
      expect(kgItem!.amount).toBe('3') // 1 + 2
    })
  })

  describe('missingFor', () => {
    it('should find missing ingredients for recipes', () => {
      const recipes = [mockRecipes[0]] // Pizza Margherita
      const stock: StockItem[] = [
        { id: '1', desc: 'Tomate Salada 1kg', qtd: 2, un: 'kg', preco: 4.50 },
        { id: '2', desc: 'Queijo Mussarela 200g', qtd: 1, un: 'pc', preco: 8.90 }
        // Missing: Massa de pizza, Manjericão, Azeite
      ]
      
      const result = missingFor(recipes, stock)
      
      expect(result.length).toBeGreaterThan(0)
      
      // Should include missing ingredients
      const massaItem = result.find(item => 
        item.name.toLowerCase().includes('massa')
      )
      expect(massaItem).toBeDefined()
      
      const manjericaoItem = result.find(item => 
        item.name.toLowerCase().includes('manjericão')
      )
      expect(manjericaoItem).toBeDefined()
    })

    it('should return empty array when all ingredients are in stock', () => {
      const recipes = [mockRecipes[0]] // Pizza Margherita
      const stock: StockItem[] = [
        { id: '1', desc: 'Massa de pizza', qtd: 2, un: 'un', preco: 3.50 },
        { id: '2', desc: 'Molho de tomate', qtd: 1, un: 'un', preco: 2.80 },
        { id: '3', desc: 'Queijo mussarela', qtd: 1, un: 'pc', preco: 8.90 },
        { id: '4', desc: 'Manjericão fresco', qtd: 1, un: 'maço', preco: 2.50 },
        { id: '5', desc: 'Azeite de oliva', qtd: 1, un: 'un', preco: 12.90 }
      ]
      
      const result = missingFor(recipes, stock)
      expect(result).toEqual([])
    })

    it('should handle multiple recipes', () => {
      const recipes = [mockRecipes[0], mockRecipes[1]] // Pizza + Sopa
      const stock: StockItem[] = [
        { id: '1', desc: 'Tomate', qtd: 1, un: 'kg', preco: 4.50 }
        // Missing most ingredients for both recipes
      ]
      
      const result = missingFor(recipes, stock)
      
      expect(result.length).toBeGreaterThan(5) // Should have many missing items
      
      // Should include ingredients from both recipes
      const pizzaIngredients = result.filter(item => item.recipeId === '1')
      const soupIngredients = result.filter(item => item.recipeId === '2')
      
      expect(pizzaIngredients.length).toBeGreaterThan(0)
      expect(soupIngredients.length).toBeGreaterThan(0)
    })

    it('should handle empty stock', () => {
      const recipes = [mockRecipes[0]]
      const stock: StockItem[] = []
      
      const result = missingFor(recipes, stock)
      
      // Should include all recipe ingredients
      expect(result.length).toBe(recipes[0].ingredients.length)
    })

    it('should handle empty recipes', () => {
      const recipes: Recipe[] = []
      const stock: StockItem[] = [
        { id: '1', desc: 'Tomate', qtd: 1, un: 'kg', preco: 4.50 }
      ]
      
      const result = missingFor(recipes, stock)
      expect(result).toEqual([])
    })

    it('should infer categories correctly', () => {
      const recipes = [mockRecipes[0]] // Pizza Margherita
      const stock: StockItem[] = [] // Empty stock
      
      const result = missingFor(recipes, stock)
      
      result.forEach(item => {
        expect(item.category).toBeDefined()
        expect(typeof item.category).toBe('string')
        expect(item.category.length).toBeGreaterThan(0)
      })
      
      // Check specific categorizations
      const tomatoItem = result.find(item => item.name.toLowerCase().includes('tomate'))
      if (tomatoItem) {
        expect(tomatoItem.category).toBe('Hortifruti')
      }
      
      const cheeseItem = result.find(item => item.name.toLowerCase().includes('mussarela'))
      if (cheeseItem) {
        expect(cheeseItem.category).toBe('Laticínios')
      }
    })

    it('should handle ingredient name variations', () => {
      const recipes = [mockRecipes[0]] // Pizza Margherita
      const stock: StockItem[] = [
        { id: '1', desc: 'Tomate Italiano Premium 1kg', qtd: 1, un: 'kg', preco: 6.90 },
        { id: '2', desc: 'Queijo Mussarela Fatiado 200g', qtd: 1, un: 'pc', preco: 9.50 }
      ]
      
      const result = missingFor(recipes, stock)
      
      // Should not include tomato and mozzarella as they're in stock (with variations)
      const tomatoMissing = result.find(item => item.name.toLowerCase().includes('tomate'))
      const cheeseMissing = result.find(item => item.name.toLowerCase().includes('mussarela'))
      
      expect(tomatoMissing).toBeUndefined()
      expect(cheeseMissing).toBeUndefined()
      
      // Should still include other missing ingredients
      expect(result.length).toBeGreaterThan(0)
    })
  })
})