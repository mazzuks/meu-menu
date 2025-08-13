// lib/mock-data.ts

export type Ingredient = {
  id: string;
  name: string;
  amount: string; // manter como string: '2', '300', '1.5' etc.
  unit: string;
};

export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | string;
  servings: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
};

// ---> SEUS ITENS (21–32) <---
export const mockRecipes: Recipe[] = [
  {
    id: '21',
    slug: 'bibimbap',
    title: 'Bibimbap',
    description: 'Arroz coreano com legumes, carne e gochujang',
    image: 'https://images.pexels.com/photos/2067420/pexels-photo-2067420.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 40,
    difficulty: 'Médio',
    servings: 2,
    category: 'Coreana',
    tags: ['coreana', 'arroz', 'picante', 'legumes'],
    ingredients: [
      { id: '1', name: 'Arroz cozido', amount: '2', unit: 'xícaras' },
      { id: '2', name: 'Legumes sortidos', amount: '300', unit: 'g' },
      { id: '3', name: 'Carne bovina fatiada', amount: '200', unit: 'g' },
      { id: '4', name: 'Gochujang', amount: '2', unit: 'colheres' }
    ],
    instructions: [
      'Salteie os legumes e a carne separadamente',
      'Monte o bowl com arroz por baixo',
      'Distribua legumes e carne por cima',
      'Finalize com gochujang e ovo frito',
      'Misture tudo ao servir'
    ],
    nutrition: { calories: 520, protein: 26, carbs: 68, fat: 16 }
  },
  {
    id: '22',
    slug: 'kimchi-jjigae',
    title: 'Kimchi Jjigae',
    description: 'Ensopado coreano de kimchi com tofu',
    image: 'https://images.pexels.com/photos/4198023/pexels-photo-4198023.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 30,
    difficulty: 'Médio',
    servings: 4,
    category: 'Coreana',
    tags: ['ensopado', 'tofu', 'kimchi'],
    ingredients: [
      { id: '1', name: 'Kimchi', amount: '2', unit: 'xícaras' },
      { id: '2', name: 'Tofu firme', amount: '300', unit: 'g' },
      { id: '3', name: 'Caldo', amount: '600', unit: 'ml' },
      { id: '4', name: 'Cebolinha', amount: '2', unit: 'unidades' }
    ],
    instructions: [
      'Refogue o kimchi',
      'Adicione o caldo e ferva',
      'Junte o tofu em cubos',
      'Cozinhe por 10 minutos',
      'Finalize com cebolinha'
    ],
    nutrition: { calories: 210, protein: 14, carbs: 14, fat: 10 }
  },
  {
    id: '23',
    slug: 'asado-argentino',
    title: 'Asado Argentino',
    description: 'Grelhados variados no estilo argentino',
    image: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 120,
    difficulty: 'Difícil',
    servings: 6,
    category: 'Argentina',
    tags: ['churrasco', 'carne', 'parrilla'],
    ingredients: [
      { id: '1', name: 'Cortes bovinos', amount: '1.5', unit: 'kg' },
      { id: '2', name: 'Sal grosso', amount: '2', unit: 'colheres' },
      { id: '3', name: 'Linguiça', amount: '400', unit: 'g' },
      { id: '4', name: 'Chimichurri', amount: '4', unit: 'colheres' }
    ],
    instructions: [
      'Acenda a brasa e estabilize o calor',
      'Tempere a carne com sal',
      'Grelhe lentamente os cortes',
      'Pincele chimichurri ao final',
      'Descanse e sirva'
    ],
    nutrition: { calories: 680, protein: 55, carbs: 4, fat: 48 }
  },
  {
    id: '24',
    slug: 'empanadas-saltenas',
    title: 'Empanadas Salteñas',
    description: 'Empanadas argentinas recheadas de carne',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 60,
    difficulty: 'Médio',
    servings: 4,
    category: 'Argentina',
    tags: ['empanada', 'forno'],
    ingredients: [
      { id: '1', name: 'Massa para empanada', amount: '12', unit: 'discos' },
      { id: '2', name: 'Carne moída', amount: '400', unit: 'g' },
      { id: '3', name: 'Cebola', amount: '1', unit: 'unidade' },
      { id: '4', name: 'Ovos cozidos', amount: '2', unit: 'unidades' }
    ],
    instructions: [
      'Refogue carne e cebola',
      'Recheie os discos',
      'Feche e pincele ovo',
      'Asse até dourar',
      'Sirva quente'
    ],
    nutrition: { calories: 460, protein: 22, carbs: 44, fat: 22 }
  },
  {
    id: '25',
    slug: 'mapo-tofu',
    title: 'Mapo Tofu',
    description: 'Tofu apimentado com carne moída ao estilo Sichuan',
    image: 'https://images.pexels.com/photos/4198029/pexels-photo-4198029.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 25,
    difficulty: 'Médio',
    servings: 4,
    category: 'Chinesa',
    tags: ['tofu', 'picante', 'sichuan'],
    ingredients: [
      { id: '1', name: 'Tofu macio', amount: '400', unit: 'g' },
      { id: '2', name: 'Carne moída', amount: '200', unit: 'g' },
      { id: '3', name: 'Doubanjiang', amount: '1', unit: 'colher' },
      { id: '4', name: 'Caldo', amount: '300', unit: 'ml' }
    ],
    instructions: [
      'Refogue a carne com doubanjiang',
      'Adicione caldo',
      'Junte o tofu e aqueça sem quebrar',
      'Engrosse levemente',
      'Sirva com cebolinha'
    ],
    nutrition: { calories: 320, protein: 22, carbs: 14, fat: 18 }
  },
  {
    id: '26',
    slug: 'chow-mein-franco',
    title: 'Chow Mein de Frango',
    description: 'Macarrão frito chinês com legumes e frango',
    image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 20,
    difficulty: 'Fácil',
    servings: 3,
    category: 'Chinesa',
    tags: ['massa', 'wok', 'rápido'],
    ingredients: [
      { id: '1', name: 'Macarrão para yakisoba', amount: '250', unit: 'g' },
      { id: '2', name: 'Frango em tiras', amount: '250', unit: 'g' },
      { id: '3', name: 'Legumes fatiados', amount: '300', unit: 'g' },
      { id: '4', name: 'Molho de soja', amount: '2', unit: 'colheres' }
    ],
    instructions: [
      'Cozinhe o macarrão',
      'Salteie frango e legumes',
      'Junte o macarrão e tempere',
      'Salteie rápido e sirva',
      'Finalize com gergelim'
    ],
    nutrition: { calories: 430, protein: 26, carbs: 58, fat: 12 }
  },
  {
    id: '27',
    slug: 'bacalhau-bras',
    title: 'Bacalhau à Brás',
    description: 'Clássico português de bacalhau desfiado com batata e ovos',
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 35,
    difficulty: 'Médio',
    servings: 4,
    category: 'Portuguesa',
    tags: ['bacalhau', 'portuguesa'],
    ingredients: [
      { id: '1', name: 'Bacalhau dessalgado', amount: '400', unit: 'g' },
      { id: '2', name: 'Batata palha', amount: '200', unit: 'g' },
      { id: '3', name: 'Ovos', amount: '4', unit: 'unidades' },
      { id: '4', name: 'Cebola', amount: '1', unit: 'unidade' }
    ],
    instructions: [
      'Refogue cebola e bacalhau',
      'Adicione batata palha',
      'Junte ovos mexendo',
      'Acerte o sal',
      'Finalize com salsinha'
    ],
    nutrition: { calories: 510, protein: 34, carbs: 32, fat: 24 }
  },
  {
    id: '28',
    slug: 'pastel-de-nata',
    title: 'Pastel de Nata',
    description: 'Doce português com creme e massa folhada',
    image: 'https://images.pexels.com/photos/461426/pexels-photo-461426.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 45,
    difficulty: 'Médio',
    servings: 6,
    category: 'Portuguesa',
    tags: ['doce', 'sobremesa'],
    ingredients: [
      { id: '1', name: 'Massa folhada', amount: '1', unit: 'rolo' },
      { id: '2', name: 'Leite', amount: '500', unit: 'ml' },
      { id: '3', name: 'Gemas', amount: '6', unit: 'unidades' },
      { id: '4', name: 'Açúcar', amount: '150', unit: 'g' }
    ],
    instructions: [
      'Forre as forminhas com massa',
      'Prepare o creme',
      'Preencha as formas',
      'Asse até dourar',
      'Sirva com canela'
    ],
    nutrition: { calories: 320, protein: 7, carbs: 38, fat: 15 }
  },
  {
    id: '29',
    slug: 'salada-grega',
    title: 'Salada Grega',
    description: 'Tomate, pepino, azeitonas, cebola roxa e queijo feta',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 15,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Mediterrânea',
    tags: ['salada', 'feta', 'azeitonas'],
    ingredients: [
      { id: '1', name: 'Tomate', amount: '2', unit: 'unidades' },
      { id: '2', name: 'Pepino', amount: '1', unit: 'unidade' },
      { id: '3', name: 'Azeitonas', amount: '80', unit: 'g' },
      { id: '4', name: 'Queijo feta', amount: '100', unit: 'g' }
    ],
    instructions: [
      'Corte os legumes',
      'Misture com azeite e orégano',
      'Adicione o feta',
      'Acerte o sal',
      'Sirva fresca'
    ],
    nutrition: { calories: 220, protein: 8, carbs: 14, fat: 15 }
  },
  {
    id: '30',
    slug: 'kibe-forno',
    title: 'Kibe de Forno',
    description: 'Kibe assado com carne e trigo para quibe',
    image: 'https://images.pexels.com/photos/5949889/pexels-photo-5949889.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 50,
    difficulty: 'Médio',
    servings: 6,
    category: 'Árabe',
    tags: ['árabe', 'forno'],
    ingredients: [
      { id: '1', name: 'Trigo para quibe', amount: '250', unit: 'g' },
      { id: '2', name: 'Carne moída', amount: '500', unit: 'g' },
      { id: '3', name: 'Hortelã', amount: '2', unit: 'colheres' },
      { id: '4', name: 'Cebola', amount: '1', unit: 'unidade' }
    ],
    instructions: [
      'Hidrate o trigo',
      'Misture com a carne e temperos',
      'Leve à assadeira',
      'Asse até dourar',
      'Sirva com coalhada'
    ],
    nutrition: { calories: 480, protein: 32, carbs: 36, fat: 22 }
  },
  {
    id: '31',
    slug: 'butter-chicken',
    title: 'Butter Chicken',
    description: 'Frango cremoso indiano ao molho de tomate e manteiga',
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 45,
    difficulty: 'Médio',
    servings: 4,
    category: 'Indiana',
    tags: ['curry', 'frango'],
    ingredients: [
      { id: '1', name: 'Peito de frango', amount: '500', unit: 'g' },
      { id: '2', name: 'Molho de tomate', amount: '300', unit: 'ml' },
      { id: '3', name: 'Creme de leite', amount: '150', unit: 'ml' },
      { id: '4', name: 'Manteiga', amount: '2', unit: 'colheres' }
    ],
    instructions: [
      'Tempere e sele o frango',
      'Adicione molho e especiarias',
      'Junte manteiga e creme',
      'Cozinhe até engrossar',
      'Sirva com arroz'
    ],
    nutrition: { calories: 560, protein: 38, carbs: 18, fat: 34 }
  },
  {
    id: '32',
    slug: 'ceviche-classico',
    title: 'Ceviche Clássico',
    description: 'Ceviche peruano de peixe branco com limão e coentro',
    image: 'https://images.pexels.com/photos/6287527/pexels-photo-6287527.jpeg?auto=compress&cs=tinysrgb&w=800',
    prepTime: 25,
    difficulty: 'Fácil',
    servings: 4,
    category: 'Peruana',
    tags: ['peixe', 'cítrico', 'frio'],
    ingredients: [
      { id: '1', name: 'Peixe branco', amount: '400', unit: 'g' },
      { id: '2', name: 'Suco de limão', amount: '120', unit: 'ml' },
      { id: '3', name: 'Cebola roxa', amount: '1', unit: 'unidade' },
      { id: '4', name: 'Coentro', amount: '2', unit: 'colheres' }
    ],
    instructions: [
      'Corte o peixe em cubos',
      'Marine no limão por 10–15 min',
      'Junte cebola e coentro',
      'Acerte o sal e pimenta',
      'Sirva gelado'
    ],
    nutrition: { calories: 240, protein: 28, carbs: 10, fat: 8 }
  }
];

export default mockRecipes;
