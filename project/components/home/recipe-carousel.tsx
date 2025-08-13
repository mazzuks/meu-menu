// components/home/recipe-carousel.tsx
import { RecipeCard } from '@/components/recipe/recipe-card'

export function RecipeCarousel({ recipes }: { recipes: any[] }) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-4 px-4 py-2 snap-x snap-mandatory">
        {recipes.map((r) => (
          <div key={r.id} className="snap-start">
            <RecipeCard recipe={r} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeCarousel
