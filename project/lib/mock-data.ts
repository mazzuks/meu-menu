// ===== Helpers corrigidos (cole após seus arrays) =====

// Retorna receitas por IDs
export const getRecipesByIds = (ids: string[]): Recipe[] => {
  return mockRecipes.filter((recipe) => ids.includes(recipe.id));
};

// Busca simples por título/descrição/tags + filtros
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
      recipe.tags.some((t) => t.toLowerCase().includes(q));

    const matchesCategory = !category || recipe.category === category;
    const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;

    return matchesQuery && matchesCategory && matchesDifficulty;
  });
};

// Busca por slug
export const getRecipeBySlug = (slug: string): Recipe | null => {
  return mockRecipes.find((r) => r.slug === slug) || null;
};

// Consolida ingredientes de várias receitas (sem conversão de unidades)
export const consolidateIngredients = (recipeIds: string[]): ShoppingListItem[] => {
  const recipes = getRecipesByIds(recipeIds);
  const ingredientMap = new Map<string, ShoppingListItem>();

  recipes.forEach((recipe) => {
    (recipe.ingredients || []).forEach((ingredient) => {
      const key = ingredient.name.trim().toLowerCase();

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        // Simples soma “textual” (mantém unidades separadas)
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

// Recomenda top receitas pelos ingredientes selecionados (corrigido para Ingredient[])
export function getTopRecipesByIngredients(
  selected: string[],
  maxResults = 10
): Recipe[] {
  const selectedLower = (selected ?? [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const scored = mockRecipes.map((recipe) => {
    // cada ingrediente é um objeto; usamos o "name"
    const ingredientNames = (recipe.ingredients ?? [])
      .map((i) => i.name?.trim().toLowerCase())
      .filter(Boolean) as string[];

    // conta ingredientes distintos que batem
    const matchCount = new Set(
      selectedLower.filter((s) => ingredientNames.includes(s))
    ).size;

    return { recipe, score: matchCount };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((x) => x.recipe);
}
