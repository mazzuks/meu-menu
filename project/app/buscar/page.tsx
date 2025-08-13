'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import BottomNav from '@/components/layout/bottom-nav'
import { mockRecipes } from '@/lib/mock-data'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 12

const categories = [
  'Todas',
  'Brasileira',
  'Italiana',
  'Japonesa',
  'Coreana',
  'Argentina',
  'Mexicana',
  'Francesa',
  'Chinesa',
  'Portuguesa',
  'Mediterrânea',
  'Árabe',
  'Tailandesa',
  'Indiana',
  'Espanhola',
  'Peruana',
  'Doces',
  'Saladas',
]

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // filtros (busca + categoria) sobre TODAS as receitas do app
  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockRecipes.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategory === 'Todas' || r.category === selectedCategory
      return matchesQuery && matchesCategory
    })
  }, [query, selectedCategory])

  // itens visíveis e “tem mais?”
  const visible = filteredRecipes.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filteredRecipes.length

  // ao trocar busca/categoria, volta pra página 1
  useEffect(() => setPage(1), [query, selectedCategory])

  // infinite scroll
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1)
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, visible.length])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top bar fixa com voltar, busca e filtros */}
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur">
        <div className="mx-auto max-w-md px-4 pt-3">
          <div className="mb-3 flex items-center gap-2">
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

          {/* filtros por categoria abaixo da busca */}
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={selectedCategory === c ? 'default' : 'outline'}
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="mx-auto max-w-md">
          <p className="mb-3 text-sm text-gray-600">
            {filteredRecipes.length} resultado{filteredRecipes.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {visible.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/receitas/${recipe.slug}`}
                prefetch
                className="block"
              >
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
          </div>

          {/* carregamento incremental */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-6">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-500">Carregando mais...</span>
            </div>
          )}

          {!hasMore && filteredRecipes.length > 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              Você chegou ao fim 😊
            </div>
          )}

          {filteredRecipes.length === 0 && (
            <div className="py-16 text-center text-sm text-gray-400">
              Nenhuma receita encontrada
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
