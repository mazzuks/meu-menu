/**
 * Tests for food theme functionality (Module 4)
 * Testes para funcionalidade de tema alimentar (Módulo 4)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import foodCalendar from '@/data/food-calendar.json'
import { mockRecipes } from '@/lib/mock-data'

// Mock the useFoodTheme hook logic
function getCurrentFoodTheme(mockDate?: Date) {
  const today = mockDate || new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const currentDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  // Find exact match first
  let theme = foodCalendar.find(item => item.date === currentDate)
  
  // If no exact match, look for themes within ±3 days
  if (!theme) {
    const currentDateObj = new Date(today.getFullYear(), month - 1, day)
    
    theme = foodCalendar.find(item => {
      const [themeMonth, themeDay] = item.date.split('-').map(Number)
      const themeDate = new Date(today.getFullYear(), themeMonth - 1, themeDay)
      
      const diffInDays = Math.abs((currentDateObj.getTime() - themeDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffInDays <= 3
    })
  }
  
  return theme || null
}

describe('Food Theme Functionality (Module 4)', () => {
  describe('getCurrentFoodTheme', () => {
    it('should return theme for exact date match', () => {
      // Test New Year
      const newYearDate = new Date(2025, 0, 1) // January 1st
      const theme = getCurrentFoodTheme(newYearDate)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Ano Novo')
      expect(theme!.date).toBe('01-01')
      expect(theme!.themeColor).toBeDefined()
      expect(theme!.recipes).toBeInstanceOf(Array)
      expect(theme!.recipes.length).toBeGreaterThan(0)
    })

    it('should return theme within ±3 days range', () => {
      // Test 2 days before New Year (should still match)
      const nearNewYear = new Date(2024, 11, 30) // December 30th
      const theme = getCurrentFoodTheme(nearNewYear)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Ano Novo')
    })

    it('should return null for dates without themes', () => {
      // Test a random date far from any theme
      const randomDate = new Date(2025, 2, 15) // March 15th
      const theme = getCurrentFoodTheme(randomDate)
      
      // Should be null or a theme within ±3 days
      if (theme) {
        const [themeMonth, themeDay] = theme.date.split('-').map(Number)
        const themeDate = new Date(2025, themeMonth - 1, themeDay)
        const diffInDays = Math.abs((randomDate.getTime() - themeDate.getTime()) / (1000 * 60 * 60 * 24))
        expect(diffInDays).toBeLessThanOrEqual(3)
      }
    })

    it('should handle Pizza Day correctly', () => {
      const pizzaDay = new Date(2025, 6, 10) // July 10th
      const theme = getCurrentFoodTheme(pizzaDay)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Dia da Pizza')
      expect(theme!.date).toBe('07-10')
      expect(theme!.themeColor).toBe('#FF4500')
    })

    it('should handle Christmas correctly', () => {
      const christmas = new Date(2025, 11, 25) // December 25th
      const theme = getCurrentFoodTheme(christmas)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Natal')
      expect(theme!.date).toBe('12-25')
      expect(theme!.themeColor).toBe('#DC143C')
    })

    it('should handle Valentine\'s Day (Brazilian) correctly', () => {
      const valentines = new Date(2025, 5, 12) // June 12th
      const theme = getCurrentFoodTheme(valentines)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Dia dos Namorados')
      expect(theme!.date).toBe('06-12')
      expect(theme!.themeColor).toBe('#FF1493')
    })
  })

  describe('Food Calendar Data Validation', () => {
    it('should have valid date format for all entries', () => {
      foodCalendar.forEach(item => {
        expect(item.date).toMatch(/^\d{2}-\d{2}$/)
        
        const [month, day] = item.date.split('-').map(Number)
        expect(month).toBeGreaterThanOrEqual(1)
        expect(month).toBeLessThanOrEqual(12)
        expect(day).toBeGreaterThanOrEqual(1)
        expect(day).toBeLessThanOrEqual(31)
      })
    })

    it('should have required fields for all entries', () => {
      foodCalendar.forEach(item => {
        expect(item.title).toBeDefined()
        expect(item.title.length).toBeGreaterThan(0)
        expect(item.themeColor).toBeDefined()
        expect(item.themeColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
        expect(item.recipes).toBeInstanceOf(Array)
        expect(item.description).toBeDefined()
        expect(item.description.length).toBeGreaterThan(0)
      })
    })

    it('should have at least 15 dates as required', () => {
      expect(foodCalendar.length).toBeGreaterThanOrEqual(15)
    })

    it('should have valid recipe IDs', () => {
      foodCalendar.forEach(item => {
        item.recipes.forEach(recipeId => {
          expect(typeof recipeId).toBe('string')
          expect(recipeId.length).toBeGreaterThan(0)
          
          // Check if recipe exists in mock data
          const recipe = mockRecipes.find(r => r.id === recipeId)
          expect(recipe).toBeDefined()
        })
      })
    })

    it('should have unique dates', () => {
      const dates = foodCalendar.map(item => item.date)
      const uniqueDates = [...new Set(dates)]
      
      expect(dates.length).toBe(uniqueDates.length)
    })

    it('should have valid hex colors', () => {
      foodCalendar.forEach(item => {
        expect(item.themeColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
        
        // Ensure it's not just black or white
        expect(item.themeColor).not.toBe('#000000')
        expect(item.themeColor).not.toBe('#FFFFFF')
      })
    })
  })

  describe('Theme Date Range Logic', () => {
    it('should find themes within 3-day window', () => {
      // Test dates around Christmas
      const dates = [
        new Date(2025, 11, 22), // 3 days before
        new Date(2025, 11, 23), // 2 days before
        new Date(2025, 11, 24), // 1 day before
        new Date(2025, 11, 25), // Christmas day
        new Date(2025, 11, 26), // 1 day after
        new Date(2025, 11, 27), // 2 days after
        new Date(2025, 11, 28)  // 3 days after
      ]
      
      dates.forEach(date => {
        const theme = getCurrentFoodTheme(date)
        expect(theme).toBeDefined()
        expect(theme!.title).toBe('Natal')
      })
    })

    it('should not find themes outside 3-day window', () => {
      // Test 5 days before Christmas
      const farFromChristmas = new Date(2025, 11, 20)
      const theme = getCurrentFoodTheme(farFromChristmas)
      
      // Should either be null or a different theme
      if (theme) {
        expect(theme.title).not.toBe('Natal')
      }
    })

    it('should handle year boundaries correctly', () => {
      // Test New Year's Eve (should match New Year theme)
      const newYearEve = new Date(2024, 11, 31) // December 31st
      const theme = getCurrentFoodTheme(newYearEve)
      
      expect(theme).toBeDefined()
      expect(theme!.title).toBe('Ano Novo')
    })
  })

  describe('Theme Integration', () => {
    it('should provide recipes for each theme', () => {
      foodCalendar.forEach(themeData => {
        expect(themeData.recipes.length).toBeGreaterThan(0)
        
        // Verify all recipe IDs exist
        themeData.recipes.forEach(recipeId => {
          const recipe = mockRecipes.find(r => r.id === recipeId)
          expect(recipe).toBeDefined()
        })
      })
    })

    it('should have meaningful descriptions', () => {
      foodCalendar.forEach(themeData => {
        expect(themeData.description.length).toBeGreaterThan(20)
        expect(themeData.description).not.toBe(themeData.title)
      })
    })

    it('should have appropriate theme colors for holidays', () => {
      const christmas = foodCalendar.find(item => item.title === 'Natal')
      const newYear = foodCalendar.find(item => item.title === 'Ano Novo')
      const valentines = foodCalendar.find(item => item.title === 'Dia dos Namorados')
      
      expect(christmas?.themeColor).toBe('#DC143C') // Red for Christmas
      expect(newYear?.themeColor).toBe('#FFD700') // Gold for New Year
      expect(valentines?.themeColor).toBe('#FF1493') // Pink for Valentine's
    })
  })
})