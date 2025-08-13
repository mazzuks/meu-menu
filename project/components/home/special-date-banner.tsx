'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SpecialDateBanner() {
  // ❗️Mantenha suas classes e imagem como já estavam – só envolvi com Link
  return (
    <Link href="/buscar" aria-label="Ir para Buscar" className="block pointer-events-auto">
      <div className="rounded-2xl overflow-hidden">
        <Image
          src="/images/hero-banner.jpg"
          alt="Banner do dia"
          width={1200}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>
    </Link>
  )
}
