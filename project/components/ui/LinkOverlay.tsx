// project/components/ui/LinkOverlay.tsx
import Link from 'next/link'
import React from 'react'

type Props = {
  href: string
  ariaLabel?: string
  children: React.ReactNode
  className?: string
}

export function LinkOverlay({ href, ariaLabel, children, className }: Props) {
  return (
    <div className={`relative ${className || ''}`}>
      {children}
      <Link href={href} aria-label={ariaLabel} className="absolute inset-0" tabIndex={0} />
    </div>
  )
}
