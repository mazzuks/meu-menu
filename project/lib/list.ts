/**
 * Smart shopping list utilities
 * Utilitários para lista de compras inteligente
 */

import { ShoppingListItem, Recipe } from '@/lib/mock-data'

export interface StockItem {
  id: string
  desc: string
  qtd: number
  un: string
  preco?: number
  precoTotal?: number
  categoria: string
}

/**
 * Normalize text for comparison
 * Normaliza texto para comparação
 */
export function normalizeIngredientName(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\d+/g, '') // Remove numbers
    .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm|litro|litros)/gi, '') // Remove units
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Consolidate shopping list items
 * Consolida itens da lista de compras
 */
export function consolidate(items: ShoppingListItem[]): ShoppingListItem[] {
  const consolidated = new Map<string, ShoppingListItem>()
  
  items.forEach(item => {
    const normalizedName = normalizeIngredientName(item.name)
    const key = `${normalizedName}-${item.unit}`
    
    if (consolidated.has(key)) {
      const existing = consolidated.get(key)!
      const existingAmount = parseFloat(existing.amount) || 0
      const currentAmount = parseFloat(item.amount) || 0
      
      consolidated.set(key, {
        ...existing,
        amount: (existingAmount + currentAmount).toString(),
        purchased: existing.purchased && item.purchased // Both must be purchased
      })
    } else {
      consolidated.set(key, { ...item })
    }
  })
  
  return Array.from(consolidated.values())
}

/**
 * Find missing ingredients for recipes based on current stock
 * Encontra ingredientes faltantes para receitas baseado no estoque atual
 */
export function missingFor(recipes: Recipe[], stock: StockItem[]): ShoppingListItem[] {
  const missing: ShoppingListItem[] = []
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const normalizedIngredient = normalizeIngredientName(ingredient.name)
      const needed = parseFloat(ingredient.amount) || 1
      
      // Find matching stock item
      const stockItem = stock.find(stockItem => {
        const normalizedStock = normalizeIngredientName(stockItem.desc)
        return normalizedStock.includes(normalizedIngredient) || 
               normalizedIngredient.includes(normalizedStock)
      })
      
      const available = stockItem ? stockItem.qtd : 0
      
      if (available < needed) {
        const missingAmount = needed - available
        
        missing.push({
          id: `missing-${recipe.id}-${ingredient.id}`,
          name: ingredient.name,
          amount: missingAmount.toString(),
          unit: ingredient.unit,
          category: inferCategory(ingredient.name),
          purchased: false,
          recipeId: recipe.id
        })
      }
    })
  })
  
  return consolidate(missing)
}

/**
 * Check if shopping list is complete
 * Verifica se a lista de compras está completa
 */
export function isShoppingListComplete(items: ShoppingListItem[]): boolean {
  if (items.length === 0) return true
  return items.every(item => item.purchased)
}

/**
 * Infer category from ingredient name
 * Infere categoria pelo nome do ingrediente
 */
function inferCategory(name: string): string {
  const lowerName = name.toLowerCase()
  
  if (lowerName.includes('tomate') || lowerName.includes('cebola') || lowerName.includes('alface') || 
      lowerName.includes('pimentão') || lowerName.includes('abobrinha') || lowerName.includes('berinjela')) {
    return 'Hortifruti'
  }
  if (lowerName.includes('queijo') || lowerName.includes('leite') || lowerName.includes('iogurte') || 
      lowerName.includes('manteiga') || lowerName.includes('cream cheese')) {
    return 'Laticínios'
  }
  if (lowerName.includes('carne') || lowerName.includes('frango') || lowerName.includes('peixe') || 
      lowerName.includes('camarão') || lowerName.includes('bacon')) {
    return 'Açougue'
  }
  if (lowerName.includes('arroz') || lowerName.includes('feijão') || lowerName.includes('macarrão') || 
      lowerName.includes('farinha') || lowerName.includes('açúcar')) {
    return 'Mercearia'
  }
  if (lowerName.includes('pão') || lowerName.includes('biscoito')) {
    return 'Padaria'
  }
  
  return 'Diversos'
}