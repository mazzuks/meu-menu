/**
 * Recipe detail page
 * Página de detalhes da receita
 */

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Users, ChefHat, Plus, Check } from 'lucide-react'
import { getRecipeBySlug } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { suggestByLeftovers } from '@/lib/suggest'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { toast } from 'react-hot-toast'

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToShoppingList, stock, applyRecipe } = useAppStore()
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [isApplying, setIsApplying] = useState(false)

  const recipe = getRecipeBySlug(params.slug as string)

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Receita não encontrada</h1>
          <p className="text-gray-600 mb-4">A receita que você procura não existe.</p>
          <Button onClick={() => router.push('/receitas')}>
            Voltar para Receitas
          </Button>
        </div>
      </div>
    )
  }

  const handleIngredientCheck = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId)
    } else {
      newChecked.add(ingredientId)
    }
    setCheckedIngredients(newChecked)
  }

  const handleAddToList = () => {
    recipe.ingredients.forEach(ingredient => {
      addToShoppingList({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        category: 'Diversos',
        recipeId: recipe.id
      })
    })
    
    toast.success('Ingredientes adicionados à lista!')
  }

  const handleMadeRecipe = async () => {
    setIsApplying(true)
    
    try {
      const result = applyRecipe(recipe)
      toast.success(`Lista e estoque atualizados! ${result.debited} itens debitados.`)
    } catch (error) {
      toast.error('Erro ao aplicar receita ao estoque')
    } finally {
      setIsApplying(false)
    }
  }

  // Get suggestions based on current stock
  const suggestions = suggestByLeftovers(stock, [recipe], 3)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-600 bg-green-100'
      case 'Médio': return 'text-yellow-600 bg-yellow-100'
      case 'Difícil': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={recipe.title} showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Recipe image */}
          <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-6">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime} min</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} porções</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              {recipe.description}
            </p>

            <div className="flex gap-2 mb-6">
              <Button onClick={handleAddToList} className="flex-1" aria-label="Adicionar ingredientes à lista de compras">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar à Lista
              </Button>
              
              <Button 
                onClick={handleMadeRecipe}
                disabled={isApplying}
                className="flex-1 bg-green-600 hover:bg-green-700"
                style={{ minHeight: '44px' }}
                aria-label="Marcar receita como feita e debitar do estoque"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                {isApplying ? 'Aplicando...' : 'FIZ ESSA RECEITA'}
              </Button>
            </div>
          </div>

          {/* Ingredients */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Ingredientes</h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center gap-3">
                    <button
                      onClick={() => handleIngredientCheck(ingredient.id)}
                      className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center hover:border-red-500 transition-colors"
                      aria-label={`Marcar ingrediente ${ingredient.name} como verificado`}
                    >
                      {checkedIngredients.has(ingredient.id) && (
                        <Check className="w-3 h-3 text-red-500" />
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${
                      checkedIngredients.has(ingredient.id) 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {ingredient.amount} {ingredient.unit} de {ingredient.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Modo de Preparo</h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition info */}
          {recipe.nutrition && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Informações Nutricionais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{recipe.nutrition.calories}</div>
                    <div className="text-xs text-gray-600">Calorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{recipe.nutrition.protein}g</div>
                    <div className="text-xs text-gray-600">Proteína</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{recipe.nutrition.carbs}g</div>
                    <div className="text-xs text-gray-600">Carboidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{recipe.nutrition.fat}g</div>
                    <div className="text-xs text-gray-600">Gordura</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions based on leftovers */}
          {suggestions.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Aproveite o que sobrou</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestedRecipe) => (
                    <RecipeCard key={suggestedRecipe.id} recipe={suggestedRecipe} variant="horizontal" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}