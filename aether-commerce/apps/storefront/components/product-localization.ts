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
  audio: "Audio"
};

export function getLocalizedProduct(product: Product, locale: Locale) {
  const copy = locale === "es" ? spanishProductCopy[product.slug] : undefined;
  return {
    category: locale === "es" ? copy?.category ?? spanishCategoryNames[product.category.slug] ?? product.category.name : product.category.name,
    description: copy?.description ?? product.description
  };
}
