/**
 * Bottom navigation component
 * Componente de navegação inferior
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, List, PiggyBank, User } from 'lucide-react'

const navItems = [
  {
    href: '/',
    label: 'Início 🍽️',
    icon: Home
  },
  {
    href: '/buscar',
    label: 'Buscar 🔍',
    icon: Search
  },
  {
    href: '/lista',
    label: 'Lista 📝',
    icon: List
  },
  {
    href: '/gastos',
    label: 'Controle de Gastos 🐷',
    icon: PiggyBank
  },
  {
    href: '/perfil',
    label: 'Perfil 👤',
    icon: User
  }
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
              style={{ minHeight: '44px' }}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium leading-tight text-center">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}