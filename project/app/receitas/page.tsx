import { mockRecipes } from '@/lib/mock-data'
import { RecipeCard } from '@/components/recipe/recipe-card'

const titlefy = (r: any) =>
  r?.title
    ?? r?.name
    ?? (r?.slug ? r.slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Receita')

export default function RecipesIndex() {
  const data = mockRecipes.map(r => ({ ...r, title: titlefy(r) }))

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">Receitas</h1>
      <div className="grid grid-cols-2 gap-3">
        {data.map(r => (
          <RecipeCard key={r.id} recipe={r} fill />
        ))}
      </div>
    </main>
  )
}
