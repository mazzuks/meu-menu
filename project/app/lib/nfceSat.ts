/**
 * Utilities for NFC-e/CF-e QR code processing
 * Utilitários para processamento de QR codes de NFC-e/CF-e
 */

/**
 * Parse QR URL to extract chave44 and UF
 * Extrai chave de 44 dígitos e UF da URL do QR code
 */
export function parseQrUrl(url: string): { chave44: string; uf: string } {
  try {
    // QR format: https://www.fazenda.sp.gov.br/nfce/qrcode?p=35200114200166000187650010000000046271741913|2|1|1|A1F2E3D4C5B6...
    // Or: https://nfce.sefaz.ce.gov.br/pages/consultarNFCe.jsf?chNFe=23200114200166000187650010000000046271741913
    
    const urlObj = new URL(url)
    let chave44 = ''
    let uf = ''
    
    // Extract UF from domain
    const domain = urlObj.hostname.toLowerCase()
    // Mapear domínio -> UF para todos os estados brasileiros
    if (domain.includes('.ac.gov.br')) uf = 'AC' // Acre
    else if (domain.includes('.al.gov.br')) uf = 'AL' // Alagoas
    else if (domain.includes('.am.gov.br')) uf = 'AM' // Amazonas
    else if (domain.includes('.ap.gov.br')) uf = 'AP' // Amapá
    else if (domain.includes('.ba.gov.br')) uf = 'BA' // Bahia
    else if (domain.includes('.ce.gov.br')) uf = 'CE' // Ceará
    else if (domain.includes('.df.gov.br')) uf = 'DF' // Distrito Federal
    else if (domain.includes('.es.gov.br')) uf = 'ES' // Espírito Santo
    else if (domain.includes('.go.gov.br')) uf = 'GO' // Goiás
    else if (domain.includes('.ma.gov.br')) uf = 'MA' // Maranhão
    else if (domain.includes('.mg.gov.br')) uf = 'MG' // Minas Gerais
    else if (domain.includes('.ms.gov.br')) uf = 'MS' // Mato Grosso do Sul
    else if (domain.includes('.mt.gov.br')) uf = 'MT' // Mato Grosso
    else if (domain.includes('.pa.gov.br')) uf = 'PA' // Pará
    else if (domain.includes('.pb.gov.br')) uf = 'PB' // Paraíba
    else if (domain.includes('.pe.gov.br')) uf = 'PE' // Pernambuco
    else if (domain.includes('.pi.gov.br')) uf = 'PI' // Piauí
    else if (domain.includes('.pr.gov.br')) uf = 'PR' // Paraná
    else if (domain.includes('.rj.gov.br')) uf = 'RJ' // Rio de Janeiro
    else if (domain.includes('.rn.gov.br')) uf = 'RN' // Rio Grande do Norte
    else if (domain.includes('.ro.gov.br')) uf = 'RO' // Rondônia
    else if (domain.includes('.rr.gov.br')) uf = 'RR' // Roraima
    else if (domain.includes('.rs.gov.br')) uf = 'RS' // Rio Grande do Sul
    else if (domain.includes('.sc.gov.br')) uf = 'SC' // Santa Catarina
    else if (domain.includes('.se.gov.br')) uf = 'SE' // Sergipe
    else if (domain.includes('.sp.gov.br')) uf = 'SP' // São Paulo
    else if (domain.includes('.to.gov.br')) uf = 'TO' // Tocantins
    else uf = 'SP' // Default fallback
    
    // Try to extract chave44 from different URL patterns
    const searchParams = urlObj.searchParams
    
    // Pattern 1: chNFe parameter
    const chNFe = searchParams.get('chNFe')
    if (chNFe && chNFe.length === 44) {
      chave44 = chNFe
    }
    
    // Pattern 2: p parameter (pipe-separated)
    const pParam = searchParams.get('p')
    if (pParam && !chave44) {
      const parts = pParam.split('|')
      if (parts[0] && parts[0].length === 44) {
        chave44 = parts[0]
      }
    }
    
    // Pattern 3: Extract from URL path
    if (!chave44) {
      const pathMatch = url.match(/(\d{44})/)
      if (pathMatch) {
        chave44 = pathMatch[1]
      }
    }
    
    return { chave44, uf }
  } catch (error) {
    console.error('Error parsing QR URL:', error)
    throw error
  }
}

/**
 * Validate chave44 format and check digit
 * Valida formato da chave de 44 dígitos e dígito verificador
 */
export function isChaveValida(chave: string): boolean {
  if (!chave || chave.length !== 44) {
    return false
  }
  
  // Check if all characters are digits
  if (!/^\d{44}$/.test(chave)) {
    return false
  }
  
  // Basic validation: check UF code (first 2 digits)
  const ufCode = chave.substring(0, 2)
  const validUfCodes = [
    '11', '12', '13', '14', '15', '16', '17', // North
    '21', '22', '23', '24', '25', '26', '27', '28', '29', // Northeast
    '31', '32', '33', '35', // Southeast
    '41', '42', '43', // South
    '50', '51', '52', '53' // Center-West
  ]
  
  if (!validUfCodes.includes(ufCode)) {
    return false
  }
  
  // For demo purposes, we'll consider it valid if format is correct
  // In production, you'd implement the full DV algorithm
  return true
}

/**
 * Infer UF from chave44
 * Infere UF a partir da chave de 44 dígitos
 */
export function inferUf(chave: string): string {
  if (!chave || chave.length < 2) {
    return 'SP' // Default fallback
  }
  
  const ufCode = chave.substring(0, 2)
  
  const ufMap: Record<string, string> = {
    // North
    '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
    // Northeast
    '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA',
    // Southeast
    '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
    // South
    '41': 'PR', '42': 'SC', '43': 'RS',
    // Center-West
    '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF'
  }
  
  return ufMap[ufCode] || 'SP'
}

/**
 * Generate mock items for demo purposes
 * Gera itens mockados para demonstração
 */
export function generateMockItems() {
  const mockItems = [
    { descricao: 'Arroz Branco 5kg', qtd: 1, un: 'PC', preco: 18.90 },
    { descricao: 'Feijão Carioca 1kg', qtd: 2, un: 'PC', preco: 7.50 },
    { descricao: 'Óleo de Soja 900ml', qtd: 1, un: 'UN', preco: 4.80 },
    { descricao: 'Açúcar Cristal 1kg', qtd: 1, un: 'PC', preco: 3.20 },
    { descricao: 'Sal Refinado 1kg', qtd: 1, un: 'PC', preco: 2.10 },
    { descricao: 'Macarrão Espaguete 500g', qtd: 3, un: 'PC', preco: 2.90 },
    { descricao: 'Molho de Tomate 340g', qtd: 2, un: 'UN', preco: 1.80 },
    { descricao: 'Leite Integral 1L', qtd: 2, un: 'UN', preco: 4.50 },
    { descricao: 'Ovos Brancos Dúzia', qtd: 1, un: 'DZ', preco: 8.90 },
    { descricao: 'Pão de Forma Integral', qtd: 1, un: 'PC', preco: 5.20 },
    { descricao: 'Banana Prata', qtd: 1.5, un: 'KG', preco: 4.80 },
    { descricao: 'Tomate Salada', qtd: 0.8, un: 'KG', preco: 6.90 }
  ]
  
  // Return random subset of items
  const numItems = Math.floor(Math.random() * 8) + 5 // 5-12 items
  const shuffled = mockItems.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, numItems)
}