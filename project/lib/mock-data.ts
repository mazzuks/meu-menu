// NADA de "use client" aqui!

/**
 * Mock data for Meu Menu app
 * Dados mockados para o app Meu Menu
 */

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  prepTime: number; // minutes / minutos
  difficulty: "Fácil" | "Médio" | "Difícil";
  servings: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  optional?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  purchased: boolean;
  recipeId?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface SpecialDate {
  date: string; // MM-DD
  title: string;
  themeColor: string;
  recipes: string[]; // recipe IDs
  description: string;
}

// ==============================
// MOCK DATA
// ==============================

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    slug: "pizza-margherita",
    title: "Pizza Margherita",
    description:
      "Pizza clássica italiana com molho de tomate, mussarela e manjericão fresco",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
    prepTime: 45,
    difficulty: "Médio",
    servings: 4,
    category: "Italiana",
    tags: ["pizza", "italiana", "vegetariana"],
    ingredients: [
      { id: "1", name: "Massa de pizza", amount: "1", unit: "unidade" },
      { id: "2", name: "Molho de tomate", amount: "200", unit: "ml" },
      { id: "3", name: "Mussarela", amount: "200", unit: "g" },
      { id: "4", name: "Manjericão fresco", amount: "10", unit: "folhas" },
      { id: "5", name: "Azeite", amount: "2", unit: "colheres de sopa" },
    ],
    instructions: [
      "Pré-aqueça o forno a 220°C",
      "Abra a massa de pizza em uma forma untada",
      "Espalhe o molho de tomate uniformemente",
      "Adicione a mussarela por toda a pizza",
      "Leve ao forno por 15-20 minutos até dourar",
      "Retire do forno e adicione o manjericão fresco",
      "Regue com azeite e sirva quente",
    ],
    nutrition: { calories: 280, protein: 12, carbs: 35, fat: 8 },
  },
  {
    id: "2",
    slug: "sopa-abobora",
    title: "Sopa de Abóbora",
    description: "Sopa cremosa e nutritiva de abóbora com gengibre",
    image:
      "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800",
    prepTime: 30,
    difficulty: "Fácil",
    servings: 4,
    category: "Brasileira",
    tags: ["sopa", "saudável", "vegetariana"],
    ingredients: [
      { id: "1", name: "Abóbora", amount: "500", unit: "g" },
      { id: "2", name: "Cebola", amount: "1", unit: "unidade" },
      { id: "3", name: "Gengibre", amount: "1", unit: "cm" },
      { id: "4", name: "Caldo de legumes", amount: "500", unit: "ml" },
      { id: "5", name: "Creme de leite", amount: "100", unit: "ml" },
    ],
    instructions: [
      "Descasque e corte a abóbora em cubos",
      "Refogue a cebola e o gengibre",
      "Adicione a abóbora e o caldo",
      "Cozinhe por 20 minutos até amolecer",
      "Bata no liquidificador até ficar cremoso",
      "Volte à panela, adicione o creme de leite",
      "Tempere com sal e pimenta a gosto",
    ],
    nutrition: { calories: 120, protein: 3, carbs: 18, fat: 4 },
  },
  {
    id: "3",
    slug: "churrasco-picanha",
    title: "Churrasco de Picanha",
    description:
      "Picanha grelhada no ponto perfeito com farofa e vinagrete",
    image:
      "https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800",
    prepTime: 60,
    difficulty: "Médio",
    servings: 6,
    category: "Brasileira",
    tags: ["churrasco", "carne", "fim de semana"],
    ingredients: [
      { id: "1", name: "Picanha", amount: "1", unit: "kg" },
      { id: "2", name: "Sal grosso", amount: "3", unit: "colheres de sopa" },
      { id: "3", name: "Farinha de mandioca", amount: "200", unit: "g" },
      { id: "4", name: "Tomate", amount: "3", unit: "unidades" },
      { id: "5", name: "Cebola roxa", amount: "1", unit: "unidade" },
    ],
    instructions: [
      "Tempere a picanha com sal grosso 30 min antes",
      "Acenda o carvão e espere formar brasas",
      "Grelhe a picanha por 15 min de cada lado",
      "Prepare a farofa refogando a farinha",
      "Corte tomate e cebola para o vinagrete",
      "Deixe a carne descansar 5 minutos",
      "Corte em fatias e sirva com acompanhamentos",
    ],
    nutrition: { calories: 420, protein: 35, carbs: 5, fat: 28 },
  },
  // ... (mantenha aqui todas as outras receitas 4..20 exatamente como você já tinha)
  // Para encurtar, omiti no snippet — mas coloque TODAS as receitas do seu arquivo anterior.
];

