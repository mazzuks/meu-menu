/**
 * API routes for individual promotion operations
 * Rotas da API para operações de promoção individual
 */

import { NextRequest, NextResponse } from 'next/server'
import { PromotionSchema } from '@/lib/types'
import { 
  inMemoryPromotions,
  updatePromotion, 
  deletePromotion,
  getBusinessAccountById
} from '@/lib/mock-promotions'

// GET /api/promotions/[id] - Get single promotion
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotion = inMemoryPromotions.find(p => p.id === params.id)
    
    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: promotion
    })
    
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotion' },
      { status: 500 }
    )
  }
}

// PUT /api/promotions/[id] - Update promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate promotion data
    const validationResult = PromotionSchema.omit({ 
      id: true, 
      createdAt: true, 
      updatedAt: true,
      viewCount: true,
      clickCount: true 
    }).partial().safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    // Update business name if businessAccountId changed
    let updateData = validationResult.data
    if (body.businessAccountId) {
      const businessAccount = getBusinessAccountById(body.businessAccountId)
      if (businessAccount) {
        updateData = {
          ...updateData,
          businessName: businessAccount.name
        }
      }
    }
    
    const updatedPromotion = updatePromotion(params.id, updateData)
    
    if (!updatedPromotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedPromotion
    })
    
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    )
  }
}

// DELETE /api/promotions/[id] - Delete promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deletePromotion(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}