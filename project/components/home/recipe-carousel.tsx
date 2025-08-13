import { RecipeCard } from '@/components/recipe/recipe-card'

export function RecipeCarousel({ recipes }: { recipes: any[] }) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-3 px-4">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  )
}
