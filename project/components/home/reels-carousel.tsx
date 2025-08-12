'use client'

import { useFoodTheme } from '@/lib/useFoodTheme'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Eye, Heart } from 'lucide-react'
import reelsData from '@/data/reels.json'

interface Reel {
  id: string
  title: string
  description: string
  thumbUrl: string
  videoUrl: string
  tags: string[]
  duration: number
  views: number
  likes: number
  startsAt: string
  endsAt: string
}

export function ReelsCarousel() {
  const currentTheme = useFoodTheme()
  
  // Filter reels by current theme
  const filteredReels = reelsData.filter((reel: Reel) => {
    if (!currentTheme.active) return false
    
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()
    const currentDate = `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
    
    // Check if current date is within reel's active period
    const isInPeriod = currentDate >= reel.startsAt && currentDate <= reel.endsAt
    
    // Check if reel tags match theme recipes or title
    const matchesTheme = reel.tags.some(tag => 
      currentTheme.title.toLowerCase().includes(tag.toLowerCase()) ||
      currentTheme.recipes.some(recipeId => {
        // This would ideally check recipe tags, but for simplicity we'll use basic matching
        return tag.toLowerCase().includes('pizza') && currentTheme.title.includes('Pizza') ||
               tag.toLowerCase().includes('feijoada') && currentTheme.title.includes('Ano Novo') ||
               tag.toLowerCase().includes('churrasco') && (currentTheme.title.includes('Pais') || currentTheme.title.includes('Trabalhador')) ||
               tag.toLowerCase().includes('doce') && (currentTheme.title.includes('Crianças') || currentTheme.title.includes('Natal'))
      })
    )
    
    return isInPeriod || matchesTheme
  })

  if (filteredReels.length === 0) return null

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Vídeos em Destaque
        </h2>
        {currentTheme.active && (
          <span 
            className="text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: currentTheme.themeColor }}
          >
            {currentTheme.title}
          </span>
        )}
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filteredReels.map((reel: Reel) => (
          <Card key={reel.id} className="min-w-[200px] overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                {/* Thumbnail */}
                <div className="relative w-full h-32 bg-gray-200">
                  <img 
                    src={reel.thumbUrl} 
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button 
                      size="icon" 
                      className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </Button>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(reel.duration)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                    {reel.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {reel.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViews(reel.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{formatViews(reel.likes)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {reel.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}