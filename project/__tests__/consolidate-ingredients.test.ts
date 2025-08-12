/**
 * Tests for ingredient consolidation
 * Testes para consolidação de ingredientes
 */

import { describe, it, expect } from 'vitest'
import { consolidateIngredients, getRecipesByIds } from '@/lib/mock-data'

describe('consolidateIngredients', () => {
  it('should consolidate ingredients from multiple recipes', () => {
    const recipeIds = ['1', '2'] // Pizza and Soup
    const result = consolidateIngredients(recipeIds)
    
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('amount')
    expect(result[0]).toHaveProperty('unit')
    expect(result[0]).toHaveProperty('category')
    expect(result[0]).toHaveProperty('purchased')
  })

  it('should return empty array for empty recipe list', () => {
    const result = consolidateIngredients([])
    expect(result).toEqual([])
  })

  it('should handle non-existent recipe IDs', () => {
    const result = consolidateIngredients(['999'])
    expect(result).toEqual([])
  })

  it('should include recipe ID in consolidated items', () => {
    const recipeIds = ['1']
    const result = consolidateIngredients(recipeIds)
    
    result.forEach(item => {
      expect(item.recipeId).toBe('1')
    })
  })
})

describe('getRecipesByIds', () => {
  it('should return recipes for valid IDs', () => {
    const recipes = getRecipesByIds(['1', '2'])
    expect(recipes).toHaveLength(2)
    expect(recipes[0].id).toBe('1')
    expect(recipes[1].id).toBe('2')
  })

  it('should filter out invalid IDs', () => {
    const recipes = getRecipesByIds(['1', '999'])
    expect(recipes).toHaveLength(1)
    expect(recipes[0].id).toBe('1')
  })

  it('should return empty array for no valid IDs', () => {
    const recipes = getRecipesByIds(['999', '888'])
    expect(recipes).toEqual([])
  })
})