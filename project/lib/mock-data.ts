// Recomenda receitas pelos ingredientes selecionados
export function getTopRecipesByIngredients(selected: string[], maxResults = 10) {
  const selectedLower = (selected || []).map(s => s.trim().toLowerCase());

  // Calcula pontuação por receita
  const scoredRecipes = mockRecipes.map((recipe) => {
    const recipeIngs = (recipe.ingredients || []).map((i: string) => i.trim().toLowerCase());
    const matches = selectedLower.filter(s => recipeIngs.includes(s)).length;

    // regra simples de pontuação (ajuste se quiser)
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
