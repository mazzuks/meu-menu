'use client'
import Link from 'next/link'
import { Clock, ChefHat } from 'lucide-react'

type Recipe = {
  id: string
  slug: string
  title?: string
  name?: string
  description?: string
  image?: string
  imageUrl?: string
  prepTime?: number
  difficulty?: 'Fácil' | 'Médio' | 'Difícil'
}

export function RecipeCard({
  recipe,
  variant = 'vertical',
  fill = false,
  className = '',
}: {
  recipe: Recipe
  variant?: 'vertical' | 'horizontal'
  fill?: boolean
  className?: string
}) {
  const href = `/receitas/${recipe.slug}`
  const img = recipe.imageUrl ?? recipe.image

  // fallback para sempre ter algo no título
  const title =
    recipe.title ||
    recipe.name ||
    (recipe.slug ? recipe.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Receita')

  if (variant === 'horizontal') {
    return (
      <div className={`relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 ${className}`}>
        <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
        <div className="flex">
          {img && (
            <div className="w-28 h-28 overflow-hidden flex-shrink-0">
              <img src={img} alt={title} className="w-full h-full object-cover block" />
            </div>
          )}
          <div className="p-3 flex-1">
            <h3 className="font-medium line-clamp-1">{title}</h3>
            {recipe.description ? (
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">{recipe.description}</p>
            ) : null}
            <div className="flex items-center gap-3 text-[11px] text-gray-600 mt-2">
              {recipe.prepTime != null && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} min</span>
              )}
              {recipe.difficulty && (
                <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.difficulty}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // vertical (carrossel ou grade)
  return (
    <div
      className={[
        'relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 select-none',
        fill ? 'w-full' : 'flex-none w-44 sm:w-48',
        className,
      ].join(' ')}
    >
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
      <div className="aspect-[4/3] w-full overflow-hidden">
        {img && <img src={img} alt={title} className="w-full h-full object-cover block" />}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-medium leading-tight line-clamp-1">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-600">
          {recipe.prepTime != null && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} min</span>
          )}
          {recipe.difficulty && (
            <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.difficulty}</span>
          )}
        </div>
      </div>
    </div>
  )
}
