// project/lib/image-helpers.ts
import type { Recipe } from "@/lib/types";

/**
 * Gera um slug simples:
 * - lowercase
 * - remove acentos
 * - substitui espaços por "-"
 * - remove caracteres não alfanuméricos
 */
export function slugify(input: string = ""): string {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Retorna a URL da imagem da receita seguindo prioridade:
 * 1) recipe.imageUrl (absoluta ou relativa)
 * 2) /images/recipes/<slug>.jpg (local)
 * 3) /images/categories/<categoria>.jpg (local)
 * 4) /images/recipes/_placeholder.jpg (fallback)
 */
export function getRecipeImage(
  recipe: Partial<Recipe> & { title?: string }
): string {
  // 1) Se já veio URL explícita, usa
  if (recipe.imageUrl && recipe.imageUrl.trim().length > 0) {
    return recipe.imageUrl;
  }

  // 2) Caminho local por slug
  const slug = recipe.slug || (recipe.title ? slugify(recipe.title) : "");
  if (slug) {
    return `/images/recipes/${slug}.jpg`;
  }

  // 3) Fallback por categoria
  if (recipe.category) {
    return `/images/categories/${slugify(recipe.category)}.jpg`;
  }

  // 4) Fallback geral
  return "/images/recipes/_placeholder.jpg";
}
