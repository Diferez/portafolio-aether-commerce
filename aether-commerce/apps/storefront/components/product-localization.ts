import type { Product } from "@aether/schemas";
import type { Locale } from "@aether/i18n";

const spanishProductCopy: Record<string, { category?: string; description?: string }> = {
  "aether-arc-laptop": {
    category: "Portatiles",
    description: "Un ultrabook de magnesio pensado para fundadores, disenadores y equipos que trabajan con IA."
  },
  "aether-dock-studio": {
    category: "Accesorios",
    description: "Un hub compacto de escritorio con energia, pantalla, red y conexiones rapidas de almacenamiento."
  },
  "aether-pulse-headset": {
    category: "Audio",
    description: "Audifonos de baja latencia para llamadas claras, viajes y sesiones de trabajo profundo."
  }
};

const spanishCategoryNames: Record<string, string> = {
  laptops: "Portatiles",
  accessories: "Accesorios",
  electronics: "Electronica",
  furniture: "Muebles",
  shoes: "Calzado",
  miscellaneous: "Miscelaneos",
  audio: "Audio",
  clothes: "Ropa",
  clothing: "Ropa",
  technology: "Productos",
  home: "Hogar"
};

export function getLocalizedProduct(product: Product, locale: Locale) {
  const copy = locale === "es" ? spanishProductCopy[product.slug] : undefined;
  const category = spanishCategoryNames[product.category.slug] ?? product.category.name;
  const spanishDescription =
    copy?.description ??
    `Producto curado de ${category.toLowerCase()} seleccionado para la demo Aether, con datos normalizados, precio validado e imagen revisada.`;

  return {
    category: locale === "es" ? copy?.category ?? category : product.category.name,
    description: locale === "es" ? spanishDescription : product.description
  };
}
