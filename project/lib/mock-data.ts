/**
 * Mock data for Meu Menu app
 * Dados mockados para o app Meu Menu
 */

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  image: string
  prepTime: number // minutes / minutos
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  servings: number
  category: string
  tags: string[]
  ingredients: Ingredient[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface ShoppingListItem {
  id: string
  name: string
  amount: string
  unit: string
  category: string
  purchased: boolean
  recipeId?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

// Mock recipes data / Dados mockados de receitas (20 receitas completas)
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    slug: 'pizza-margherita',
    title: 'Pizza Margherita',
    description: 'Pizza clássica italiana com molho de tomate, mussarela e manjericão fresco',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 45,
    difficulty: 'Médio',
    servings: 4,
    category: 'Italiana',
    tags: ['pizza', 'italiana', 'vegetariana'],
    ingredients: [
      { id: '1', name: 'Massa de pizza', amount: '1', unit: 'unidade' },
      { id: '2', name: 'Molho de tomate', amount: '200', unit: 'ml' },
      { id: '3', name: 'Mussarela', amount: '200', unit: 'g' },
      { id: '4', name: 'Manjericão fresco', amount: '10', unit: 'folhas' },
      { id: '5', name: 'Azeite', amount: '2', unit: 'colheres de sopa' }
    ],
    instructions: [
      'Pré-aqueça o forno a 220°C',
      'Abra a massa de pizza em uma forma untada',
      'Espalhe o molho de tomate uniformemente',
      'Adicione a mussarela por toda a pizza',
      'Leve ao forno por 15-20 minutos até dourar',
      'Retire do forno e adicione o manjericão fresco',
      'Regue com azeite e sirva quente'
    ],
    nutrition: { calories: 280, protein: 12, carbs: 35, fat: 8 }
  },
  {
    id: '2',
    slug: 'sopa-abobora',
    title: 'Sopa de Abóbora',
    description: 'Sopa cremosa e nutritiva de abóbora com gengibre',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 30,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Brasileira',
    tags: ['sopa', 'saudável', 'vegetariana'],
    ingredients: [
      { id: '1', name: 'Abóbora', amount: '500', unit: 'g' },
      { id: '2', name: 'Cebola', amount: '1', unit: 'unidade' },
      { id: '3', name: 'Gengibre', amount: '1', unit: 'cm' },
      { id: '4', name: 'Caldo de legumes', amount: '500', unit: 'ml' },
      { id: '5', name: 'Creme de leite', amount: '100', unit: 'ml' }
    ],
    instructions: [
      'Descasque e corte a abóbora em cubos',
      'Refogue a cebola e o gengibre',
      'Adicione a abóbora e o caldo',
      'Cozinhe por 20 minutos até amolecer',
      'Bata no liquidificador até ficar cremoso',
      'Volte à panela, adicione o creme de leite',
      'Tempere com sal e pimenta a gosto'
    ],
    nutrition: { calories: 120, protein: 3, carbs: 18, fat: 4 }
  },
  {
    id: '3',
    slug: 'churrasco-picanha',
    title: 'Churrasco de Picanha',
    description: 'Picanha grelhada no ponto perfeito com farofa e vinagrete',
    image: 'https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 60,
    difficulty: 'Médio',
    servings: 6,
    category: 'Brasileira',
    tags: ['churrasco', 'carne', 'fim de semana'],
    ingredients: [
      { id: '1', name: 'Picanha', amount: '1', unit: 'kg' },
      { id: '2', name: 'Sal grosso', amount: '3', unit: 'colheres de sopa' },
      { id: '3', name: 'Farinha de mandioca', amount: '200', unit: 'g' },
      { id: '4', name: 'Tomate', amount: '3', unit: 'unidades' },
      { id: '5', name: 'Cebola roxa', amount: '1', unit: 'unidade' }
    ],
    instructions: [
      'Tempere a picanha com sal grosso 30 min antes',
      'Acenda o carvão e espere formar brasas',
      'Grelhe a picanha por 15 min de cada lado',
      'Prepare a farofa refogando a farinha',
      'Corte tomate e cebola para o vinagrete',
      'Deixe a carne descansar 5 minutos',
      'Corte em fatias e sirva com acompanhamentos'
    ],
    nutrition: { calories: 420, protein: 35, carbs: 5, fat: 28 }
  },
  {
    id: '4',
    slug: 'brigadeiro-gourmet',
    title: 'Brigadeiro Gourmet',
    description: 'Brigadeiro cremoso com chocolate belga e granulado especial',
    image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 20,
    difficulty: 'Fácil',
    servings: 20,
    category: 'Doces',
    tags: ['doce', 'chocolate', 'festa'],
    ingredients: [
      { id: '1', name: 'Leite condensado', amount: '1', unit: 'lata' },
      { id: '2', name: 'Chocolate em pó', amount: '3', unit: 'colheres de sopa' },
      { id: '3', name: 'Manteiga', amount: '1', unit: 'colher de sopa' },
      { id: '4', name: 'Granulado', amount: '100', unit: 'g' }
    ],
    instructions: [
      'Misture leite condensado, chocolate e manteiga',
      'Leve ao fogo baixo mexendo sempre',
      'Cozinhe até desgrudar do fundo da panela',
      'Deixe esfriar completamente',
      'Faça bolinhas com as mãos untadas',
      'Passe no granulado',
      'Coloque em forminhas e sirva'
    ],
    nutrition: { calories: 85, protein: 1, carbs: 12, fat: 3 }
  },
  {
    id: '5',
    slug: 'feijoada-completa',
    title: 'Feijoada Completa',
    description: 'Feijoada tradicional brasileira com todos os acompanhamentos',
    image: 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 180,
    difficulty: 'Difícil',
    servings: 8,
    category: 'Brasileira',
    tags: ['feijoada', 'tradicional', 'fim de semana'],
    ingredients: [
      { id: '1', name: 'Feijão preto', amount: '500', unit: 'g' },
      { id: '2', name: 'Linguiça calabresa', amount: '300', unit: 'g' },
      { id: '3', name: 'Costela de porco', amount: '400', unit: 'g' },
      { id: '4', name: 'Bacon', amount: '200', unit: 'g' },
      { id: '5', name: 'Cebola', amount: '2', unit: 'unidades' },
      { id: '6', name: 'Alho', amount: '4', unit: 'dentes' }
    ],
    instructions: [
      'Deixe o feijão de molho na véspera',
      'Cozinhe o feijão até ficar macio',
      'Refogue as carnes em panela separada',
      'Junte as carnes ao feijão',
      'Tempere com cebola, alho e louro',
      'Cozinhe por mais 1 hora em fogo baixo',
      'Sirva com arroz, couve e farofa'
    ],
    nutrition: { calories: 380, protein: 25, carbs: 28, fat: 18 }
  },
  {
    id: '6',
    slug: 'salada-caesar',
    title: 'Salada Caesar',
    description: 'Salada clássica com alface, croutons e molho caesar',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 15,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Saladas',
    tags: ['salada', 'saudável', 'rápido'],
    ingredients: [
      { id: '1', name: 'Alface americana', amount: '1', unit: 'pé' },
      { id: '2', name: 'Parmesão', amount: '100', unit: 'g' },
      { id: '3', name: 'Croutons', amount: '100', unit: 'g' },
      { id: '4', name: 'Molho caesar', amount: '100', unit: 'ml' }
    ],
    instructions: [
      'Lave e corte a alface em pedaços',
      'Rale o queijo parmesão',
      'Misture a alface com o molho',
      'Adicione os croutons',
      'Polvilhe o parmesão por cima',
      'Sirva imediatamente'
    ],
    nutrition: { calories: 180, protein: 8, carbs: 12, fat: 12 }
  },
  {
    id: '7',
    slug: 'lasanha-bolonhesa',
    title: 'Lasanha à Bolonhesa',
    description: 'Lasanha tradicional com molho bolonhesa e queijo derretido',
    image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 90,
    difficulty: 'Médio',
    servings: 8,
    category: 'Italiana',
    tags: ['lasanha', 'italiana', 'família'],
    ingredients: [
      { id: '1', name: 'Massa de lasanha', amount: '500', unit: 'g' },
      { id: '2', name: 'Carne moída', amount: '500', unit: 'g' },
      { id: '3', name: 'Molho de tomate', amount: '500', unit: 'ml' },
      { id: '4', name: 'Queijo mussarela', amount: '300', unit: 'g' },
      { id: '5', name: 'Queijo parmesão', amount: '100', unit: 'g' }
    ],
    instructions: [
      'Cozinhe a massa conforme embalagem',
      'Prepare o molho bolonhesa',
      'Monte camadas: massa, molho, queijo',
      'Repita as camadas até acabar',
      'Cubra com queijo e leve ao forno',
      'Asse por 40 minutos a 180°C',
      'Deixe descansar antes de servir'
    ],
    nutrition: { calories: 420, protein: 28, carbs: 35, fat: 18 }
  },
  {
    id: '8',
    slug: 'pao-de-acucar',
    title: 'Pão de Açúcar',
    description: 'Pão doce tradicional brasileiro, fofinho e saboroso',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 120,
    difficulty: 'Médio',
    servings: 12,
    category: 'Pães',
    tags: ['pão', 'doce', 'café da manhã'],
    ingredients: [
      { id: '1', name: 'Farinha de trigo', amount: '500', unit: 'g' },
      { id: '2', name: 'Açúcar', amount: '100', unit: 'g' },
      { id: '3', name: 'Fermento biológico', amount: '10', unit: 'g' },
      { id: '4', name: 'Leite morno', amount: '250', unit: 'ml' },
      { id: '5', name: 'Ovos', amount: '2', unit: 'unidades' }
    ],
    instructions: [
      'Dissolva o fermento no leite morno',
      'Misture farinha, açúcar e ovos',
      'Adicione o leite com fermento',
      'Sove a massa por 10 minutos',
      'Deixe crescer por 1 hora',
      'Modele os pães e deixe crescer novamente',
      'Asse por 25 minutos a 180°C'
    ],
    nutrition: { calories: 220, protein: 6, carbs: 42, fat: 3 }
  },
  {
    id: '9',
    slug: 'moqueca-peixe',
    title: 'Moqueca de Peixe',
    description: 'Moqueca capixaba com peixe fresco, leite de coco e dendê',
    image: 'https://images.pexels.com/photos/8477552/pexels-photo-8477552.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 45,
    difficulty: 'Médio',
    servings: 4,
    category: 'Brasileira',
    tags: ['peixe', 'moqueca', 'capixaba'],
    ingredients: [
      { id: '1', name: 'Peixe em postas', amount: '600', unit: 'g' },
      { id: '2', name: 'Leite de coco', amount: '400', unit: 'ml' },
      { id: '3', name: 'Dendê', amount: '2', unit: 'colheres de sopa' },
      { id: '4', name: 'Tomate', amount: '2', unit: 'unidades' },
      { id: '5', name: 'Pimentão', amount: '1', unit: 'unidade' },
      { id: '6', name: 'Coentro', amount: '1', unit: 'maço' }
    ],
    instructions: [
      'Tempere o peixe com sal e limão',
      'Refogue cebola, tomate e pimentão',
      'Adicione o peixe e o leite de coco',
      'Tempere com dendê e pimenta',
      'Cozinhe por 15 minutos em fogo baixo',
      'Finalize com coentro picado',
      'Sirva com arroz branco e pirão'
    ],
    nutrition: { calories: 320, protein: 28, carbs: 8, fat: 20 }
  },
  {
    id: '10',
    slug: 'risotto-cogumelos',
    title: 'Risotto de Cogumelos',
    description: 'Risotto cremoso com mix de cogumelos e parmesão',
    image: 'https://images.pexels.com/photos/8477552/pexels-photo-8477552.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 40,
    difficulty: 'Médio',
    servings: 4,
    category: 'Italiana',
    tags: ['risotto', 'cogumelos', 'vegetariano'],
    ingredients: [
      { id: '1', name: 'Arroz arbóreo', amount: '300', unit: 'g' },
      { id: '2', name: 'Cogumelos variados', amount: '300', unit: 'g' },
      { id: '3', name: 'Caldo de legumes', amount: '1', unit: 'litro' },
      { id: '4', name: 'Vinho branco', amount: '100', unit: 'ml' },
      { id: '5', name: 'Parmesão', amount: '100', unit: 'g' }
    ],
    instructions: [
      'Aqueça o caldo de legumes',
      'Refogue os cogumelos e reserve',
      'Doure o arroz na manteiga',
      'Adicione vinho branco e deixe evaporar',
      'Vá adicionando caldo aos poucos',
      'Mexa sempre até o arroz ficar cremoso',
      'Finalize com cogumelos e parmesão'
    ],
    nutrition: { calories: 380, protein: 12, carbs: 58, fat: 8 }
  },
  {
    id: '11',
    slug: 'tacos-mexicanos',
    title: 'Tacos Mexicanos',
    description: 'Tacos autênticos com carne temperada e guacamole',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 30,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Mexicana',
    tags: ['tacos', 'mexicano', 'picante'],
    ingredients: [
      { id: '1', name: 'Tortillas de milho', amount: '8', unit: 'unidades' },
      { id: '2', name: 'Carne moída', amount: '400', unit: 'g' },
      { id: '3', name: 'Abacate', amount: '2', unit: 'unidades' },
      { id: '4', name: 'Tomate', amount: '2', unit: 'unidades' },
      { id: '5', name: 'Cebola roxa', amount: '1', unit: 'unidade' }
    ],
    instructions: [
      'Tempere a carne com cominho e páprica',
      'Refogue a carne até dourar',
      'Prepare o guacamole com abacate',
      'Aqueça as tortillas na frigideira',
      'Monte os tacos com carne e vegetais',
      'Sirva com guacamole e molho picante'
    ],
    nutrition: { calories: 320, protein: 22, carbs: 28, fat: 14 }
  },
  {
    id: '12',
    slug: 'sushi-salmao',
    title: 'Sushi de Salmão',
    description: 'Sushi tradicional japonês com salmão fresco',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 60,
    difficulty: 'Difícil',
    servings: 4,
    category: 'Japonesa',
    tags: ['sushi', 'japonês', 'peixe cru'],
    ingredients: [
      { id: '1', name: 'Arroz para sushi', amount: '300', unit: 'g' },
      { id: '2', name: 'Salmão fresco', amount: '200', unit: 'g' },
      { id: '3', name: 'Nori', amount: '4', unit: 'folhas' },
      { id: '4', name: 'Vinagre de arroz', amount: '50', unit: 'ml' },
      { id: '5', name: 'Wasabi', amount: '1', unit: 'colher de chá' }
    ],
    instructions: [
      'Cozinhe o arroz e tempere com vinagre',
      'Corte o salmão em fatias finas',
      'Estenda o nori sobre a esteira',
      'Espalhe o arroz sobre o nori',
      'Adicione o salmão e enrole',
      'Corte em pedaços com faca afiada',
      'Sirva com wasabi e shoyu'
    ],
    nutrition: { calories: 280, protein: 18, carbs: 35, fat: 8 }
  },
  {
    id: '13',
    slug: 'hamburguer-artesanal',
    title: 'Hambúrguer Artesanal',
    description: 'Hambúrguer gourmet com blend especial e ingredientes frescos',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 25,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Lanches',
    tags: ['hambúrguer', 'gourmet', 'lanche'],
    ingredients: [
      { id: '1', name: 'Carne moída especial', amount: '600', unit: 'g' },
      { id: '2', name: 'Pão de hambúrguer', amount: '4', unit: 'unidades' },
      { id: '3', name: 'Queijo cheddar', amount: '4', unit: 'fatias' },
      { id: '4', name: 'Alface', amount: '4', unit: 'folhas' },
      { id: '5', name: 'Tomate', amount: '1', unit: 'unidade' }
    ],
    instructions: [
      'Modele a carne em 4 hambúrgueres',
      'Tempere com sal e pimenta',
      'Grelhe por 4 minutos de cada lado',
      'Derreta o queijo sobre a carne',
      'Torre levemente o pão',
      'Monte com alface, tomate e molhos',
      'Sirva imediatamente'
    ],
    nutrition: { calories: 520, protein: 32, carbs: 28, fat: 28 }
  },
  {
    id: '14',
    slug: 'paella-valenciana',
    title: 'Paella Valenciana',
    description: 'Paella tradicional espanhola com frango, coelho e açafrão',
    image: 'https://images.pexels.com/photos/16743489/pexels-photo-16743489.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 75,
    difficulty: 'Difícil',
    servings: 6,
    category: 'Espanhola',
    tags: ['paella', 'espanhol', 'arroz'],
    ingredients: [
      { id: '1', name: 'Arroz bomba', amount: '400', unit: 'g' },
      { id: '2', name: 'Frango em pedaços', amount: '500', unit: 'g' },
      { id: '3', name: 'Açafrão', amount: '1', unit: 'g' },
      { id: '4', name: 'Vagem', amount: '200', unit: 'g' },
      { id: '5', name: 'Caldo de galinha', amount: '1', unit: 'litro' }
    ],
    instructions: [
      'Doure o frango na paellera',
      'Adicione as vagens e refogue',
      'Junte o arroz e misture bem',
      'Adicione caldo quente com açafrão',
      'Cozinhe sem mexer por 20 minutos',
      'Deixe descansar 5 minutos',
      'Sirva diretamente da paellera'
    ],
    nutrition: { calories: 420, protein: 25, carbs: 52, fat: 12 }
  },
  {
    id: '15',
    slug: 'tiramisu-classico',
    title: 'Tiramisù Clássico',
    description: 'Sobremesa italiana com café, mascarpone e cacau',
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 30,
    difficulty: 'Médio',
    servings: 8,
    category: 'Doces',
    tags: ['tiramisù', 'italiano', 'café'],
    ingredients: [
      { id: '1', name: 'Biscoito champagne', amount: '200', unit: 'g' },
      { id: '2', name: 'Mascarpone', amount: '500', unit: 'g' },
      { id: '3', name: 'Café forte', amount: '300', unit: 'ml' },
      { id: '4', name: 'Ovos', amount: '4', unit: 'unidades' },
      { id: '5', name: 'Cacau em pó', amount: '2', unit: 'colheres de sopa' }
    ],
    instructions: [
      'Prepare café forte e deixe esfriar',
      'Separe gemas e claras dos ovos',
      'Bata gemas com açúcar até clarear',
      'Misture o mascarpone às gemas',
      'Molhe biscoitos no café rapidamente',
      'Monte camadas alternadas',
      'Gelar por 4 horas e polvilhar cacau'
    ],
    nutrition: { calories: 380, protein: 8, carbs: 28, fat: 26 }
  },
  {
    id: '16',
    slug: 'coxinha-frango',
    title: 'Coxinha de Frango',
    description: 'Coxinha tradicional brasileira com recheio cremoso de frango',
    image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 90,
    difficulty: 'Médio',
    servings: 20,
    category: 'Salgados',
    tags: ['coxinha', 'salgado', 'festa'],
    ingredients: [
      { id: '1', name: 'Peito de frango', amount: '500', unit: 'g' },
      { id: '2', name: 'Farinha de trigo', amount: '500', unit: 'g' },
      { id: '3', name: 'Caldo de galinha', amount: '500', unit: 'ml' },
      { id: '4', name: 'Ovos', amount: '2', unit: 'unidades' },
      { id: '5', name: 'Farinha de rosca', amount: '200', unit: 'g' }
    ],
    instructions: [
      'Cozinhe e desfie o frango',
      'Prepare a massa com farinha e caldo',
      'Faça o recheio refogado',
      'Modele as coxinhas',
      'Passe no ovo batido e farinha de rosca',
      'Frite em óleo quente até dourar',
      'Escorra em papel absorvente'
    ],
    nutrition: { calories: 180, protein: 12, carbs: 18, fat: 8 }
  },
  {
    id: '17',
    slug: 'pad-thai',
    title: 'Pad Thai',
    description: 'Macarrão tailandês com camarão, amendoim e molho agridoce',
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 25,
    difficulty: 'Médio',
    servings: 4,
    category: 'Tailandesa',
    tags: ['pad thai', 'tailandês', 'camarão'],
    ingredients: [
      { id: '1', name: 'Macarrão de arroz', amount: '300', unit: 'g' },
      { id: '2', name: 'Camarão', amount: '300', unit: 'g' },
      { id: '3', name: 'Amendoim torrado', amount: '100', unit: 'g' },
      { id: '4', name: 'Molho de peixe', amount: '3', unit: 'colheres de sopa' },
      { id: '5', name: 'Brotos de feijão', amount: '150', unit: 'g' }
    ],
    instructions: [
      'Deixe o macarrão de molho em água morna',
      'Refogue o camarão até ficar rosado',
      'Adicione o macarrão escorrido',
      'Tempere com molho de peixe e açúcar',
      'Junte os brotos e amendoim',
      'Misture rapidamente em fogo alto',
      'Sirva com limão e pimenta'
    ],
    nutrition: { calories: 420, protein: 22, carbs: 58, fat: 12 }
  },
  {
    id: '18',
    slug: 'ratatouille',
    title: 'Ratatouille',
    description: 'Refogado francês de legumes mediterrâneos',
    image: 'https://images.pexels.com/photos/8477552/pexels-photo-8477552.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 45,
    difficulty: 'Fácil',
    servings: 6,
    category: 'Francesa',
    tags: ['ratatouille', 'francês', 'vegetariano'],
    ingredients: [
      { id: '1', name: 'Berinjela', amount: '2', unit: 'unidades' },
      { id: '2', name: 'Abobrinha', amount: '2', unit: 'unidades' },
      { id: '3', name: 'Pimentão vermelho', amount: '1', unit: 'unidade' },
      { id: '4', name: 'Tomate', amount: '4', unit: 'unidades' },
      { id: '5', name: 'Ervas de Provence', amount: '1', unit: 'colher de chá' }
    ],
    instructions: [
      'Corte todos os legumes em cubos',
      'Refogue a cebola até dourar',
      'Adicione berinjela e abobrinha',
      'Junte pimentão e tomate',
      'Tempere com ervas e sal',
      'Cozinhe em fogo baixo por 30 min',
      'Sirva quente como acompanhamento'
    ],
    nutrition: { calories: 120, protein: 3, carbs: 18, fat: 4 }
  },
  {
    id: '19',
    slug: 'cheesecake-frutas-vermelhas',
    title: 'Cheesecake de Frutas Vermelhas',
    description: 'Cheesecake cremoso com calda de frutas vermelhas',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 60,
    difficulty: 'Médio',
    servings: 10,
    category: 'Doces',
    tags: ['cheesecake', 'frutas vermelhas', 'sobremesa'],
    ingredients: [
      { id: '1', name: 'Cream cheese', amount: '600', unit: 'g' },
      { id: '2', name: 'Biscoito maisena', amount: '200', unit: 'g' },
      { id: '3', name: 'Frutas vermelhas', amount: '300', unit: 'g' },
      { id: '4', name: 'Açúcar', amount: '150', unit: 'g' },
      { id: '5', name: 'Ovos', amount: '3', unit: 'unidades' }
    ],
    instructions: [
      'Triture os biscoitos e misture com manteiga',
      'Forre o fundo da forma com a mistura',
      'Bata cream cheese com açúcar e ovos',
      'Despeje sobre a base de biscoito',
      'Asse em banho-maria por 50 minutos',
      'Deixe esfriar completamente',
      'Cubra com calda de frutas vermelhas'
    ],
    nutrition: { calories: 420, protein: 8, carbs: 35, fat: 28 }
  },
  {
    id: '20',
    slug: 'bobó-camarão',
    title: 'Bobó de Camarão',
    description: 'Prato baiano cremoso com camarão e mandioca',
    image: 'https://images.pexels.com/photos/8477552/pexels-photo-8477552.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 50,
    difficulty: 'Médio',
    servings: 4,
    category: 'Brasileira',
    tags: ['bobó', 'camarão', 'baiano'],
    ingredients: [
      { id: '1', name: 'Camarão grande', amount: '500', unit: 'g' },
      { id: '2', name: 'Mandioca', amount: '600', unit: 'g' },
      { id: '3', name: 'Leite de coco', amount: '400', unit: 'ml' },
      { id: '4', name: 'Dendê', amount: '2', unit: 'colheres de sopa' },
      { id: '5', name: 'Coentro', amount: '1', unit: 'maço' }
    ],
    instructions: [
      'Cozinhe a mandioca até amolecer',
      'Amasse até formar um purê cremoso',
      'Tempere os camarões e refogue',
      'Misture o purê com leite de coco',
      'Adicione os camarões ao bobó',
      'Tempere com dendê e pimenta',
      'Finalize com coentro picado'
    ],
    nutrition: { calories: 380, protein: 28, carbs: 32, fat: 18 }
  }
]

    
    recipe.ingredients.forEach(ingredient => {
      const normalizedIngredient = ingredient.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\d+/g, '')
        .replace(/(kg|g|ml|l|un|unidade|unidades|dente|dentes|colher|colheres|xícara|xícaras|maço|maços|fatia|fatias|folha|folhas|cm)/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Check if ingredient matches any stock item / Verificar se ingrediente corresponde a algum item do estoque
      const hasMatch = normalizedStock.some(stockItem => 
        stockItem.includes(normalizedIngredient) || 
        normalizedIngredient.includes(stockItem)
      )
      
      if (hasMatch) {
        score += 1
      }
    
    
    return { recipe, score }
  })
  
  // Return top recipes with score > 0 / Retornar receitas com pontuação > 0
  return scoredRecipes
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.recipe)
}
  { id: '1', description: 'Supermercado ABC', amount: 127.50, category: 'Alimentação', date: '2025-01-02' },
  { id: '2', description: 'Padaria do João', amount: 15.80, category: 'Padaria', date: '2025-01-02' },
  { id: '3', description: 'Feira livre', amount: 45.20, category: 'Hortifruti', date: '2025-01-01' },
  { id: '4', description: 'Açougue Central', amount: 89.90, category: 'Carnes', date: '2024-12-30' },
  { id: '5', description: 'Mercado XYZ', amount: 203.45, category: 'Alimentação', date: '2024-12-28' }
]