export const specialDates: SpecialDate[] = [
  {
    date: "01-01",
    title: "Ano Novo",
    themeColor: "#FFD700",
    recipes: ["5"], // Feijoada
    description:
      "Comece o ano com sorte! Lentilha e uva não podem faltar.",
  },
];

export const mockShoppingList: ShoppingListItem[] = [
  {
    id: "1",
    name: "Tomate",
    amount: "1",
    unit: "kg",
    category: "Hortifruti",
    purchased: false,
  },
  {
    id: "2",
    name: "Mussarela",
    amount: "200",
    unit: "g",
    category: "Laticínios",
    purchased: true,
  },
  {
    id: "3",
    name: "Massa de pizza",
    amount: "1",
    unit: "pacote",
    category: "Massas",
    purchased: false,
  },
  {
    id: "4",
    name: "Manjericão",
    amount: "1",
    unit: "maço",
    category: "Hortifruti",
    purchased: false,
  },
  {
    id: "5",
    name: "Azeite",
    amount: "1",
    unit: "garrafa",
    category: "Condimentos",
    purchased: true,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Supermercado ABC",
    amount: 127.5,
    category: "Alimentação",
    date: "2025-01-02",
  },
  {
    id: "2",
    description: "Padaria do João",
    amount: 15.8,
    category: "Padaria",
    date: "2025-01-02",
  },
  {
    id: "3",
    description: "Feira livre",
    amount: 45.2,
    category: "Hortifruti",
    date: "2025-01-01",
  },
  {
    id: "4",
    description: "Açougue Central",
    amount: 89.9,
    category: "Carnes",
    date: "2024-12-30",
  },
  {
    id: "5",
    description: "Mercado XYZ",
    amount: 203.45,
    category: "Alimentação",
    date: "2024-12-28",
  },
];

// ==============================
// HELPERS
// ==============================

export const getRecipesByIds = (ids: string[]): Recipe[] => {
  return mockRecipes.filter((recipe) => ids.includes(recipe.id));
};

export const searchRecipes = (
  query: string,
  category?: string,
  difficulty?: Recipe["difficulty"]
): Recipe[] => {
  const q = (query || "").trim().toLowerCase();

  return mockRecipes.filter((recipe) => {
    const matchesQuery =
      !q ||
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesCategory = !category || recipe.category === category;
    const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;

    return matchesQuery && matchesCategory && matchesDifficulty;
  });
};

export const getRecipeBySlug = (slug: string): Recipe | null => {
  return mockRecipes.find((recipe) => recipe.slug === slug) || null;
};

export const consolidateIngredients = (
  recipeIds: string[]
): ShoppingListItem[] => {
  const recipes = getRecipesByIds(recipeIds);
  const ingredientMap = new Map<string, ShoppingListItem>();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase();

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        // Consolidação simples — em app real faria conversão de unidades
        existing.amount = `${existing.amount} + ${ingredient.amount}`;
      } else {
        ingredientMap.set(key, {
          id: `${recipe.id}-${ingredient.id}`,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          category: "Diversos",
          purchased: false,
          recipeId: recipe.id,
        });
      }
    });
  });

  return Array.from(ingredientMap.values());
};

// Recomenda receitas pelos ingredientes selecionados
export function getTopRecipesByIngredients(
  selected: string[],
  maxResults = 10
): Recipe[] {
  const selectedLower = (selected || [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const scoredRecipes = mockRecipes.map((recipe) => {
    const recipeIngs = (recipe.ingredients || []).map((i) =>
      i.name.trim().toLowerCase()
    );
    const matches = selectedLower.filter((s) => recipeIngs.includes(s)).length;
    const score = matches;
    return { recipe, score };
  });

  return scoredRecipes
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.recipe);
}
