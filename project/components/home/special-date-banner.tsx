'use client'

import Link from 'next/link'
import Image from 'next/image'
import { mockRecipes } from '@/lib/mock-data'
import { Utensils } from 'lucide-react'

export function SpecialDateBanner() {
  const picanha = mockRecipes.find((r) => r.slug === 'churrasco-picanha')
  const href = picanha ? `/receitas/${picanha.slug}` : '/receitas'

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm md:grid md:grid-cols-[1fr,12rem] md:gap-6">
      {/* Texto */}
      <div>
        <p className="text-xs font-semibold text-slate-500">HOJE É DIA DE</p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">Dia dos Pais</h3>
        <p className="mt-1 max-w-[22rem] text-sm text-slate-600">
          Picanha grelhada no ponto perfeito com farofa e vinagrete
        </p>

        {/* CTA destacado */}
        <div className="mt-4">
          <Link
            href={href}
            prefetch
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white shadow-sm transition-all hover:shadow-md hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60"
          >
            <Utensils className="h-4 w-4" />
            Ver Receita
          </Link>
        </div>
      </div>

      {/* Imagem aprimorada (coluna direita) */}
      {picanha?.image && (
        <div className="hidden md:block self-center">
          <div className="relative aspect-[4/3] w-44 md:w-48 overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm">
            <Image
              src={picanha.image}
              alt={picanha.title}
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
