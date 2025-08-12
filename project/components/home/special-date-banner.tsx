import Link from 'next/link'
import Image from 'next/image'

export function SpecialDateBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
      <div className="max-w-[65%]">
        <p className="mb-1 text-xs text-slate-500">HOJE É DIA DE</p>
        <h3 className="mb-2 text-xl font-bold">Dia dos Pais</h3>
        <p className="mb-4 text-sm text-slate-600">
          Picanha grelhada no ponto perfeito com farofa e vinagrete
        </p>

        <div className="flex gap-2">
          <Link
            href="/receitas/churrasco-picanha"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
          >
            ▶ Ver Vídeo
          </Link>
          <Link
            href="/receitas"
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Ver Receitas
          </Link>
        </div>
      </div>

      <Image
        src="https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt=""
        width={120}
        height={120}
        className="absolute right-3 top-3 rounded-xl object-cover"
      />
    </div>
  )
}
