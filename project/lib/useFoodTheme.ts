import { useState, useEffect } from 'react'
import foodCalendar from '@/data/food-calendar.json'

interface FoodTheme {
  active: boolean
  title: string
  recipes: string[]
  themeColor?: string
}

export function useFoodTheme(today = new Date()): FoodTheme {
  const [theme, setTheme] = useState<FoodTheme>({ active: false, title: '', recipes: [] })

  useEffect(() => {
    const month = today.getMonth() + 1
    const day = today.getDate()
    const currentDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    // Find exact match first
    let foundTheme = foodCalendar.find(item => item.date === currentDate)
    
    // If no exact match, look for themes within ±3 days
    if (!foundTheme) {
      const currentDateObj = new Date(today.getFullYear(), month - 1, day)
      
      foundTheme = foodCalendar.find(item => {
        const [themeMonth, themeDay] = item.date.split('-').map(Number)
        const themeDate = new Date(today.getFullYear(), themeMonth - 1, themeDay)
        
        const diffInDays = Math.abs((currentDateObj.getTime() - themeDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffInDays <= 3
      })
    }
    
    if (foundTheme) {
      setTheme({
        active: true,
        title: foundTheme.title,
        recipes: foundTheme.recipes,
        themeColor: foundTheme.themeColor
      })
    } else {
      setTheme({ active: false, title: '', recipes: [] })
    }
  }, [today])

  return theme
}