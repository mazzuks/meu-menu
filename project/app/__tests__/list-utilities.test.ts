/**
 * Tests for shopping list utilities
 * Testes para utilitários da lista de compras
 */

import { describe, it, expect } from 'vitest'
import { 
  normalizeIngredientName, 
  consolidateShoppingList, 
  compareStockWithRecipes,
  generateShoppingListFromMissing,
  isShoppingListComplete
} from '@/lib/list'
import { ShoppingListItem, mockRecipes } from '@/lib/mock-data'
import { StockItem } from '@/lib/list'

describe('normalizeIngredientName', () => {
  it('should remove accents and normalize text', () => {
    expect(normalizeIngredientName('Açúcar cristal')).toBe('acucar cristal')
    expect(normalizeIngredientName('Pimentão vermelho')).toBe('pimentao vermelho')
  })

  it('should remove numbers and units', () => {
    expect(normalizeIngredientName('Tomate 2kg')).toBe('tomate')
    expect(normalizeIngredientName('Leite 1 litro')).toBe('leite')
    expect(normalizeIngredientName('Ovos 12 unidades')).toBe('ovos')
  })

  it('should handle complex ingredient names', () => {
    expect(normalizeIngredientName('Farinha de trigo 1kg especial')).toBe('farinha de trigo especial')
    expect(normalizeIngredientName('Azeite extra virgem 500ml')).toBe('azeite extra virgem')
  })
})

describe('consolidateShoppingList', () => {
  it('should consolidate items with same name and unit', () => {
    const items: ShoppingListItem[] = [
      { id: '1', name: 'Tomate', amount: '2', unit: 'kg', category: 'Hortifruti', purchased: false },
      { id: '2', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: false },
      { id: '3', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false }
    ]

    const result = consolidateShoppingList(items)
    
    expect(result).toHaveLength(2)
    expect(result[0].totalAmount).toBe(3) // 2 + 1
    expect(result[0].name).toBe('Tomate')
    expect(result[1].totalAmount).toBe(500)
    expect(result[1].name).toBe('Cebola')
  })

  it('should not consolidate items with different units', () => {
    const items: ShoppingListItem[] = [
      { id: '1', name: 'Tomate', amount: '2', unit: 'kg', category: 'Hortifruti', purchased: false },
      { id: '2', name: 'Tomate', amount: '5', unit: 'unidades', category: 'Hortifruti', purchased: false }
    ]

    const result = consolidateShoppingList(items)
    expect(result).toHaveLength(2)
  })
})

describe('compareStockWithRecipes', () => {
  it('should identify missing ingredients', () => {
    const stock: StockItem[] = [
      { id: '1', name: 'Tomate', quantity: 1, unit: 'kg', category: 'Hortifruti' },
      { id: '2', name: 'Queijo mussarela', quantity: 100, unit: 'g', category: 'Laticínios' }
    ]

    const recipes = [mockRecipes[0]] // Pizza Margherita
    const missing = compareStockWithRecipes(stock, recipes)
    
    expect(missing.length).toBeGreaterThan(0)
    expect(missing.some(item => normalizeIngredientName(item.name).includes('massa'))).toBe(true)
  })

  it('should handle sufficient stock', () => {
    const stock: StockItem[] = [
      { id: '1', name: 'Massa de pizza', quantity: 2, unit: 'unidade', category: 'Massas' },
      { id: '2', name: 'Molho de tomate', quantity: 500, unit: 'ml', category: 'Conservas' },
      { id: '3', name: 'Mussarela', quantity: 300, unit: 'g', category: 'Laticínios' },
      { id: '4', name: 'Manjericão fresco', quantity: 20, unit: 'folhas', category: 'Hortifruti' },
      { id: '5', name: 'Azeite', quantity: 10, unit: 'colheres de sopa', category: 'Condimentos' }
    ]

    const recipes = [mockRecipes[0]] // Pizza Margherita
    const missing = compareStockWithRecipes(stock, recipes)
    
    expect(missing).toHaveLength(0)
  })
})

describe('generateShoppingListFromMissing', () => {
  it('should generate shopping list items from missing ingredients', () => {
    const missing = [
      { name: 'Massa de pizza', needed: 1, available: 0, unit: 'unidade', category: 'Massas' },
      { name: 'Molho de tomate', needed: 200, available: 50, unit: 'ml', category: 'Conservas' }
    ]

    const result = generateShoppingListFromMissing(missing)
    
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Massa de pizza')
    expect(result[0].amount).toBe('1')
    expect(result[1].name).toBe('Molho de tomate')
    expect(result[1].amount).toBe('150') // 200 - 50
  })
})

describe('isShoppingListComplete', () => {
  it('should return true for empty list', () => {
    expect(isShoppingListComplete([])).toBe(true)
  })

  it('should return true when all items are purchased', () => {
    const items: ShoppingListItem[] = [
      { id: '1', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: true },
      { id: '2', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: true }
    ]
    
    expect(isShoppingListComplete(items)).toBe(true)
  })

  it('should return false when some items are not purchased', () => {
    const items: ShoppingListItem[] = [
      { id: '1', name: 'Tomate', amount: '1', unit: 'kg', category: 'Hortifruti', purchased: true },
      { id: '2', name: 'Cebola', amount: '500', unit: 'g', category: 'Hortifruti', purchased: false }
    ]
    
    expect(isShoppingListComplete(items)).toBe(false)
  })
})