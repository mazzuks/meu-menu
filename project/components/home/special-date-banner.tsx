'use client'

import Link from 'next/link'

export function SpecialDateBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">HOJE É DIA DE</p>
      <h3 className="mt-1 text-xl font-bold text-slate-900">Dia dos Pais</h3>
      <p className="mt-1 max-w-[22rem] text-sm text-slate-600">
        Picanha grelhada no ponto perfeito com farofa e vinagrete
      </p>

      <div className="mt-3 flex gap-3">
        <Link
          href="/receitas"
          prefetch
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-white"
        >
          Ver Receitas
        </Link>

        {/* Exemplo para vídeo; troque por uma URL real se quiser */}
        <Link
          href="/reels"
          prefetch
          className="inline-flex items-center rounded-lg border px-3 py-2 text-slate-700"
        >
          Ver Vídeo
        </Link>
      </div>
    </div>
  )
}
