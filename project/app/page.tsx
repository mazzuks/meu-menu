// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ChefHat,
  ClipboardList,
  Wallet,
  Camera,
  Home,
  Search,
  List,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { mockRecipes } from "@/lib/mock-data";

/* ===== helpers ===== */
const hero = (() => {
  // tenta achar picanha; se não tiver, pega a primeira
  const p = mockRecipes.find((r) =>
    (r.title || "").toLowerCase().includes("picanha")
  );
  return p ?? mockRecipes[0];
})();

function SectionRow({
  title,
  items,
}: {
  title: string;
  items: typeof mockRecipes;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((r) => (
          <Link
            key={r.id}
            href={`/receitas/${r.slug}`}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="flex gap-3 p-3">
              <div className="relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={r.image} alt={r.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium leading-snug line-clamp-2">
                  {r.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {("prepTime" in r && (r as any).prepTime) ? `${(r as any).prepTime} min` : null}
                  {("prepTime" in r && (r as any).prepTime) && ("difficulty" in r && (r as any).difficulty) ? " • " : null}
                  {("difficulty" in r && (r as any).difficulty) ? (r as any).difficulty : null}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  // coleções para as seções do print
  const rapidas = mockRecipes
    .filter((r: any) => r.prepTime && r.prepTime <= 30)
    .slice(0, 4);

  const italiana = mockRecipes
    .filter(
      (r) =>
        (r.category || "").toLowerCase().includes("ital") ||
        r.tags?.some((t) => t.toLowerCase().includes("ital"))
    )
    .slice(0, 3);

  const brasil = mockRecipes
    .filter(
      (r) =>
        (r.category || "").toLowerCase().includes("brasil") ||
        r.tags?.some((t) => t.toLowerCase().includes("feijoada") || t.toLowerCase().includes("picanha"))
    )
    .slice(0, 3);

  const doces = mockRecipes
    .filter(
      (r) =>
        (r.category || "").toLowerCase().includes("doce") ||
        r.tags?.some((t) => t.toLowerCase().includes("sobremesa") || t.toLowerCase().includes("doce"))
    )
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28">
      {/* título + busca */}
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Meu Menu</h1>

        {/* barra de busca com cara de input, mas navegando pra /buscar */}
        <Link
          href="/buscar"
          className="mt-3 block bg-white rounded-2xl ring-1 ring-gray-200 px-4 py-3 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 text-gray-500">
            <Search size={18} />
            <span className="text-sm">Buscar receitas</span>
          </div>
        </Link>
      </header>

      {/* hero card */}
      <section className="mt-5 bg-white rounded-2xl shadow-sm p-4 grid grid-cols-[1fr,144px] gap-4 items-center">
        <div>
          <div className="text-[11px] text-gray-500 font-semibold tracking-wide">
            HOJE É DIA DE
          </div>
          <div className="text-xl font-extrabold mt-1">Dia dos Pais</div>
          <p className="text-sm text-gray-600 mt-1">
            Picanha grelhada no ponto perfeito com farofa e vinagrete
          </p>

          <Link
            href={`/receitas/${hero.slug}`}
            className="inline-flex items-center gap-2 mt-3 rounded-xl bg-rose-600 text-white px-4 py-2 hover:bg-rose-700"
          >
            <UtensilsCrossed size={16} />
            <span className="text-sm font-semibold">Ver Receita</span>
          </Link>
        </div>

        <div className="relative w-[144px] h-[96px] rounded-xl overflow-hidden">
          <Image src={hero.image} alt={hero.title} fill className="object-cover" priority />
        </div>
      </section>

      {/* ações rápidas (2x2) */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/receitas"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <ChefHat size={20} className="text-gray-700" />
          </div>
          <div className="font-medium">Receitas</div>
        </Link>

        <Link
          href="/lista"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ClipboardList size={20} className="text-gray-700" />
          </div>
          <div className="font-medium">Lista de Compras</div>
        </Link>

        <Link
          href="/gastos"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Wallet size={20} className="text-gray-700" />
          </div>
          <div className="font-medium">Controle de Gastos</div>
        </Link>

        <Link
          href="/nf"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Camera size={20} className="text-gray-700" />
          </div>
          <div className="font-medium">Enviar Nota</div>
        </Link>
      </section>

      {/* seções */}
      {rapidas.length > 0 && <SectionRow title="Receitas Rápidas" items={rapidas} />}
      {italiana.length > 0 && <SectionRow title="Culinária Italiana" items={italiana} />}
      {brasil.length > 0 && <SectionRow title="Sabores do Brasil" items={brasil} />}
      {doces.length > 0 && <SectionRow title="Doces & Sobremesas" items={doces} />}

      {/* bottom tab bar fixo com blur */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-lg">
        <ul className="grid grid-cols-5 text-xs">
          <li>
            <Link href="/" className="flex flex-col items-center py-3 text-rose-600">
              <Home size={18} />
              <span>Início</span>
            </Link>
          </li>
          <li>
            <Link href="/buscar" className="flex flex-col items-center py-3 text-gray-600 hover:text-gray-900">
              <Search size={18} />
              <span>Buscar</span>
            </Link>
          </li>
          <li>
            <Link href="/lista" className="flex flex-col items-center py-3 text-gray-600 hover:text-gray-900">
              <List size={18} />
              <span>Lista</span>
            </Link>
          </li>
          <li>
            <Link href="/gastos" className="flex flex-col items-center py-3 text-gray-600 hover:text-gray-900">
              <Wallet size={18} />
              <span>Controle</span>
            </Link>
          </li>
          <li>
            <Link href="/perfil" className="flex flex-col items-center py-3 text-gray-600 hover:text-gray-900">
              <User size={18} />
              <span>Perfil</span>
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
