// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meu Menu',
  description: 'Organize receitas, lista de compras e gastos do dia a dia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        {/* Limita a largura a 480px e centraliza em qualquer tela */}
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
