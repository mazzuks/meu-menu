import Image from "next/image";
import Link from "next/link";

export default function SpecialDateBanner() {
  const ctaBadge = "49"; // valor do selinho no botão

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="grid gap-4 p-5 sm:grid-cols-[1.35fr_1fr] sm:gap-6 sm:p-6">
        {/* Texto */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Hoje é dia de
          </p>

          <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-[26px]">
            Dia dos Pais
          </h2>

          <p className="text-sm text-zinc-600">
            Picanha grelhada no ponto perfeito com farofa e vinagrete
          </p>

          <div className="pt-1">
            <Link
              href="/receitas/churrasco"
              className="inline-flex items-center gap-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <span className="rounded-lg bg-rose-700/90 px-2 py-1 text-[11px] font-bold leading-none">
                {ctaBadge}
              </span>
              Ver Receita
            </Link>
          </div>
        </div>

        {/* Imagem */}
        <div className="relative aspect-[4/3] sm:aspect-[3/2]">
          <Image
            src="https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Churrasco de Picanha"
            fill
            priority
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
