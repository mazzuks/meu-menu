/**
 * Header component with search
 * Componente de cabeçalho com busca
 */

'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'

interface HeaderProps {
  showSearch?: boolean
  title?: string
}

export function Header({ showSearch = true, title }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useAppStore()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 safe-area-pt">
      <div className="max-w-md mx-auto">
        {title ? (
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        ) : (
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Meu Menu</h1>
        )}
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar receitas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        )}
      </div>
    </header>
  )
}