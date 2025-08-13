'use client'

import { Header } from '@/components/layout/header'
import { QuickActions } from '@/components/home/quick-actions'
import { RecipeCarousel } from '@/components/home/recipe-carousel'
import SpecialDateBanner from '@/components/home/special-date-banner' // import corrigido
import { PromotionsCarousel } from '@/components/home/promotions-carousel'
import { ReelsCarousel } from '@/components/home/reels-carousel'
import { mockRecipes } from '@/lib/mock-data'
import BottomNav from '@/components/layout/bottom-nav'

export default function HomePage() {
  // Filtra receitas por categoria para os carrosséis
  const italianRecipes = mockRecipes.filter(recipe => recipe.category === 'Italiana').slice(0, 6)
  const brazilianRecipes = mockRecipes.filter(recipe => recipe.category === 'Brasileira').slice(0, 6)
  const dessertRecipes = mockRecipes.filter(recipe => recipe.category === 'Doces').slice(0, 6)
  const quickRecipes = mockRecipes.filter(recipe => recipe.prepTime <= 30).slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {/* Banner do dia */}
          <SpecialDateBanner />
          
          {/* Ações rápidas */}
          <QuickActions />
          
          {/* Promoções */}
          <PromotionsCarousel />
          
          {/* Reels */}
          <ReelsCarousel />
          
          {/* Carrosséis de receitas */}
          <RecipeCarousel title="Receitas Rápidas" recipes={quickRecipes} />
          <RecipeCarousel title="Culinária Italiana" recipes={italianRecipes} />
          <RecipeCarousel title="Sabores do Brasil" recipes={brazilianRecipes} />
          <RecipeCarousel title="Doces & Sobremesas" recipes={dessertRecipes} />
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
