/**
 * Tests for budget functionality (Module 5)
 * Testes para funcionalidade de orçamento (Módulo 5)
 */

import { describe, it, expect, beforeEach } from 'vitest'

// Mock store functionality for testing
interface MockExpense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

// Mock implementation of budget calculations
function getCurrentMonthExpenses(expenses: MockExpense[], targetDate = new Date()): number {
  const currentMonth = targetDate.getMonth()
  const currentYear = targetDate.getFullYear()
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear
    })
    .reduce((total, expense) => total + expense.amount, 0)
}

function getBudgetAlert(monthlyBudget: number, currentExpenses: number): { show: boolean; message: string } | null {
  if (monthlyBudget <= 0) return null
  
  const percentage = (currentExpenses / monthlyBudget) * 100
  
  if (percentage >= 80) {
    const remaining = monthlyBudget - currentExpenses
    return {
      show: true,
      message: remaining > 0 
        ? `Se liga: faltam R$ ${remaining.toFixed(2)} pra estourar sua meta`
        : `Meta estourada! Você gastou R$ ${Math.abs(remaining).toFixed(2)} a mais`
    }
  }
  
  return null
}

function calculateBudgetPercentage(spent: number, budget: number): number {
  if (budget <= 0) return 0
  return (spent / budget) * 100
}

describe('Budget Functionality (Module 5)', () => {
  let mockExpenses: MockExpense[]

  beforeEach(() => {
    mockExpenses = [
      { id: '1', description: 'Supermercado ABC', amount: 127.50, category: 'Alimentação', date: '2025-01-02' },
      { id: '2', description: 'Padaria do João', amount: 15.80, category: 'Padaria', date: '2025-01-02' },
      { id: '3', description: 'Feira livre', amount: 45.20, category: 'Hortifruti', date: '2025-01-01' },
      { id: '4', description: 'Açougue Central', amount: 89.90, category: 'Carnes', date: '2024-12-30' }, // Previous month
      { id: '5', description: 'Mercado XYZ', amount: 203.45, category: 'Alimentação', date: '2024-12-28' } // Previous month
    ]
  })

  describe('getCurrentMonthExpenses', () => {
    it('should calculate current month expenses correctly', () => {
      const testDate = new Date(2025, 0, 15) // January 15, 2025
      const currentMonth = getCurrentMonthExpenses(mockExpenses, testDate)
      
      // Should include only January 2025 expenses: 127.50 + 15.80 + 45.20 = 188.50
      expect(currentMonth).toBe(188.50)
    })

    it('should return 0 for month with no expenses', () => {
      const futureDate = new Date(2025, 5, 15) // June 2025
      const currentMonth = getCurrentMonthExpenses(mockExpenses, futureDate)
      
      expect(currentMonth).toBe(0)
    })

    it('should handle empty expenses array', () => {
      const currentMonth = getCurrentMonthExpenses([])
      expect(currentMonth).toBe(0)
    })

    it('should handle year boundaries correctly', () => {
      const december2024 = new Date(2024, 11, 15) // December 2024
      const currentMonth = getCurrentMonthExpenses(mockExpenses, december2024)
      
      // Should include only December 2024 expenses: 89.90 + 203.45 = 293.35
      expect(currentMonth).toBe(293.35)
    })
  })

  describe('getBudgetAlert', () => {
    it('should return null when no budget is set', () => {
      const alert = getBudgetAlert(0, 100)
      expect(alert).toBeNull()
    })

    it('should return null when under 80% of budget', () => {
      const alert = getBudgetAlert(1000, 700) // 70%
      expect(alert).toBeNull()
    })

    it('should show alert at exactly 80% of budget', () => {
      const alert = getBudgetAlert(1000, 800) // 80%
      
      expect(alert).toBeDefined()
      expect(alert!.show).toBe(true)
      expect(alert!.message).toContain('faltam R$ 200.00 pra estourar sua meta')
    })

    it('should show alert when over 80% but under budget', () => {
      const alert = getBudgetAlert(1000, 900) // 90%
      
      expect(alert).toBeDefined()
      expect(alert!.show).toBe(true)
      expect(alert!.message).toContain('faltam R$ 100.00 pra estourar sua meta')
    })

    it('should show different message when budget is exceeded', () => {
      const alert = getBudgetAlert(1000, 1200) // 120%
      
      expect(alert).toBeDefined()
      expect(alert!.show).toBe(true)
      expect(alert!.message).toContain('gastou R$ 200.00 a mais')
    })

    it('should handle decimal values correctly', () => {
      const alert = getBudgetAlert(100.50, 80.75) // ~80.35%
      
      expect(alert).toBeDefined()
      expect(alert!.show).toBe(true)
      expect(alert!.message).toContain('faltam R$ 19.75 pra estourar sua meta')
    })
  })

  describe('calculateBudgetPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateBudgetPercentage(250, 1000)).toBe(25)
      expect(calculateBudgetPercentage(800, 1000)).toBe(80)
      expect(calculateBudgetPercentage(1200, 1000)).toBe(120)
    })

    it('should return 0 when budget is 0', () => {
      expect(calculateBudgetPercentage(100, 0)).toBe(0)
    })

    it('should handle decimal values', () => {
      expect(calculateBudgetPercentage(33.33, 100)).toBeCloseTo(33.33, 2)
    })
  })

  describe('Budget Integration', () => {
    it('should trigger alert workflow correctly', () => {
      const testDate = new Date(2025, 0, 15) // January 15, 2025
      const currentMonth = getCurrentMonthExpenses(mockExpenses, testDate) // 188.50
      const budget = 200 // Set budget to 200
      
      const percentage = calculateBudgetPercentage(currentMonth, budget) // 94.25%
      expect(percentage).toBeGreaterThan(80)
      
      const alert = getBudgetAlert(budget, currentMonth)
      expect(alert).toBeDefined()
      expect(alert!.show).toBe(true)
      expect(alert!.message).toContain('Se liga: faltam R$ 11.50 pra estourar sua meta')
    })

    it('should handle multiple categories in current month', () => {
      const testDate = new Date(2025, 0, 15)
      const currentMonth = getCurrentMonthExpenses(mockExpenses, testDate)
      
      // Verify that different categories are included
      const januaryExpenses = mockExpenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === 0 && expenseDate.getFullYear() === 2025
      })
      
      const categories = [...new Set(januaryExpenses.map(e => e.category))]
      expect(categories.length).toBeGreaterThan(1) // Multiple categories
      expect(currentMonth).toBe(188.50) // Total across categories
    })

    it('should exclude previous month expenses from current calculation', () => {
      const testDate = new Date(2025, 0, 15)
      const currentMonth = getCurrentMonthExpenses(mockExpenses, testDate)
      
      // Should not include December 2024 expenses (89.90 + 203.45 = 293.35)
      expect(currentMonth).not.toBe(293.35)
      expect(currentMonth).toBe(188.50) // Only January expenses
    })
  })
})