'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ListChecks, ChefHat, User } from 'lucide-react'

const ROUTES = {
  HOME: '/',
  RECEITAS: '/receitas',
  LISTA: '/lista',
  BUSCAR: '/buscar',
  PROMOCOES: '/promocoes',
  PERFIL: '/perfil', // ajuste para /login se preferir
}

type Item = {
  href: string
  label: string
  icon: React.ReactNode
  activeTest: (path: string) => boolean
}

export default function BottomNav() {
  const pathname = usePathname()

  const items: Item[] = [
    { href: ROUTES.HOME,      label: 'Início',   icon: <Home size={22} />,       activeTest: p => p === '/' },
    { href: ROUTES.BUSCAR,    label: 'Buscar',   icon: <Search size={22} />,     activeTest: p => p.startsWith('/buscar') },
    { href: ROUTES.LISTA,     label: 'Lista',    icon: <ListChecks size={22} />, activeTest: p => p.startsWith('/lista') },
    { href: ROUTES.RECEITAS,  label: 'Receitas', icon: <ChefHat size={22} />,    activeTest: p => p.startsWith('/receitas') },
    { href: ROUTES.PERFIL,    label: 'Perfil',   icon: <User size={22} />,       activeTest: p => p.startsWith('/perfil') || p.startsWith('/login') },
  ]

  return (
    <nav
      role="navigation"
      aria-label="Navegação inferior"
      className="fixed bottom-0 inset-x-0 z-50 bg-background/80 backdrop-blur border-t"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.activeTest(pathname)
          return (
            <li key={it.href} className="relative">
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center py-2 select-none
                  ${active ? 'text-primary' : 'text-muted-foreground'}`}
                aria-current={active ? 'page' : undefined}
              >
                {it.icon}
                <span className="text-[11px] leading-none mt-1">{it.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
