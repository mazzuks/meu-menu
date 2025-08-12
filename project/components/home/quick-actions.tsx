/**
 * Quick actions component
 * Componente de ações rápidas
 */

'use client'

import Link from 'next/link'
import { ChefHat, List, PiggyBank, Camera } from 'lucide-react'
import { Card } from '@/components/ui/card'

const quickActions = [
  {
    href: '/receitas',
    label: 'Receitas',
    icon: ChefHat,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    href: '/lista',
    label: 'Lista de Compras',
    icon: List,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    href: '/gastos',
    label: 'Controle de Gastos',
    icon: PiggyBank,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    href: '/enviar-nota',
    label: 'Enviar Nota',
    icon: Camera,
    color: 'bg-red-100 text-red-600'
  }
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {quickActions.map((action) => {
        const Icon = action.icon
        
        return (
          <Link key={action.href} href={action.href}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${action.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-900 leading-tight">
                  {action.label}
                </span>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}