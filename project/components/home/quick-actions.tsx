'use client'

import Link from 'next/link'

export function QuickActions() {
  // mantém as MESMAS classes/estilo que você já usava nos cards/botões
  const base =
    'rounded-xl p-4 shadow-sm border bg-white hover:bg-gray-50 active:scale-[0.98] transition select-none'

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <Link href="/receitas" className={base} aria-label="Ir para Receitas">
        <h3 className="text-base font-medium">Receitas</h3>
        <p className="text-xs text-gray-500 mt-1">Catálogo completo</p>
      </Link>

      <Link href="/lista" className={base} aria-label="Ir para Lista de Compras">
        <h3 className="text-base font-medium">Lista</h3>
        <p className="text-xs text-gray-500 mt-1">Itens e orçamento</p>
      </Link>

      <Link href="/buscar" className={base} aria-label="Ir para Buscar">
        <h3 className="text-base font-medium">Buscar</h3>
        <p className="text-xs text-gray-500 mt-1">Digite um ingrediente</p>
      </Link>

      <Link href="/promocoes" className={base} aria-label="Ir para Promoções">
        <h3 className="text-base font-medium">Promoções</h3>
        <p className="text-xs text-gray-500 mt-1">Ofertas ativas</p>
      </Link>
    </div>
  )
}
