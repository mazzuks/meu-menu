'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils' // opcional, se você tiver
import { Clock, ChefHat } from 'lucide-react'

type Recipe = {
  id: string
  slug: string
  title: string
  description?: string
  image?: string
  imageUrl?: string
  prepTime?: number
  difficulty?: 'Fácil' | 'Médio' | 'Difícil'
}

export function RecipeCard({
  recipe,
  variant = 'vertical',
  className,
}: {
  recipe: Recipe
  variant?: 'vertical' | 'horizontal'
  className?: string
}) {
  const href = `/receitas/${recipe.slug}`
  const img = recipe.imageUrl ?? recipe.image

  if (variant === 'horizontal') {
    return (
      <div className={cn('relative bg-white rounded-2xl shadow-sm overflow-hidden', className)}>
        <Link href={href} className="absolute inset-0 z-10" aria-label={recipe.title} />
        <div className="flex">
          {img && (
            <img
              src={img}
              alt={recipe.title}
              className="w-28 h-28 object-cover flex-shrink-0"
            />
          )}
          <div className="p-3 flex-1">
            <h3 className="font-medium line-clamp-1">{recipe.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">{recipe.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-600 mt-2">
              {recipe.prepTime ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} min</span> : null}
              {recipe.difficulty ? <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.difficulty}</span> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // vertical
  return (
    <div className={cn('relative bg-white rounded-2xl shadow-sm overflow-hidden', className)}>
      <Link href={href} className="absolute inset-0 z-10" aria-label={recipe.title} />
      {img && (
        <img
          src={img}
          alt={recipe.title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{recipe.title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-600 mt-1">
          {recipe.prepTime ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} min</span> : null}
          {recipe.difficulty ? <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.difficulty}</span> : null}
        </div>
      </div>
    </div>
  )
}
