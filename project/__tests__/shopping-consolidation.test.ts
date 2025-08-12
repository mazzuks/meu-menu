/**
 * Tests for shopping list consolidation (Module 3)
 * Testes para consolidação da lista de compras (Módulo 3)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  consolidateShoppingList, 
  normalizeIngredientName,
  isShoppingListComplete
} from '@/lib/list'
import { ShoppingListItem } from '@/lib/mock-data'

describe('Shopping List Consolidation (Module 3)', () => {
  let mockShoppingList: ShoppingListItem[]

  beforeEach(() => {
    mockShoppingList = [
      { id: '1', name: 'Tomate', amount: '2', unit: 'kg', category: 'Hortifruti', purchased: false },
      { id: '2', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: false },
      { id: '3', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false },
      { id: '4', name: 'Cebola', amount: '300', unit: 'g', category: 'Hortifruti', purchased: true },
      { id: '5', name: 'Arroz', amount: '1', unit: 'kg', category: 'Grãos', purchased: false },
      { id: '6', name: 'Leite', amount: '1', unit: 'litro', category: 'Laticínios', purchased: false },
      { id: '7', name: 'Leite', amount: '2', unit: 'litro', category: 'Laticínios', purchased: false }
    ]
  })

  describe('consolidateShoppingList', () => {
    it('should consolidate items with same name and unit', () => {
      const result = consolidateShoppingList(mockShoppingList)
      
      // Should have fewer items after consolidation
      expect(result.length).toBeLessThan(mockShoppingList.length)
      
      // Find consolidated tomato item
      const tomatoItem = result.find(item => 
        normalizeIngredientName(item.name) === normalizeIngredientName('Tomate') &&
        item.unit === 'kg'
      )
      
      expect(tomatoItem).toBeDefined()
      expect(tomatoItem!.totalAmount).toBe(3) // 2 + 1
      expect(tomatoItem!.items).toHaveLength(2)
    })

    it('should consolidate items with different purchase status', () => {
      const result = consolidateShoppingList(mockShoppingList)
      
      // Find consolidated onion item
      const onionItem = result.find(item => 
        normalizeIngredientName(item.name) === normalizeIngredientName('Cebola') &&
        item.unit === 'g'
      )
      
      expect(onionItem).toBeDefined()
      expect(onionItem!.totalAmount).toBe(800) // 500 + 300
      expect(onionItem!.items).toHaveLength(2)
      
      // Should include both purchased and unpurchased items
      const purchasedItems = onionItem!.items.filter(item => item.purchased)
      const unpurchasedItems = onionItem!.items.filter(item => !item.purchased)
      
      expect(purchasedItems).toHaveLength(1)
      expect(unpurchasedItems).toHaveLength(1)
    })

    it('should not consolidate items with different units', () => {
      const mixedUnitList: ShoppingListItem[] = [
        { id: '1', name: 'Açúcar', amount: '1', unit: 'kg', category: 'Mercearia', purchased: false },
        { id: '2', name: 'Açúcar', amount: '500', unit: 'g', category: 'Mercearia', purchased: false }
      ]
      
      const result = consolidateShoppingList(mixedUnitList)
      
      // Should remain as 2 separate items due to different units
      expect(result).toHaveLength(2)
      
      const kgItem = result.find(item => item.unit === 'kg')
      const gItem = result.find(item => item.unit === 'g')
      
      expect(kgItem).toBeDefined()
      expect(gItem).toBeDefined()
      expect(kgItem!.totalAmount).toBe(1)
      expect(gItem!.totalAmount).toBe(500)
    })

    it('should handle empty shopping list', () => {
      const result = consolidateShoppingList([])
      expect(result).toEqual([])
    })

    it('should handle single item list', () => {
      const singleItem: ShoppingListItem[] = [
        { id: '1', name: 'Banana', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: false }
      ]
      
      const result = consolidateShoppingList(singleItem)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Banana')
      expect(result[0].totalAmount).toBe(1)
      expect(result[0].items).toHaveLength(1)
    })

    it('should preserve category information', () => {
      const result = consolidateShoppingList(mockShoppingList)
      
      result.forEach(consolidatedItem => {
        expect(consolidatedItem.category).toBeDefined()
        expect(typeof consolidatedItem.category).toBe('string')
        expect(consolidatedItem.category.length).toBeGreaterThan(0)
      })
    })

    it('should handle items with decimal amounts', () => {
      const decimalList: ShoppingListItem[] = [
        { id: '1', name: 'Queijo', amount: '0.5', unit: 'kg', category: 'Laticínios', purchased: false },
        { id: '2', name: 'Queijo', amount: '0.3', unit: 'kg', category: 'Laticínios', purchased: false },
        { id: '3', name: 'Queijo', amount: '0.2', unit: 'kg', category: 'Laticínios', purchased: true }
      ]
      
      const result = consolidateShoppingList(decimalList)
      
      expect(result).toHaveLength(1)
      expect(result[0].totalAmount).toBeCloseTo(1.0, 1) // 0.5 + 0.3 + 0.2
    })
  })

  describe('normalizeIngredientName', () => {
    it('should normalize ingredient names for comparison', () => {
      expect(normalizeIngredientName('Tomate Cereja')).toBe('tomate cereja')
      expect(normalizeIngredientName('CEBOLA ROXA')).toBe('cebola roxa')
      expect(normalizeIngredientName('Açúcar Cristal')).toBe('acucar cristal')
    })

    it('should remove numbers and units from names', () => {
      expect(normalizeIngredientName('Tomate 2kg')).toBe('tomate')
      expect(normalizeIngredientName('Leite 1 litro')).toBe('leite')
      expect(normalizeIngredientName('Ovos 12 unidades')).toBe('ovos')
      expect(normalizeIngredientName('Farinha 500g')).toBe('farinha')
    })

    it('should handle complex ingredient names', () => {
      expect(normalizeIngredientName('Azeite Extra Virgem 500ml')).toBe('azeite extra virgem')
      expect(normalizeIngredientName('Queijo Parmesão Ralado 100g')).toBe('queijo parmesao ralado')
    })
  })

  describe('isShoppingListComplete', () => {
    it('should return true for empty list', () => {
      expect(isShoppingListComplete([])).toBe(true)
    })

    it('should return true when all items are purchased', () => {
      const completedList: ShoppingListItem[] = [
        { id: '1', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: true },
        { id: '2', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: true }
      ]
      
      expect(isShoppingListComplete(completedList)).toBe(true)
    })

    it('should return false when some items are not purchased', () => {
      const incompleteList: ShoppingListItem[] = [
        { id: '1', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: true },
        { id: '2', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false }
      ]
      
      expect(isShoppingListComplete(incompleteList)).toBe(false)
    })

    it('should return false when all items are not purchased', () => {
      const unpurchasedList: ShoppingListItem[] = [
        { id: '1', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: false },
        { id: '2', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false }
      ]
      
      expect(isShoppingListComplete(unpurchasedList)).toBe(false)
    })
  })
})