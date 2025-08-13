'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import BottomNav from '@/components/layout/bottom-nav'
import { mockRecipes } from '@/lib/mock-data'
import { RecipeCard } from '@/components/recipe/recipe-card'

const PAGE_SIZE = 12 // quantos itens por “lote”

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // filtra todas as receitas do app
  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockRecipes
    return mockRecipes.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [query])

  // fatias visíveis + controle de “tem mais?”
  const visible = filteredRecipes.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filteredRecipes.length

  // ao mudar a busca, volta pra primeira página
  useEffect(() => setPage(1), [query])

  // infinite scroll: quando o sentinel entra em viewport, carrega mais
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1)
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, visible.length])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top bar: voltar + campo de busca */}
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="Voltar"
            className="rounded-lg border bg-white px-2 py-2 hover:bg-white/90"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar receitas"
            className="flex-1 rounded-lg border bg-white/90 px-3 py-2"
          />
        </div>
      </div>

      <div className="px-4">
        <div className="mx-auto max-w-md">
          <p className="mb-3 text-sm text-gray-600">
            {filteredRecipes.length} resultado{filteredRecipes.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {visible.map((recipe) => (
              <Link key={recipe.id} href={`/receitas/${recipe.slug}`} prefetch className="block">
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
          </div>

          {/* sentinel do infinite scroll */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-6">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-500">Carregando mais...</span>
            </div>
          )}

          {!hasMore && filteredRecipes.length > 0 && (
            <div className="py-8 text-center text-sm text-gray-400">Você chegou ao fim 😊</div>
          )}

          {filteredRecipes.length === 0 && (
            <div className="py-16 text-center text-gray-400">Nenhuma receita encontrada</div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
