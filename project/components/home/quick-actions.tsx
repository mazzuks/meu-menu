'use client'

import Link from 'next/link'
import { ChefHat, ListChecks, Wallet, Camera } from 'lucide-react'

const actions = [
  { href: '/receitas', label: 'Receitas', Icon: ChefHat, bg: 'bg-orange-50', dot: 'bg-orange-200' },
  { href: '/lista', label: 'Lista de Compras', Icon: ListChecks, bg: 'bg-blue-50', dot: 'bg-blue-200' },
  { href: '/gastos', label: 'Controle de Gastos', Icon: Wallet, bg: 'bg-yellow-50', dot: 'bg-yellow-200' },
  { href: '/enviar-nota', label: 'Enviar Nota', Icon: Camera, bg: 'bg-rose-50', dot: 'bg-rose-200' },
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
          <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-6 w-6 ${dot.replace('bg-', 'text-')}`} />
          </div>
          <p className="text-center text-sm font-medium text-gray-800">{label}</p>
        </Link>
      ))}
    </div>
  )
}
