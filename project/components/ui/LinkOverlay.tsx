// project/components/ui/LinkOverlay.tsx
import Link from 'next/link'
import React from 'react'

type Props = {
  href: string
  ariaLabel?: string
  children: React.ReactNode
  className?: string
}

/**
 * Envolve qualquer bloco existente e injeta um <Link> absoluto "invisível".
 * Assim o visual não muda, só fica clicável.
 */
export function LinkOverlay({ href, ariaLabel, children, className }: Props) {
  return (
    <div className={`relative ${className || ''}`}>
      {/* conteúdo original */}
      {children}
      {/* camada clicável sem alterar layout */}
      <Link
        href={href}
        aria-label={ariaLabel}
        className="absolute inset-0"
        tabIndex={0}
      />
    </div>
  )
}
