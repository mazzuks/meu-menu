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
  const title =
    recipe.title ||
    recipe.name ||
    (recipe.slug
      ? recipe.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Receita')

  if (variant === 'horizontal') {
    return (
      <Link
        href={href}
        className={`block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 ${className}`}
        aria-label={title}
      >
        <div className="flex">
          {img && (
            <div className="w-28 h-28 overflow-hidden flex-shrink-0">
              <img src={img} alt={title} className="w-full h-full object-cover block" />
            </div>
          )}
          <div className="p-3 flex-1">
            <h3 className="font-medium line-clamp-1">{title}</h3>
            {recipe.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">{recipe.description}</p>
            )}
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
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={[
        'block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 select-none',
        fill ? 'w-full' : 'flex-none w-44 sm:w-48',
        className,
      ].join(' ')}
      aria-label={title}
    >
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
    </Link>
  )
}
