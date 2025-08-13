/**
 * Recipes list page
 * Página de lista de receitas
 */

'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import { mockRecipes } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const categories = ['Todas', 'Brasileira', 'Italiana', 'Japonesa', 'Mexicana', 'Francesa', 'Doces', 'Saladas']

export default function RecipesPage() {
  const { searchQuery } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter recipes / Filtrar receitas
  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Todas as Receitas" />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Category filters / Filtros de categoria */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results count / Contagem de resultados */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''}
            </p>
            
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grade
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
            </div>
          </div>

          {/* Recipes grid/list / Grade/lista de receitas */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="horizontal" />
              ))}
            </div>
          )}

          {/* No results / Sem resultados */}
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">Nenhuma receita encontrada</p>
              <p className="text-sm text-gray-400">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}