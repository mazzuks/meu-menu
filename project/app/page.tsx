'use client'

import { Header } from '@/components/layout/header'
import { QuickActions } from '@/components/home/quick-actions'
import { RecipeCarousel } from '@/components/home/recipe-carousel'
import { SpecialDateBanner } from '@/components/home/special-date-banner'
import { PromotionsCarousel } from '@/components/home/promotions-carousel'
import { ReelsCarousel } from '@/components/home/reels-carousel'
import { mockRecipes } from '@/lib/mock-data'
import BottomNav from '@/components/layout/bottom-nav'

export default function HomePage() {
  const italianRecipes = mockRecipes.filter(r => r.category === 'Italiana').slice(0, 6)
  const brazilianRecipes = mockRecipes.filter(r => r.category === 'Brasileira').slice(0, 6)
  const dessertRecipes = mockRecipes.filter(r => r.category === 'Doces').slice(0, 6)
  const quickRecipes = mockRecipes.filter(r => r.prepTime <= 30).slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-24">
        <SpecialDateBanner />
        <QuickActions />

        <section className="mt-4 space-y-5">
          <div>
            <h2 className="px-4 text-lg font-semibold mb-2">Rápidas</h2>
            <RecipeCarousel recipes={quickRecipes} />
          </div>

          <div>
            <h2 className="px-4 text-lg font-semibold mb-2">Italiana</h2>
            <RecipeCarousel recipes={italianRecipes} />
          </div>

          <div>
            <h2 className="px-4 text-lg font-semibold mb-2">Brasileira</h2>
            <RecipeCarousel recipes={brazilianRecipes} />
          </div>

          <div>
            <h2 className="px-4 text-lg font-semibold mb-2">Doces</h2>
            <RecipeCarousel recipes={dessertRecipes} />
          </div>

          <PromotionsCarousel />
          <ReelsCarousel />
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
