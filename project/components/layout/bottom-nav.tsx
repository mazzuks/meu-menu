'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, List, Wallet, User } from 'lucide-react'

const items = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/lista', label: 'Lista', icon: List },
  { href: '/gastos', label: 'Controle', icon: Wallet },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-white/90 backdrop-blur">
      <ul className="mx-auto flex max-w-[480px] items-center justify-between px-4 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center text-xs transition ${
                  active ? 'text-rose-600' : 'text-slate-600'
                }`}
              >
                <Icon size={22} className="mb-1" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
