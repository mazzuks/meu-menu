/**
 * Send receipt page with QR scanner
 * Página de envio de nota fiscal com scanner QR
 */

'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { QrScannerComponent } from '@/components/qr-scanner'
import { useAppStore } from '@/lib/store'

type ProcessingState = 'idle' | 'scanning' | 'processing' | 'success' | 'error'

interface ProcessedReceipt {
  chave44: string
  uf: string
  totalItems: number
  totalValue: number
  items: Array<{
    id: string
    descricao: string
    quantidade: number
    unidade: string
    precoUnitario: number
    precoTotal: number
    categoria: string
  }>
}

export default function SendReceiptPage() {
  const [state, setState] = useState<ProcessingState>('idle')
  const [processedData, setProcessedData] = useState<ProcessedReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { addMany } = useAppStore()

  const handleQrScan = async (qrString: string) => {
    setState('processing')
    setError(null)

    try {
      const response = await fetch('/api/notes/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrString }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setProcessedData(result)
        setState('success')
        
        // Add items to stock
        const stockItems = result.items.map((item: any) => ({
          id: item.id,
          desc: item.descricao,
          qtd: item.quantidade,
          un: item.unidade,
          preco: item.precoUnitario,
          precoTotal: item.precoTotal,
          categoria: item.categoria
        }))
        
        addMany(stockItems)
      } else {
        setError(result.error || 'Erro ao processar QR code')
        setState('error')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
      setState('error')
    }
  }

  const handleStartScanning = () => {
    setState('scanning')
    setError(null)
  }

  const handleCloseScanner = () => {
    setState('idle')
    setError(null)
  }

  const handleTryAgain = () => {
    setState('idle')
    setError(null)
    setProcessedData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Enviar Nota Fiscal" showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          {state === 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Adicionar Nota Fiscal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center mb-6">
                  Escaneie o QR code da sua nota fiscal para adicionar os itens automaticamente ao seu estoque.
                </p>
                
                <Button 
                  onClick={handleStartScanning}
                  className="w-full"
                  style={{ minHeight: '44px' }}
                  aria-label="Abrir câmera para escanear QR code"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  ABRIR CÂMERA
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Ou faça upload do arquivo XML/PDF
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    style={{ minHeight: '44px' }}
                    aria-label="Fazer upload de arquivo"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Arquivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state === 'scanning' && (
            <QrScannerComponent
              onScan={handleQrScan}
              onClose={handleCloseScanner}
              isProcessing={state === 'processing'}
            />
          )}

          {state === 'processing' && (
            <Card>
              <CardContent className="p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processando QR Code...
                </h3>
                <p className="text-sm text-gray-600">
                  Extraindo informações da nota fiscal
                </p>
              </CardContent>
            </Card>
          )}

          {state === 'success' && processedData && (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nota Processada com Sucesso!
                </h3>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>{processedData.totalItems}</strong> itens encontrados
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: <strong>R$ {processedData.totalValue.toFixed(2)}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Chave: {processedData.chave44.substring(0, 8)}...
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleTryAgain}
                    className="w-full"
                    style={{ minHeight: '44px' }}
                    aria-label="Escanear outra nota"
                  >
                    Escanear Outra Nota
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="w-full"
                    style={{ minHeight: '44px' }}
                    aria-label="Voltar ao início"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state === 'error' && (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Erro ao Processar
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {error}
                </p>
                
                <Button 
                  onClick={handleTryAgain}
                  className="w-full"
                  style={{ minHeight: '44px' }}
                  aria-label="Tentar novamente"
                >
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}