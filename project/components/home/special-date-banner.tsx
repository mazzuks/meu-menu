'use client'

import { useFoodTheme } from '@/lib/useFoodTheme'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Calendar } from 'lucide-react'
import { getRecipesByIds } from '@/lib/mock-data'

export function SpecialDateBanner() {
  const currentTheme = useFoodTheme()

  if (!currentTheme.active) return null

  const themeRecipes = getRecipesByIds(currentTheme.recipes)
  const featuredRecipe = themeRecipes[0]

  return (
    <Card 
      className="mb-6 overflow-hidden border-0 shadow-lg"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.themeColor}20, ${currentTheme.themeColor}10)`,
        borderLeft: `4px solid ${currentTheme.themeColor}`
      }}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Background image */}
          {featuredRecipe && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${featuredRecipe.image})` }}
            />
          )}
          
          <div className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: currentTheme.themeColor }} />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Hoje é dia de
                  </span>
                </div>
                
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: currentTheme.themeColor }}
                >
                  {currentTheme.title}
                </h2>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {featuredRecipe?.description || 'Receitas especiais para esta data!'}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-white text-gray-900 hover:bg-gray-50 border shadow-sm"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Ver Vídeo
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/50 text-gray-700 hover:bg-white/10"
                  >
                    Ver Receitas
                  </Button>
                </div>
              </div>
              
              {/* Featured recipe thumbnail */}
              {featuredRecipe && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}