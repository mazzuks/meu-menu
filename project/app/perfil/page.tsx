/**
 * Profile page
 * Página de perfil
 */

'use client'

import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Settings, Heart, ChefHat, List, PiggyBank, HelpCircle, LogOut } from 'lucide-react'

const menuItems = [
  {
    icon: Heart,
    label: 'Receitas Favoritas',
    description: 'Suas receitas salvas',
    href: '/favoritas'
  },
  {
    icon: ChefHat,
    label: 'Minhas Receitas',
    description: 'Receitas que você criou',
    href: '/minhas-receitas'
  },
  {
    icon: List,
    label: 'Histórico de Listas',
    description: 'Listas de compras anteriores',
    href: '/historico-listas'
  },
  {
    icon: PiggyBank,
    label: 'Relatório de Gastos',
    description: 'Análise detalhada dos seus gastos',
    href: '/relatorio-gastos'
  },
  {
    icon: Settings,
    label: 'Configurações',
    description: 'Preferências e notificações',
    href: '/configuracoes'
  },
  {
    icon: HelpCircle,
    label: 'Ajuda e Suporte',
    description: 'Dúvidas e contato',
    href: '/ajuda'
  }
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Meu Perfil" showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Profile header / Cabeçalho do perfil */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Usuário Meu Menu
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                usuario@meumenu.com
              </p>
              <Button variant="outline" size="sm">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Stats cards / Cards de estatísticas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">12</div>
                <div className="text-xs text-gray-600">Receitas Favoritas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">8</div>
                <div className="text-xs text-gray-600">Listas Criadas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">R$ 450</div>
                <div className="text-xs text-gray-600">Economizado</div>
              </CardContent>
            </Card>
          </div>

          {/* Menu items / Itens do menu */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              
              return (
                <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Logout button / Botão de logout */}
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  )
}