// Helper functions / Funções auxiliares
export const getRecipesByIds = (ids: string[]): Recipe[] => {
  return mockRecipes.filter(recipe => ids.includes(recipe.id))
}

export const searchRecipes = (query: string, category?: string, difficulty?: string): Recipe[] => {
  return mockRecipes.filter(recipe => {
    const matchesQuery = recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
                        recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    
    const matchesCategory = !category || recipe.category === category
    const matchesDifficulty = !difficulty || recipe.difficulty === difficulty
    
    return matchesQuery && matchesCategory && matchesDifficulty
  })
}

export const getRecipeBySlug = (slug: string): Recipe | null => {
  return mockRecipes.find(recipe => recipe.slug === slug) || null
}

export const consolidateIngredients = (recipeIds: string[]): ShoppingListItem[] => {
  const recipes = getRecipesByIds(recipeIds)
  const ingredientMap = new Map<string, ShoppingListItem>()
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase()
      
      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!
        // Simple consolidation - in real app would handle unit conversion
        existing.amount = `${existing.amount} + ${ingredient.amount}`
      } else {
        ingredientMap.set(key, {
          id: `${recipe.id}-${ingredient.id}`,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          category: 'Diversos', // Would categorize properly in real app
          purchased: false,
          recipeId: recipe.id
        })
      }
    })
  })
  
  return Array.from(ingredientMap.values())
}
