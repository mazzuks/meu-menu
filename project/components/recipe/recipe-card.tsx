"use client";

import Image from "next/image";
import * as React from "react";
import type { Recipe } from "@/lib/mock-data";

type Props = {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
};

export function RecipeCard({ recipe, onClick, className }: Props) {
  return (
    <div
      className={`rounded-lg border overflow-hidden hover:shadow-md transition ${className || ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="relative h-40 w-full">
        {/* Se quiser, troque para <img src=...> para simplificar */}
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold">{recipe.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {recipe.description}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          {recipe.prepTime} min • {recipe.difficulty} • {recipe.servings} porções
        </div>
      </div>
    </div>
  );
}
