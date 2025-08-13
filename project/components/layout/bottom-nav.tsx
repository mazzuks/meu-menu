'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, List, Wallet, User2 } from 'lucide-react'

const items = [
  { href: '/', label: 'Início', Icon: Home },
  { href: '/buscar', label: 'Buscar', Icon: Search },
  { href: '/lista', label: 'Lista', Icon: List },
  { href: '/gastos', label: 'Controle', Icon: Wallet },
  { href: '/perfil', label: 'Perfil', Icon: User2 },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-t">
      <ul className="mx-auto flex max-w-md items-stretch justify-between">
        {items.map(({ href, label, Icon }) => {
<<<<<<< HEAD
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
=======
          const active =
            href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)
>>>>>>> dan/wip-2025-08-12
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                prefetch
                aria-current={active ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-sm ${
                  active ? 'text-rose-600' : 'text-gray-600'
                }`}
              >
<<<<<<< HEAD
                <Icon className={`h-5 w-5 ${active ? 'stroke-rose-600' : 'stroke-gray-600'}`} />
=======
                <Icon
                  className={`h-5 w-5 ${active ? 'stroke-rose-600' : 'stroke-gray-600'}`}
                />
>>>>>>> dan/wip-2025-08-12
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
