/**
 * Tests for QR code ingestion API (Module 1)
 * Testes para API de ingestão de QR codes (Módulo 1)
 */

import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/notes/ingest/route'
import { NextRequest } from 'next/server'

// Mock valid QR URLs
const validQrUrls = [
  'https://www.fazenda.sp.gov.br/nfce/qrcode?p=35200114200166000187650010000000046271741913|2|1|1|A1F2E3D4C5B6',
  'https://nfce.sefaz.ce.gov.br/pages/consultarNFCe.jsf?chNFe=23200114200166000187650010000000046271741913'
]

const invalidQrUrls = [
  'https://example.com/invalid',
  'invalid-url',
  ''
]

describe('QR Code Ingestion API (Module 1)', () => {
  describe('POST /api/notes/ingest', () => {
    it('should process valid QR code successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({ qrString: validQrUrls[0] }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.success).toBe(true)
      expect(result.chave44).toBeDefined()
      expect(result.chave44).toHaveLength(44)
      expect(result.uf).toBeDefined()
      expect(result.totalItems).toBeGreaterThan(0)
      expect(result.totalValue).toBeGreaterThan(0)
      expect(result.items).toBeInstanceOf(Array)
      expect(result.items.length).toBeGreaterThan(0)
    })

    it('should return 400 for missing qrString', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('QR string is required')
    })

    it('should return 400 for invalid QR format', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({ qrString: invalidQrUrls[0] }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Invalid chave44 format')
    })

    it('should categorize items correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({ qrString: validQrUrls[0] }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      
      result.items.forEach((item: any) => {
        expect(item.categoria).toBeDefined()
        expect(typeof item.categoria).toBe('string')
        expect(item.categoria.length).toBeGreaterThan(0)
      })
    })

    it('should calculate totals correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({ qrString: validQrUrls[0] }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      
      // Verify total calculation
      const calculatedTotal = result.items.reduce((sum: number, item: any) => 
        sum + item.precoTotal, 0
      )
      
      expect(Math.abs(result.totalValue - calculatedTotal)).toBeLessThan(0.01)
    })

    it('should handle different QR URL formats', async () => {
      for (const qrUrl of validQrUrls) {
        const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
          method: 'POST',
          body: JSON.stringify({ qrString: qrUrl }),
          headers: { 'Content-Type': 'application/json' }
        })

        const response = await POST(request)
        const result = await response.json()

        expect(response.status).toBe(200)
        expect(result.success).toBe(true)
        expect(result.chave44).toHaveLength(44)
      }
    })

    it('should return proper item structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: JSON.stringify({ qrString: validQrUrls[0] }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      
      result.items.forEach((item: any) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('descricao')
        expect(item).toHaveProperty('quantidade')
        expect(item).toHaveProperty('unidade')
        expect(item).toHaveProperty('precoUnitario')
        expect(item).toHaveProperty('precoTotal')
        expect(item).toHaveProperty('categoria')
        
        expect(typeof item.quantidade).toBe('number')
        expect(typeof item.precoUnitario).toBe('number')
        expect(typeof item.precoTotal).toBe('number')
        expect(item.quantidade).toBeGreaterThan(0)
        expect(item.precoUnitario).toBeGreaterThan(0)
      })
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/notes/ingest', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(500)
    })
  })
})