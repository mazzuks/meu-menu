'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/lib/mock-data'

export function RecipeCarousel({ title, recipes }: { title: string; recipes: Recipe[] }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-semibold text-gray-900">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {recipes.map((r) => (
          <Link
            key={r.id}
            href={`/receitas/${r.slug}`}
            prefetch
            className="min-w-[180px] rounded-xl border bg-white shadow-sm transition hover:shadow"
          >
            <div className="relative h-28 w-full overflow-hidden rounded-t-xl">
              {/* pode manter <img> se preferir */}
              <Image src={r.image} alt={r.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium text-gray-900">{r.title}</p>
              <p className="mt-1 text-xs text-gray-500">{r.prepTime} min • {r.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
