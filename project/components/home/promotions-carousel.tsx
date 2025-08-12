/**
 * Promotions carousel component
 * Componente de carrossel de promoções
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, Calendar, Tag, TrendingUp } from 'lucide-react'
import { MockPromotion } from '@/lib/types'

export function PromotionsCarousel() {
  const [promotions, setPromotions] = useState<MockPromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [userRegion] = useState('SP') // Mock geolocation

  useEffect(() => {
    fetchPromotions()
  }, [userRegion])

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`/api/promotions?region=${userRegion}`)
      const result = await response.json()
      
      if (result.success) {
        setPromotions(result.data.slice(0, 6)) // Limit to 6 promotions
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromotionClick = async (promotion: MockPromotion) => {
    // Track click (in real app would call API)
    console.log('Promotion clicked:', promotion.id)
    
    // Open promotion link
    window.open(promotion.link, '_blank')
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getPromotionTypeLabel = (type: string): string => {
    const labels = {
      discount: 'Desconto',
      bundle: 'Kit/Combo',
      special_offer: 'Oferta Especial',
      sweepstakes: 'Sorteio'
    }
    return labels[type as keyof typeof labels] || type
  }

  const isPromotionActive = (promotion: MockPromotion): boolean => {
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
    return promotion.isActive && start <= now && end >= now
  }

  if (loading) {
    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Promoções da sua região</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[280px] h-40 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (promotions.length === 0) return null

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Promoções da sua região
        </h2>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span>{userRegion}</span>
        </div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {promotions.map((promotion) => {
          const isActive = isPromotionActive(promotion)
          
          return (
            <Card 
              key={promotion.id} 
              className={`min-w-[280px] overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                !isActive ? 'opacity-60' : ''
              }`}
              onClick={() => isActive && handlePromotionClick(promotion)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200">
                    <img 
                      src={promotion.imageUrl} 
                      alt={promotion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {promotion.discountPercentage && isActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{promotion.discountPercentage}%
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {getPromotionTypeLabel(promotion.promotionType)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                      {promotion.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {promotion.businessName}
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                    {promotion.description}
                  </p>
                  
                  {promotion.originalPrice && promotion.promotionalPrice && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(promotion.originalPrice)}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {formatPrice(promotion.promotionalPrice)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>até {new Date(promotion.endDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>{promotion.viewCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {promotion.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        <Tag className="w-2 h-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {!isActive && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-red-600 font-medium">
                        Promoção expirada
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="text-center mt-4">
        <Button variant="outline" size="sm" style={{ minHeight: '44px' }}>
          Ver Todas as Promoções
        </Button>
      </div>
    </section>
  )
}