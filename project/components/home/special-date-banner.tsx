import Image from 'next/image'

export const SpecialDateBanner = () => {
  return (
    <div className="rounded-lg border p-4 flex flex-col sm:flex-row gap-4">
      {/* Imagem fixa do churrasco */}
      <div className="flex-shrink-0">
        <Image
          src="https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Churrasco de picanha"
          width={200}
          height={200}
          className="rounded-lg object-cover"
          priority
        />
      </div>

      {/* Texto e único botão */}
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">HOJE É DIA DE</p>
          <h2 className="text-xl font-bold">Dia dos Pais</h2>
          <p className="text-sm text-gray-600">
            Picanha grelhada no ponto perfeito com farofa e vinagrete
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href="/buscar?filtro=dia-dos-pais"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Ver Receitas
          </a>
          {/* Botão "Ver Vídeo" removido */}
        </div>
      </div>
    </div>
  )
}
