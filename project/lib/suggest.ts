/**
 * Recipe suggestions based on available stock
 * Sugestões de receitas baseadas no estoque disponível
 */

import { Recipe } from '@/lib/mock-data'
import { StockItem } from '@/lib/list'

/**
 * Suggest recipes based on leftover stock items
 * Sugere receitas baseadas nos itens restantes do estoque
 */
export function suggestByLeftovers(
  stock: StockItem[], 
  recipes: Recipe[], 
  limit: number = 3
): Recipe[] {
  if (stock.length === 0) return []
  
  // Normalize stock items for better matching
  const normalizedStock = stock.map(item => ({
    ...item,
    normalizedDesc: item.desc
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\d+/g, '')
      .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }))
  
  // Score recipes based on ingredient matches
  const scoredRecipes = recipes.map(recipe => {
    let score = 0
    let matchedIngredients = 0
    
    recipe.ingredients.forEach(ingredient => {
      const normalizedIngredient = ingredient.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\d+/g, '')
        .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Check if ingredient matches any stock item
      const hasMatch = normalizedStock.some(stockItem => 
        stockItem.normalizedDesc.includes(normalizedIngredient) || 
        normalizedIngredient.includes(stockItem.normalizedDesc)
      )
      
      if (hasMatch) {
        score += 1
        matchedIngredients++
      }
    })
    
    // Calculate match percentage
    const matchPercentage = recipe.ingredients.length > 0 
      ? matchedIngredients / recipe.ingredients.length 
      : 0
    
    return { 
      recipe, 
      score, 
      matchedIngredients,
      matchPercentage 
    }
  })
  
  // Return top recipes with score > 0, ordered by match percentage and score
  return scoredRecipes
    .filter(item => item.score > 0)
    .sort((a, b) => {
      // First by match percentage, then by absolute score
      if (a.matchPercentage !== b.matchPercentage) {
        return b.matchPercentage - a.matchPercentage
      }
      return b.score - a.score
    })
    .slice(0, limit)
    .map(item => item.recipe)
}