/**
 * Expenses page with charts and budget alerts
 * Página de controle de gastos com gráficos e alertas de orçamento
 */

'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { mockExpenses } from '@/lib/mock-data'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const categories = [
  'Alimentação',
  'Padaria', 
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Limpeza',
  'Outros'
]

export default function ExpensesPage() {
  const { 
    expenses, 
    addExpense, 
    removeExpense, 
    monthlyBudget, 
    setMonthlyBudget,
    getCurrentMonthExpenses,
    getBudgetAlert
  } = useAppStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString())
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Alimentação',
    date: new Date().toISOString().split('T')[0]
  })

  // Use mock data if no expenses
  const displayExpenses = expenses.length > 0 ? expenses : mockExpenses
  const currentMonthExpenses = getCurrentMonthExpenses()
  const budgetAlert = getBudgetAlert()

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return
    
    addExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    })
    
    setNewExpense({
      description: '',
      amount: '',
      category: 'Alimentação',
      date: new Date().toISOString().split('T')[0]
    })
    setShowAddForm(false)
  }

  const handleSetBudget = () => {
    const budget = parseFloat(budgetInput)
    if (budget > 0) {
      setMonthlyBudget(budget)
    }
  }

  // Calculate category totals
  const categoryTotals = displayExpenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    return totals
  }, {} as Record<string, number>)

  // Generate last 6 months data (mock)
  const last6MonthsData = useMemo(() => {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
      
      // Mock data for previous months
      const amount = i === 0 ? currentMonthExpenses : Math.random() * 800 + 200
      
      months.push({
        month: monthName,
        amount: Math.round(amount * 100) / 100
      })
    }
    
    return months
  }, [currentMonthExpenses])

  // Pie chart data
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#3b82f6',
          '#8b5cf6',
          '#6b7280'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  // Bar chart data
  const barData = {
    labels: last6MonthsData.map(item => item.month),
    datasets: [
      {
        label: 'Gastos (R$)',
        data: last6MonthsData.map(item => item.amount),
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toFixed(0)
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Controle de Gastos" showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Budget alert */}
          {budgetAlert?.show && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <p className="text-sm text-orange-800 font-medium leading-tight">
                    {budgetAlert.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Budget input */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Meta do mês (R$)"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSetBudget}
                  style={{ minHeight: '44px' }}
                  aria-label="Definir meta mensal"
                >
                  Definir
                </Button>
              </div>
              {monthlyBudget > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Meta atual: R$ {monthlyBudget.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Este Mês</p>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {currentMonthExpenses.toFixed(2)}
                    </p>
                    {monthlyBudget > 0 && (
                      <p className="text-xs text-gray-500">
                        {((currentMonthExpenses / monthlyBudget) * 100).toFixed(0)}% da meta
                      </p>
                    )}
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total Geral</p>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {displayExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add expense button */}
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full mb-6"
            style={{ minHeight: '44px' }}
            aria-label="Adicionar novo gasto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Gasto
          </Button>

          {/* Add expense form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Novo Gasto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Descrição (ex: Supermercado ABC)"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                />
                
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor (ex: 127.50)"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                />
                
                <select 
                  className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddExpense} 
                    className="flex-1"
                    style={{ minHeight: '44px' }}
                    aria-label="Salvar gasto"
                  >
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                    style={{ minHeight: '44px' }}
                    aria-label="Cancelar adição de gasto"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          {Object.keys(categoryTotals).length > 0 && (
            <>
              {/* Pie chart - Categories */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Bar chart - Last 6 months */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Últimos 6 Meses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={barData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Recent expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gastos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{expense.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{expense.category}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          R$ {expense.amount.toFixed(2)}
                        </span>
                        {expenses.some(e => e.id === expense.id) && (
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            style={{ minHeight: '44px', minWidth: '44px' }}
                            aria-label={`Remover gasto ${expense.description}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}