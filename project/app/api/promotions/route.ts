/**
 * API routes for promotions CRUD
 * Rotas da API para CRUD de promoções
 */

import { NextRequest, NextResponse } from 'next/server'
import { PromotionSchema } from '@/lib/types'
import { 
  getAllPromotions, 
  addPromotion, 
  getPromotionsByRegion,
  getBusinessAccountById
} from '@/lib/mock-promotions'

// GET /api/promotions - List promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'SP'
    const all = searchParams.get('all') === 'true'
    
    let promotions
    
    if (all) {
      promotions = getAllPromotions()
    } else {
      promotions = getPromotionsByRegion(region)
    }
    
    return NextResponse.json({
      success: true,
      data: promotions,
      total: promotions.length
    })
    
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

// POST /api/promotions - Create promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate promotion data
    const validationResult = PromotionSchema.omit({ 
      id: true, 
      createdAt: true, 
      updatedAt: true,
      viewCount: true,
      clickCount: true 
    }).safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    // Check if business account exists
    const businessAccount = getBusinessAccountById(body.businessAccountId)
    if (!businessAccount) {
      return NextResponse.json(
        { error: 'Business account not found' },
        { status: 404 }
      )
    }
    
    // Add business name to promotion
    const promotionData = {
      ...validationResult.data,
      businessName: businessAccount.name
    }
    
    const newPromotion = addPromotion(promotionData)
    
    return NextResponse.json({
      success: true,
      data: newPromotion
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}