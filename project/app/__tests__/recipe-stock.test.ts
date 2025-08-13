/**
 * Tests for recipe stock functionality
 * Testes para funcionalidade de estoque de receitas
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { getRecipeRecommendations, mockRecipes } from '@/lib/mock-data'

// Mock stock data / Dados mockados de estoque
const mockStock = [
  {
    id: '1',
    descricao: 'Tomate Salada 1kg',
    quantidade: 2,
    unidade: 'kg',
    precoUnitario: 4.50,
    precoTotal: 9.00,
    categoria: 'Hortifruti'
  },
  {
    id: '2',
    descricao: 'Queijo Mussarela 200g',
    quantidade: 1,
    unidade: 'pc',
    precoUnitario: 8.90,
    precoTotal: 8.90,
    categoria: 'Laticínios'
  },
  {
    id: '3',
    descricao: 'Massa de Pizza Pronta',
    quantidade: 2,
    unidade: 'un',
    precoUnitario: 3.50,
    precoTotal: 7.00,
    categoria: 'Massas'
  }
]

describe('Recipe Stock Integration', () => {
  describe('getRecipeRecommendations', () => {
    it('should return recipes that match stock ingredients', () => {
      const recommendations = getRecipeRecommendations(mockStock, 3)
      
      expect(recommendations.length).toBeGreaterThan(0)
      expect(recommendations.length).toBeLessThanOrEqual(3)
      
      // Should include pizza recipe since we have tomato, mozzarella, and pizza dough
      const pizzaRecipe = recommendations.find(recipe => 
        recipe.title.toLowerCase().includes('pizza')
      )
      expect(pizzaRecipe).toBeDefined()
    })

    it('should return empty array for empty stock', () => {
      const recommendations = getRecipeRecommendations([], 3)
      expect(recommendations).toEqual([])
    })

    it('should limit results to maxResults parameter', () => {
      const recommendations = getRecipeRecommendations(mockStock, 2)
      expect(recommendations.length).toBeLessThanOrEqual(2)
    })

    it('should score recipes by ingredient intersection', () => {
      const recommendations = getRecipeRecommendations(mockStock, 5)
      
      // First recommendation should have higher score (more matching ingredients)
      if (recommendations.length >= 2) {
        const firstRecipe = recommendations[0]
        const secondRecipe = recommendations[1]
        
        // Count matching ingredients for first recipe
        const firstMatches = firstRecipe.ingredients.filter(ingredient => {
          const normalized = ingredient.name.toLowerCase()
          return normalized.includes('tomate') || 
                 normalized.includes('mussarela') || 
                 normalized.includes('massa')
        }).length
        
        // Count matching ingredients for second recipe
        const secondMatches = secondRecipe.ingredients.filter(ingredient => {
          const normalized = ingredient.name.toLowerCase()
          return normalized.includes('tomate') || 
                 normalized.includes('mussarela') || 
                 normalized.includes('massa')
        }).length
        
        expect(firstMatches).toBeGreaterThanOrEqual(secondMatches)
      }
    })

    it('should handle ingredient name normalization', () => {
      const stockWithAccents = [
        {
          id: '1',
          descricao: 'Açúcar Cristal 1kg',
          quantidade: 1,
          unidade: 'kg',
          precoUnitario: 3.20,
          precoTotal: 3.20,
          categoria: 'Mercearia'
        }
      ]
      
      const recommendations = getRecipeRecommendations(stockWithAccents, 3)
      
      // Should find recipes that use "açúcar" or "acucar"
      const sugarRecipes = recommendations.filter(recipe =>
        recipe.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes('açúcar') ||
          ingredient.name.toLowerCase().includes('acucar')
        )
      )
      
      expect(sugarRecipes.length).toBeGreaterThan(0)
    })
  })
})

// Mock store functionality tests / Testes de funcionalidade do store mockado
describe('Stock Store Operations', () => {
  // Mock implementation of applyRecipeToStock logic / Implementação mockada da lógica
  const applyRecipeToStock = (recipe: any, stock: any[]) => {
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

  it('should decrement stock when recipe is applied', () => {
    const pizzaRecipe = mockRecipes.find(recipe => recipe.slug === 'pizza-margherita')!
    const initialStock = [...mockStock]
    
    const updatedStock = applyRecipeToStock(pizzaRecipe, initialStock)
    
    // Stock should be modified
    expect(updatedStock).not.toEqual(initialStock)
    
    // Should have fewer items or reduced quantities
    const totalInitialItems = initialStock.reduce((sum, item) => sum + item.quantidade, 0)
    const totalUpdatedItems = updatedStock.reduce((sum, item) => sum + item.quantidade, 0)
    
    expect(totalUpdatedItems).toBeLessThan(totalInitialItems)
  })

  it('should remove items when quantity reaches zero', () => {
    const smallStock = [
      {
        id: '1',
        descricao: 'Tomate 500g',
        quantidade: 0.5, // Small quantity
        unidade: 'kg',
        precoUnitario: 4.50,
        precoTotal: 2.25,
        categoria: 'Hortifruti'
      }
    ]
    
    const pizzaRecipe = mockRecipes.find(recipe => recipe.slug === 'pizza-margherita')!
    const updatedStock = applyRecipeToStock(pizzaRecipe, smallStock)
    
    // Tomato should be removed as quantity would go to zero or below
    const tomatoItem = updatedStock.find(item => 
      item.descricao.toLowerCase().includes('tomate')
    )
    
    expect(tomatoItem).toBeUndefined()
  })

  it('should handle non-matching ingredients gracefully', () => {
    const limitedStock = [
      {
        id: '1',
        descricao: 'Ingrediente Inexistente',
        quantidade: 1,
        unidade: 'un',
        precoUnitario: 1.00,
        precoTotal: 1.00,
        categoria: 'Outros'
      }
    ]
    
    const pizzaRecipe = mockRecipes.find(recipe => recipe.slug === 'pizza-margherita')!
    const updatedStock = applyRecipeToStock(pizzaRecipe, limitedStock)
    
    // Stock should remain unchanged as no ingredients match
    expect(updatedStock).toEqual(limitedStock)
  })
})