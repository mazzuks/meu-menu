'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { mockRecipes } from '@/lib/mock-data'

export function SpecialDateBanner() {
  const addRecipeToShoppingList = useAppStore((s) => s.addRecipeToShoppingList)
  const picanha = mockRecipes.find((r) => r.slug === 'churrasco-picanha')

  function handleAddToList() {
    if (picanha) addRecipeToShoppingList(picanha)
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm md:grid md:grid-cols-[1fr,10rem] md:gap-4">
      {/* Coluna esquerda: texto + botões */}
      <div>
        <p className="text-xs font-semibold text-slate-500">HOJE É DIA DE</p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">Dia dos Pais</h3>
        <p className="mt-1 max-w-[22rem] text-sm text-slate-600">
          Picanha grelhada no ponto perfeito com farofa e vinagrete
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/receitas/churrasco-picanha"
            prefetch
            className="inline-flex items-center rounded-lg border px-3 py-2 text-slate-700"
          >
            Ver Receita
          </Link>

          <button
            onClick={handleAddToList}
            className="inline-flex items-center rounded-lg border px-3 py-2 text-slate-700"
          >
            Adicionar à Lista
          </button>
        </div>
      </div>

      {/* Coluna direita: imagem (sem sobrepor) */}
      {picanha?.image && (
        <div className="hidden md:block self-center">
          <div className="relative h-28 w-40 overflow-hidden rounded-xl">
            <Image
              src={picanha.image}
              alt={picanha.title}
              fill
              className="object-cover"
              sizes="160px"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
