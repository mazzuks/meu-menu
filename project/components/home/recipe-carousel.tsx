'use client'

import Link from 'next/link'
import Image from 'next/image'

type Ingredient = {
  id: string
  name: string
  amount: string
  unit: string
}

type Recipe = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  imageUrl?: string
  prepTime: number
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  servings: number
  category: string
  tags: string[]
}

export function RecipeCarousel({ title, recipes }: { title: string; recipes: Recipe[] }) {
  return (
    <section className="mt-6">
      <h2 className="px-1 text-base font-semibold">{title}</h2>
      <div className="mt-3 px-1 flex gap-3 overflow-x-auto no-scrollbar">
        {recipes.map((r) => {
          const img = r.imageUrl || r.image
          return (
            <Link
              key={r.id}
              href={`/receitas/${r.slug}`}
              aria-label={`Abrir receita ${r.title}`}
              className="min-w-[200px] max-w-[200px] shrink-0 rounded-2xl border shadow-sm bg-white overflow-hidden hover:scale-[0.99] transition pointer-events-auto"
            >
              {img ? (
                <Image
                  src={img}
                  alt={r.title}
                  width={400}
                  height={260}
                  className="w-full h-[120px] object-cover"
                />
              ) : null}
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">{r.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                <div className="mt-2 text-[11px] text-gray-500 flex gap-2">
                  <span>{r.prepTime} min</span>•<span>{r.difficulty}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
