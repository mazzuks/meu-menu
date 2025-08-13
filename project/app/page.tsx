// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ChefHat, ClipboardList, Wallet, Camera, Home, Search, List, User } from "lucide-react";
import { mockRecipes } from "@/lib/mock-data";

// util: escolha segura para o herói (procura por picanha, senão pega a 1ª)
function pickHeroRecipe() {
  const byTitle = mockRecipes.find(r => r.title.toLowerCase().includes("picanha"));
  return byTitle ?? mockRecipes[0];
}

function QuickAction({
  href,
  icon,
  label,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        {desc ? <span className="text-xs text-gray-500">{desc}</span> : null}
      </div>
    </Link>
  );
}

function RecipeCard({
  slug,
  title,
  image,
  prepTime,
  difficulty,
}: {
  slug: string;
  title: string;
  image: string;
  prepTime?: number;
  difficulty?: string;
}) {
  return (
    <Link
      href={`/receitas/${slug}`}
      className="rounded-2xl bg-white shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative w-full h-36">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3">
        <div className="font-medium leading-snug line-clamp-2">{title}</div>
        <div className="text-xs text-gray-500 mt-1">
          {prepTime ? `${prepTime} min` : null}
          {prepTime && difficulty ? " • " : null}
          {difficulty ?? null}
        </div>
      </div>
    </Link>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: typeof mockRecipes;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-gray-700 font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((r) => (
          <RecipeCard
            key={r.id}
            slug={r.slug}
            title={r.title}
            image={r.image}
            prepTime={(r as any).prepTime}
            difficulty={(r as any).difficulty}
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const hero = pickHeroRecipe();

  // Seleções para parecer com o print:
  const rapidas = mockRecipes.filter((r: any) => r.prepTime && r.prepTime <= 30).slice(0, 4);
  const italiana =
    mockRecipes.filter((r) => r.category?.toLowerCase().includes("italian")).slice(0, 3);
  const brasil =
    mockRecipes.filter(
      (r) =>
        r.category?.toLowerCase().includes("brasil") ||
        r.category?.toLowerCase().includes("brasile") ||
        r.tags?.some((t) => t.toLowerCase().includes("brasil") || t.toLowerCase().includes("brasile"))
    ).slice(0, 3);
  const doces =
    mockRecipes.filter(
      (r) =>
        r.category?.toLowerCase().includes("doce") ||
        r.tags?.some((t) => t.toLowerCase().includes("sobremesa") || t.toLowerCase().includes("doce"))
    ).slice(0, 3);

  return (
    <main className="max-w-3xl mx-auto px-4 pb-24">
      {/* Header + busca */}
      <div className="pt-6">
        <h1 className="text-2xl font-bold">Meu Menu</h1>
        <div className="mt-3">
          <Link
            href="/buscar"
            className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-500 hover:shadow-sm"
          >
            🔍 Buscar receitas
          </Link>
        </div>
      </div>

      {/* Hero "Hoje é dia de..." */}
      <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm flex gap-4 items-center">
        <div className="flex-1">
          <div className="text-xs text-gray-500">HOJE É DIA DE</div>
          <div className="text-xl font-bold mt-1">Dia dos Pais</div>
          <div className="text-sm text-gray-600 mt-1">
            Picanha grelhada no ponto perfeito com farofa e vinagrete
          </div>
          <Link
            href={`/receitas/${hero.slug}`}
            className="inline-flex items-center gap-2 mt-3 rounded-xl bg-rose-600 text-white px-4 py-2 hover:bg-rose-700"
          >
            🍽️ Ver Receita
          </Link>
        </div>
        <div className="relative w-36 h-24 rounded-xl overflow-hidden">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <QuickAction
          href="/receitas"
          icon={<ChefHat size={20} />}
          label="Receitas"
        />
        <QuickAction
          href="/lista"
          icon={<ClipboardList size={20} />}
          label="Lista de Compras"
        />
        <QuickAction
          href="/gastos"
          icon={<Wallet size={20} />}
          label="Controle de Gastos"
        />
        <QuickAction
          href="/nf"
          icon={<Camera size={20} />}
          label="Enviar Nota"
          desc="NFC-e/QR Code"
        />
      </div>

      {/* Seções */}
      {rapidas.length > 0 && <Section title="Receitas Rápidas" items={rapidas} />}
      {italiana.length > 0 && <Section title="Culinária Italiana" items={italiana} />}
      {brasil.length > 0 && <Section title="Sabores do Brasil" items={brasil} />}
      {doces.length > 0 && <Section title="Doces & Sobremesas" items={doces} />}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-2xl bg-white shadow-lg border border-gray-200">
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
