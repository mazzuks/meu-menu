// --- dados simulados ---
export const mockRecipes = [
  // ...suas receitas
]

// --- função para recomendar receitas ---
export function getTopRecipesByIngredients(selected: string[], maxResults = 10) {
  const selectedLower = (selected || []).map(s => s.trim().toLowerCase());

  // Calcula pontuação por receita
  const scoredRecipes = mockRecipes.map((recipe) => {
    const recipeIngs = (recipe.ingredients || []).map((i: string) => i.trim().toLowerCase());
    const matches = selectedLower.filter(s => recipeIngs.includes(s)).length;

    // regra simples de pontuação
    const score = matches;

    return { recipe, score };
  });

  // Retorna as melhores receitas
  return scoredRecipes
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.recipe);
}

// --- outros mocks ---
export const mockShoppingList = [
  // ...
]

export const mockExpenses = [
  // ...
]
