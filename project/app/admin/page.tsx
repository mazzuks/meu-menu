/**
 * Admin page for managing promotions
 * Página de administração para gerenciar promoções
 */

'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Eye, ExternalLink, Calendar, Tag } from 'lucide-react'
import { MockPromotion } from '@/lib/types'
import { mockBusinessAccounts } from '@/lib/mock-promotions'

export default function AdminPage() {
  const [promotions, setPromotions] = useState<MockPromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<MockPromotion | null>(null)
  const [formData, setFormData] = useState({
    businessAccountId: '',
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    tags: '',
    targetRegions: 'SP',
    promotionType: 'discount' as const,
    discountPercentage: '',
    originalPrice: '',
    promotionalPrice: '',
    link: '',
    priority: '5'
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions?all=true')
      const result = await response.json()
      
      if (result.success) {
        setPromotions(result.data)
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.businessAccountId) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const promotionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        targetRegions: formData.targetRegions.split(',').map(region => region.trim()),
        discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : undefined,
        priority: Number(formData.priority),
        isActive: true
      }

      const url = editingPromotion 
        ? `/api/promotions/${editingPromotion.id}`
        : '/api/promotions'
      
      const method = editingPromotion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionData)
      })

      const result = await response.json()

      if (result.success) {
        alert(editingPromotion ? 'Promoção atualizada!' : 'Promoção criada!')
        resetForm()
        fetchPromotions()
      } else {
        alert(result.error || 'Erro ao salvar promoção')
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Erro ao salvar promoção')
    }
  }

  const handleEdit = (promotion: MockPromotion) => {
    setEditingPromotion(promotion)
    setFormData({
      businessAccountId: promotion.businessAccountId,
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      tags: promotion.tags.join(', '),
      targetRegions: promotion.targetRegions.join(', '),
      promotionType: promotion.promotionType,
      discountPercentage: promotion.discountPercentage?.toString() || '',
      originalPrice: promotion.originalPrice?.toString() || '',
      promotionalPrice: promotion.promotionalPrice?.toString() || '',
      link: promotion.link,
      priority: promotion.priority.toString()
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert('Promoção excluída!')
        fetchPromotions()
      } else {
        alert('Erro ao excluir promoção')
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Erro ao excluir promoção')
    }
  }

  const resetForm = () => {
    setFormData({
      businessAccountId: '',
      title: '',
      description: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      tags: '',
      targetRegions: 'SP',
      promotionType: 'discount',
      discountPercentage: '',
      originalPrice: '',
      promotionalPrice: '',
      link: '',
      priority: '5'
    })
    setEditingPromotion(null)
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Administração" showSearch={false} />
      
      <div className="px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Create/Edit form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa *
                      </label>
                      <select
                        value={formData.businessAccountId}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessAccountId: e.target.value }))}
                        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        <option value="">Selecione uma empresa</option>
                        {mockBusinessAccounts.map(business => (
                          <option key={business.id} value={business.id}>
                            {business.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Promoção *
                      </label>
                      <select
                        value={formData.promotionType}
                        onChange={(e) => setFormData(prev => ({ ...prev, promotionType: e.target.value as any }))}
                        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="discount">Desconto</option>
                        <option value="bundle">Kit/Combo</option>
                        <option value="special_offer">Oferta Especial</option>
                        <option value="sweepstakes">Sorteio</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Mega Promoção de Verão"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva os detalhes da promoção..."
                      className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Imagem *
                    </label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://images.pexels.com/..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Início *
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Fim *
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desconto (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Original (R$)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                        placeholder="99.90"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Promocional (R$)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.promotionalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, promotionalPrice: e.target.value }))}
                        placeholder="49.90"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags * (separadas por vírgula)
                      </label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="verão, desconto, frutas"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regiões (separadas por vírgula)
                      </label>
                      <Input
                        value={formData.targetRegions}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetRegions: e.target.value }))}
                        placeholder="SP, RJ, MG"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link da Promoção *
                      </label>
                      <Input
                        value={formData.link}
                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="https://www.exemplo.com/promocao"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridade (1-10)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" style={{ minHeight: '44px' }}>
                      {editingPromotion ? 'Atualizar' : 'Criar'} Promoção
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} style={{ minHeight: '44px' }}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Promotions list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Promoções ({promotions.length})</span>
                {!showCreateForm && (
                  <Button onClick={() => setShowCreateForm(true)} size="sm" style={{ minHeight: '44px' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {promotions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma promoção encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={promotion.imageUrl} 
                            alt={promotion.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
                              <p className="text-sm text-gray-600">{promotion.businessName}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(promotion)}
                                style={{ minHeight: '44px', minWidth: '44px' }}
                                aria-label={`Editar promoção ${promotion.title}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(promotion.id)}
                                className="text-red-600 hover:text-red-700"
                                style={{ minHeight: '44px', minWidth: '44px' }}
                                aria-label={`Excluir promoção ${promotion.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {promotion.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(promotion.startDate).toLocaleDateString('pt-BR')} - {new Date(promotion.endDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{promotion.viewCount} visualizações</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              <span>{promotion.clickCount} cliques</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {promotion.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  <Tag className="w-2 h-2" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {promotion.discountPercentage && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  -{promotion.discountPercentage}%
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                promotion.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {promotion.isActive ? 'Ativa' : 'Inativa'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}