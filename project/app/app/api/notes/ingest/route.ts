/**
 * API route for ingesting NFC-e/CF-e QR codes
 * Rota da API para ingestão de QR codes de NFC-e/CF-e
 */

import { NextRequest, NextResponse } from 'next/server'
import { parseQrUrl, isChaveValida, generateMockItems } from '@/lib/nfceSat'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrString } = body
    
    if (!qrString || typeof qrString !== 'string') {
      return NextResponse.json(
        { error: 'QR string is required' },
        { status: 400 }
      )
    }
    
    // Parse QR URL
    const { chave44, uf } = parseQrUrl(qrString)
    
    // Validate chave
    if (!isChaveValida(chave44)) {
      return NextResponse.json(
        { error: 'Invalid chave44 format' },
        { status: 400 }
      )
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock items
    const items = generateMockItems()
    
    // Calculate totals
    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + (item.qtd * item.preco), 0)
    
    // Return processed data
    return NextResponse.json({
      success: true,
      chave44,
      uf,
      totalItems,
      totalValue: Math.round(totalValue * 100) / 100,
      items: items.map((item, index) => ({
        id: `item-${index + 1}`,
        descricao: item.descricao,
        quantidade: item.qtd,
        unidade: item.un,
        precoUnitario: item.preco,
        precoTotal: Math.round(item.qtd * item.preco * 100) / 100,
        categoria: inferirCategoria(item.descricao)
      })),
      processedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error processing QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Infer item category from description
 * Infere categoria do item pela descrição
 */
function inferirCategoria(descricao: string): string {
  const desc = descricao.toLowerCase()
  
  if (desc.includes('arroz') || desc.includes('feijão') || desc.includes('macarrão') || desc.includes('açúcar') || desc.includes('sal')) {
    return 'Mercearia'
  }
  if (desc.includes('leite') || desc.includes('queijo') || desc.includes('iogurte') || desc.includes('manteiga')) {
    return 'Laticínios'
  }
  if (desc.includes('banana') || desc.includes('maçã') || desc.includes('tomate') || desc.includes('cebola') || desc.includes('batata')) {
    return 'Hortifruti'
  }
  if (desc.includes('carne') || desc.includes('frango') || desc.includes('peixe') || desc.includes('linguiça')) {
    return 'Açougue'
  }
  if (desc.includes('pão') || desc.includes('bolo') || desc.includes('biscoito')) {
    return 'Padaria'
  }
  if (desc.includes('detergente') || desc.includes('sabão') || desc.includes('amaciante')) {
    return 'Limpeza'
  }
  
  return 'Outros'
}