import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/lib/mock-data'

export function RecipeCarousel({ title, recipes }: { title: string; recipes: Recipe[] }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recipes.map(r => (
          <Link
            key={r.id}
            href={`/receitas/${r.slug}`}
            className="min-w-[200px] rounded-xl border bg-white shadow-sm hover:shadow transition"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
              <Image src={r.image} alt={r.title} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium">{r.title}</p>
              <p className="mt-1 text-xs text-slate-500">{r.prepTime} min • {r.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
