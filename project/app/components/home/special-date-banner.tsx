import Image from 'next/image'

export const SpecialDateBanner = () => {
  return (
    <div className="rounded-lg border p-4 flex items-center gap-4">
      {/* Coluna esquerda: texto + botão */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">HOJE É DIA DE</p>
        <h2 className="text-xl font-bold">Dia dos Pais</h2>
        <p className="text-sm text-gray-600">
          Picanha grelhada no ponto perfeito com farofa e vinagrete
        </p>

        <div className="mt-4">
          <a
            href="/buscar?filtro=dia-dos-pais"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Ver Receitas
          </a>
        </div>
      </div>

      {/* Coluna direita: imagem fixa */}
      <div className="shrink-0">
        <Image
          src="https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Churrasco de picanha"
          width={256}
          height={256}
          className="rounded-lg object-cover w-32 h-32 sm:w-48 sm:h-48"
          priority
        />
      </div>
    </div>
  )
}
