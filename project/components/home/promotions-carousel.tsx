'use client'

import Link from 'next/link'
import Image from 'next/image'

type Promo = {
  id: string
  title: string
  image: string
  url?: string
}

const mockPromos: Promo[] = [
  { id: 'p1', title: 'Ofertas da Semana', image: '/images/promo-1.jpg', url: '/promocoes' },
  { id: 'p2', title: 'Economize no mês', image: '/images/promo-2.jpg', url: '/promocoes' },
]

export function PromotionsCarousel() {
  return (
    <section className="mt-6">
      <h2 className="px-1 text-base font-semibold">Promoções</h2>
      <div className="mt-3 px-1 flex gap-3 overflow-x-auto no-scrollbar">
        {mockPromos.map((p) => (
          <Link
            key={p.id}
            href={p.url || '/promocoes'}
            aria-label={`Abrir ${p.title}`}
            className="min-w-[240px] max-w-[240px] shrink-0 rounded-2xl border shadow-sm bg-white overflow-hidden hover:scale-[0.99] transition pointer-events-auto"
          >
            <Image
              src={p.image}
              alt={p.title}
              width={480}
              height={260}
              className="w-full h-[120px] object-cover"
            />
            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
