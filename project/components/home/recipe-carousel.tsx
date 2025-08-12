/**
 * Recipe carousel component
 * Componente de carrossel de receitas
 */

'use client'

import { RecipeCard } from '@/components/recipe/recipe-card'
import { Recipe } from '@/lib/mock-data'

interface RecipeCarouselProps {
  title: string
  recipes: Recipe[]
  variant?: 'default' | 'horizontal' | 'large'
}

export function RecipeCarousel({ title, recipes, variant = 'default' }: RecipeCarouselProps) {
  if (recipes.length === 0) return null

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className={variant === 'large' ? 'min-w-[280px]' : 'min-w-[200px]'}
          >
            <RecipeCard recipe={recipe} variant={variant} />
          </div>
        ))}
      </div>
    </section>
  )
}