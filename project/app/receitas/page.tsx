import { mockRecipes } from '@/lib/mock-data'
import { RecipeCard } from '@/components/recipe/recipe-card'

<div className="grid grid-cols-2 gap-3">
  {mockRecipes.map((r) => (
    <RecipeCard key={r.id} recipe={r} fill />
  ))}
</div>

export default function RecipesIndex() {
  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">Receitas</h1>
      <div className="grid grid-cols-2 gap-3">
        {mockRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} fill />
        ))}
      </div>
    </main>
  )
}
