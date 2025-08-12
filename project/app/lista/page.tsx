/**
 * Shopping list page with intelligent features
 * Página de lista de compras com recursos inteligentes
 */

'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { mockShoppingList, getRecipesByIds } from '@/lib/mock-data'
import { consolidate, missingFor, StockItem } from '@/lib/list'
import { toast } from 'react-hot-toast'

export default function ShoppingListPage() {
  const { shoppingList, togglePurchased, removeFromShoppingList, addToShoppingList, stock } = useAppStore()
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>(['1', '2']) // Mock selected recipes

  // Use mock data if no items in store
  const displayList = shoppingList.length > 0 ? shoppingList : mockShoppingList
  
  // Consolidate items
  const consolidatedList = consolidate(displayList)
  
  // Calculate completion stats
  const totalItems = consolidatedList.length
  const completedItems = consolidatedList.filter(item => item.purchased).length
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const handleCompleteForRecipes = () => {
    const recipes = getRecipesByIds(selectedRecipes)
    const missingItems = missingFor(recipes, stock)
    
    if (missingItems.length === 0) {
      toast.success('Você já tem todos os ingredientes!')
      return
    }
    
    missingItems.forEach(item => {
      addToShoppingList({
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        category: item.category,
        purchased: false,
        recipeId: item.recipeId
      })
    })
    
    toast.success(`${missingItems.length} ingredientes faltantes adicionados!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Lista de Compras" showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Progress card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Progresso</p>
                  <p className="text-lg font-bold text-gray-900">
                    {completedItems}/{totalItems} itens
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-500">
                    {Math.round(completionPercentage)}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Complete for recipes button */}
          <Button 
            onClick={handleCompleteForRecipes}
            className="w-full mb-6"
            style={{ minHeight: '44px' }}
            aria-label="Completar lista para receitas selecionadas"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            COMPLETAR PARA {selectedRecipes.length} RECEITAS
          </Button>

          {/* Shopping list items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Itens da Lista</CardTitle>
            </CardHeader>
            <CardContent>
              {consolidatedList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Lista vazia</p>
                  <p className="text-sm text-gray-400">
                    Adicione receitas para gerar sua lista automaticamente
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consolidatedList.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        item.purchased 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors ${
                          item.purchased
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-red-500'
                        }`}
                        style={{ minHeight: '44px', minWidth: '44px' }}
                        aria-label={`Marcar ${item.name} como ${item.purchased ? 'não comprado' : 'comprado'}`}
                      >
                        {item.purchased && <Check className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${
                          item.purchased ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.amount} {item.unit}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromShoppingList(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        style={{ minHeight: '44px', minWidth: '44px' }}
                        aria-label={`Remover ${item.name} da lista`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}