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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
      {/* Texto */}
      <p className="text-xs font-semibold text-slate-500">HOJE É DIA DE</p>
      <h3 className="mt-1 text-xl font-bold text-slate-900">Dia dos Pais</h3>
      <p className="mt-1 max-w-[22rem] text-sm text-slate-600">
        Picanha grelhada no ponto perfeito com farofa e vinagrete
      </p>

      {/* Ações */}
      <div className="mt-3 flex gap-3">
        <Link
          href="/receitas"
          prefetch
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-white"
        >
          Ver Receitas
        </Link>

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

      {/* Imagem do prato à direita */}
      {picanha?.image && (
        <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="relative h-28 w-40">
            <Image
              src={picanha.image}
              alt={picanha.title}
              fill
              className="rounded-xl object-cover"
              sizes="160px"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
