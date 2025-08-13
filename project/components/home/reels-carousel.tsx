'use client'

import Link from 'next/link'
import Image from 'next/image'

type Reel = {
  id: string
  title: string
  thumb: string
  href: string
}

const reels: Reel[] = [
  { id: 'r1', title: 'Picanha suculenta', thumb: '/images/reel-1.jpg', href: '/receitas/picanha' },
  { id: 'r2', title: 'Massa al limone',   thumb: '/images/reel-2.jpg', href: '/receitas/massa-al-limone' },
]

export function ReelsCarousel() {
  return (
    <section className="mt-6">
      <h2 className="px-1 text-base font-semibold">Reels</h2>
      <div className="mt-3 px-1 flex gap-3 overflow-x-auto no-scrollbar">
        {reels.map((v) => (
          <Link
            key={v.id}
            href={v.href}
            aria-label={`Abrir ${v.title}`}
            className="min-w-[160px] max-w-[160px] shrink-0 rounded-2xl border shadow-sm bg-white overflow-hidden hover:scale-[0.99] transition pointer-events-auto"
          >
            <Image
              src={v.thumb}
              alt={v.title}
              width={320}
              height={400}
              className="w-full h-[200px] object-cover"
            />
            <div className="p-2">
              <h3 className="text-xs font-medium line-clamp-2">{v.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
