/**
 * Search page
 * Página de busca
 */

'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import { mockRecipes, searchRecipes } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const categories = ['Todas', 'Brasileira', 'Italiana', 'Japonesa', 'Mexicana', 'Francesa', 'Doces', 'Saladas']
const difficulties = ['Todas', 'Fácil', 'Médio', 'Difícil']

export default function SearchPage() {
  const { searchQuery, selectedCategory, selectedDifficulty, setSelectedCategory, setSelectedDifficulty } = useAppStore()
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [activeDifficulty, setActiveDifficulty] = useState('Todas')

  // Filter recipes based on search and filters / Filtrar receitas baseado na busca e filtros
  const filteredRecipes = useMemo(() => {
    let recipes = mockRecipes

    // Apply search query / Aplicar busca
    if (searchQuery.trim()) {
      recipes = searchRecipes(searchQuery)
    }

    // Apply category filter / Aplicar filtro de categoria
    if (activeCategory !== 'Todas') {
      recipes = recipes.filter(recipe => recipe.category === activeCategory)
    }

    // Apply difficulty filter / Aplicar filtro de dificuldade
    if (activeDifficulty !== 'Todas') {
      recipes = recipes.filter(recipe => recipe.difficulty === activeDifficulty)
    }

    return recipes
  }, [searchQuery, activeCategory, activeDifficulty])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Buscar Receitas" />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Category filters / Filtros de categoria */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty filters / Filtros de dificuldade */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dificuldade</h3>
            <div className="flex gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={activeDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Results / Resultados */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Recipe grid / Grade de receitas */}
          <div className="grid grid-cols-2 gap-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

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