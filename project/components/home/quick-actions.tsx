'use client'

import Link from 'next/link'
import { ChefHat, ListChecks, Wallet, Camera } from 'lucide-react'

const actions = [
  { href: '/receitas',      label: 'Receitas',         Icon: ChefHat,   bg: 'bg-orange-100', dot: 'bg-orange-600' },
  { href: '/lista',         label: 'Lista de Compras', Icon: ListChecks,bg: 'bg-blue-100',   dot: 'bg-blue-600' },
  { href: '/gastos',        label: 'Controle de Gastos', Icon: Wallet,  bg: 'bg-yellow-100', dot: 'bg-yellow-600' },
  { href: '/enviar-nota',   label: 'Enviar Nota',      Icon: Camera,    bg: 'bg-rose-100',   dot: 'bg-rose-600' },
]

export function QuickActions() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {actions.map(({ href, label, Icon, bg, dot }) => (
        <Link
          key={href}
          href={href}
          prefetch
          className="rounded-2xl border p-5 shadow-sm transition hover:shadow"
        >
          <div
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${bg} bg-opacity-40`}
          >
            <Icon className={`h-6 w-6 ${dot.replace('bg-', 'text-')} drop-shadow-md`} />
          </div>
          <p className="text-center text-sm font-medium text-gray-800">{label}</p>
        </Link>
      ))}
    </div>
  )
}
