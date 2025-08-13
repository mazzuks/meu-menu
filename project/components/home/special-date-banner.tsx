'use client'
import Link from 'next/link'

export function SpecialDateBanner() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm relative overflow-hidden">
      {/* ...título, descrição, imagem... */}
      <Link
        href="/receitas/churrasco-picanha"
        className="inline-flex items-center rounded-xl px-4 py-2 bg-black text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
      >
        Ver Receitas
      </Link>
    </section>
  )
}
