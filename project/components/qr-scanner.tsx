/**
 * QR Scanner component with dynamic import
 * Componente de scanner QR com importação dinâmica
 */

'use client'

import { useState, useCallback } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, RotateCcw } from 'lucide-react'

interface QrScannerComponentProps {
  onScan: (data: string) => void
  onClose: () => void
  isProcessing?: boolean
}

export function QrScannerComponent({ onScan, onClose, isProcessing = false }: QrScannerComponentProps) {
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const handleScan = useCallback((result: any) => {
    if (result && result.text) {
      onScan(result.text)
    }
  }, [onScan])

  const handleError = useCallback((error: any) => {
    console.error('QR Scanner error:', error)
    if (error.name === 'NotAllowedError') {
      setError('Permissão de câmera negada. Por favor, permita o acesso à câmera.')
      setHasPermission(false)
    } else if (error.name === 'NotFoundError') {
      setError('Nenhuma câmera encontrada no dispositivo.')
    } else {
      setError('Erro ao acessar a câmera. Tente novamente.')
    }
  }, [])

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      setError(null)
    } catch (err) {
      handleError(err)
    }
  }

  if (hasPermission === false) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Permissão Necessária
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {error || 'Precisamos acessar sua câmera para escanear o QR code da nota fiscal.'}
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={requestPermission} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              containerStyle={{
                width: '100%',
                height: '300px'
              }}
              videoStyle={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              constraints={{
                facingMode: 'environment' // Use back camera
              }}
            />
            
            {/* Overlay with scanning frame */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="flex items-center justify-center h-full">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={onClose}
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              {isProcessing 
                ? 'Processando QR code...' 
                : 'Posicione o QR code da nota fiscal dentro do quadro'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}