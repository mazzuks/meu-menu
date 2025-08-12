import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Recipe, ShoppingListItem, Expense } from '@/lib/mock-data'
import { StockItem } from '@/lib/list'

interface AppState {
  // Search state
  searchQuery: string
  selectedCategory: string
  selectedDifficulty: string
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedDifficulty: (difficulty: string) => void

  // Favorites state
  favorites: string[]
  addToFavorites: (recipeId: string) => void
  removeFromFavorites: (recipeId: string) => void
  isFavorite: (recipeId: string) => boolean

  // Shopping list state
  shoppingList: ShoppingListItem[]
  addToShoppingList: (item: Omit<ShoppingListItem, 'id'>) => void
  removeFromShoppingList: (id: string) => void
  togglePurchased: (id: string) => void
  clearShoppingList: () => void
  addRecipeToShoppingList: (recipe: Recipe) => void

  // Meal planning state
  mealPlan: { [date: string]: { [meal: string]: string } }
  addToMealPlan: (date: string, meal: string, recipeId: string) => void
  removeFromMealPlan: (date: string, meal: string) => void

  // Expenses state
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  removeExpense: (id: string) => void
  
  // Budget state
  monthlyBudget: number
  setMonthlyBudget: (budget: number) => void
  
  // Computed values
  getCurrentMonthExpenses: () => number
  getBudgetAlert: () => { show: boolean; message: string } | null
  
  // Stock state
  stock: StockItem[]
  addMany: (items: StockItem[]) => void
  clear: () => void
  applyRecipe: (recipe: Recipe) => { debited: number }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Search state
      searchQuery: '',
      selectedCategory: '',
      selectedDifficulty: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

      // Favorites state
      favorites: [],
      addToFavorites: (recipeId) => set((state) => ({
        favorites: [...state.favorites, recipeId]
      })),
      removeFromFavorites: (recipeId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== recipeId)
      })),
      isFavorite: (recipeId) => get().favorites.includes(recipeId),

      // Shopping list state
      shoppingList: [],
      addToShoppingList: (item) => set((state) => ({
        shoppingList: [...state.shoppingList, { ...item, id: Date.now().toString() }]
      })),
      removeFromShoppingList: (id) => set((state) => ({
        shoppingList: state.shoppingList.filter(item => item.id !== id)
      })),
      togglePurchased: (id) => set((state) => ({
        shoppingList: state.shoppingList.map(item =>
          item.id === id ? { ...item, purchased: !item.purchased } : item
        )
      })),
      clearShoppingList: () => set({ shoppingList: [] }),
      addRecipeToShoppingList: (recipe) => set((state) => {
        const newItems = recipe.ingredients.map(ingredient => ({
          id: `${recipe.id}-${ingredient.id}-${Date.now()}`,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          category: 'Diversos',
          purchased: false,
          recipeId: recipe.id
        }))
        return { shoppingList: [...state.shoppingList, ...newItems] }
      }),

      // Meal planning state
      mealPlan: {},
      addToMealPlan: (date, meal, recipeId) => set((state) => ({
        mealPlan: {
          ...state.mealPlan,
          [date]: {
            ...state.mealPlan[date],
            [meal]: recipeId
          }
        }
      })),
      removeFromMealPlan: (date, meal) => set((state) => {
        const newMealPlan = { ...state.mealPlan }
        if (newMealPlan[date]) {
          delete newMealPlan[date][meal]
          if (Object.keys(newMealPlan[date]).length === 0) {
            delete newMealPlan[date]
          }
        }
        return { mealPlan: newMealPlan }
      }),

      // Expenses state
      expenses: [],
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: Date.now().toString() }]
      })),
      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(expense => expense.id !== id)
      })),
      
      // Budget state
      monthlyBudget: 0,
      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),
      
      // Computed values
      getCurrentMonthExpenses: () => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        return get().expenses
          .filter(expense => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear
          })
          .reduce((total, expense) => total + expense.amount, 0)
      },
      
      getBudgetAlert: () => {
        const budget = get().monthlyBudget
        if (budget <= 0) return null
        
        const spent = get().getCurrentMonthExpenses()
        const percentage = (spent / budget) * 100
        
        if (percentage >= 80) {
          const remaining = budget - spent
          return {
            show: true,
            message: remaining > 0 
              ? `Se liga: faltam R$ ${remaining.toFixed(2)} pra estourar sua meta`
              : `Meta estourada! Você gastou R$ ${Math.abs(remaining).toFixed(2)} a mais`
          }
        }
        
        return null
      },
      
      // Stock actions
      stock: [],
      addMany: (items) => set((state) => ({
        stock: [...state.stock, ...items]
      })),
      clear: () => set({ stock: [] }),
      applyRecipe: (recipe) => {
        let debited = 0
        
        set((state) => {
          const updatedStock = [...state.stock]
          
          recipe.ingredients.forEach(ingredient => {
            const normalizedIngredient = ingredient.name
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\d+/g, '')
              .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
              .replace(/\s+/g, ' ')
              .trim()
            
            const quantity = parseFloat(ingredient.amount) || 1
            
            const stockIndex = updatedStock.findIndex(stockItem => {
              const normalizedStock = stockItem.desc
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\d+/g, '')
                .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
                .replace(/\s+/g, ' ')
                .trim()
              
              return normalizedStock.includes(normalizedIngredient) || 
                     normalizedIngredient.includes(normalizedStock)
            })
            
            if (stockIndex !== -1) {
              const stockItem = updatedStock[stockIndex]
              const newQuantity = Math.max(0, stockItem.qtd - quantity)
              debited++
              
              if (newQuantity === 0) {
                updatedStock.splice(stockIndex, 1)
              } else {
                updatedStock[stockIndex] = {
                  ...stockItem,
                  qtd: newQuantity,
                  precoTotal: stockItem.preco ? newQuantity * stockItem.preco : undefined
                }
              }
            }
          })
          
          return { stock: updatedStock }
        })
        
        return { debited }
      }
    }),
    {
      name: 'meu-menu-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        shoppingList: state.shoppingList,
        mealPlan: state.mealPlan,
        expenses: state.expenses,
        stock: state.stock,
        monthlyBudget: state.monthlyBudget
      })
    }
  )
)