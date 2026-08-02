import type { Product } from "@/types/product";

type TokenGroup = string[];

const citrusAliases = [
  "citric",
  "citrico",
  "citrica",
  "citricos",
  "citricas",
  "citrus",
  "limon",
  "lima",
  "bergamota",
  "pomelo",
  "toronja",
  "mandarina",
  "naranja",
  "clementina",
  "yuzu",
  "citron",
  "neroli",
  "petit grain",
];

const partyAliases = [
  "fiesta",
  "rumba",
  "discoteca",
  "party",
  "celebracion",
  "vip",
  "champan",
  "ron",
  "vodka",
  "ginebra",
  "noche",
  "eventos",
];

const masculineAliases = [
  "hombre",
  "hombres",
  "masculino",
  "masculina",
  "masculinos",
  "masculinas",
  "caballero",
  "caballeros",
  "esposo",
  "novio",
  "padre",
];

const feminineAliases = [
  "mujer",
  "mujeres",
  "femenino",
  "femenina",
  "femeninos",
  "femeninas",
  "dama",
  "damas",
  "esposa",
  "novia",
  "madre",
];

const freshAliases = ["fresco", "fresca", "frescos", "frescas", "fresh", "limpio", "limpia"];

const aquaticAliases = [
  "acuatico",
  "acuatica",
  "acuaticos",
  "acuaticas",
  "marino",
  "marina",
  "marinos",
  "marinas",
  "oceanico",
  "oceanica",
];

const saltyAliases = ["sal", "salado", "salada", "salados", "saladas", "salino", "salina", "salinos", "salinas"];

const aliases: Record<string, string[]> = {
  citrico: citrusAliases,
  citrica: citrusAliases,
  citricos: citrusAliases,
  citrus: citrusAliases,
  fiesta: partyAliases,
  hombre: masculineAliases,
  hombres: masculineAliases,
  masculino: masculineAliases,
  masculina: masculineAliases,
  masculinos: masculineAliases,
  masculinas: masculineAliases,
  caballero: masculineAliases,
  caballeros: masculineAliases,
  esposo: masculineAliases,
  novio: masculineAliases,
  padre: masculineAliases,
  mujer: feminineAliases,
  mujeres: feminineAliases,
  femenino: feminineAliases,
  femenina: feminineAliases,
  femeninos: feminineAliases,
  femeninas: feminineAliases,
  dama: feminineAliases,
  damas: feminineAliases,
  esposa: feminineAliases,
  novia: feminineAliases,
  madre: feminineAliases,
  fresco: freshAliases,
  fresca: freshAliases,
  frescos: freshAliases,
  frescas: freshAliases,
  fresh: freshAliases,
  limpio: freshAliases,
  limpia: freshAliases,
  acuatico: aquaticAliases,
  acuatica: aquaticAliases,
  acuaticos: aquaticAliases,
  acuaticas: aquaticAliases,
  marino: aquaticAliases,
  marina: aquaticAliases,
  marinos: aquaticAliases,
  marinas: aquaticAliases,
  oceanico: aquaticAliases,
  oceanica: aquaticAliases,
  sal: saltyAliases,
  salado: saltyAliases,
  salada: saltyAliases,
  salados: saltyAliases,
  saladas: saltyAliases,
  salino: saltyAliases,
  salina: saltyAliases,
  salinos: saltyAliases,
  salinas: saltyAliases,
};

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function buildProductSearchText(product: Product) {
  const rawText = [
    product.publicName,
    product.inspirationReference,
    product.category,
    product.collection,
    product.shortDescription,
    product.longDescription,
    product.bestFor,
    product.concentration,
    product.duration,
    product.intensity,
    product.sillage,
    ...product.families,
    ...product.moods,
    ...product.occasions,
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ].join(" ");

  const normalized = normalizeSearchText(rawText);
  const citrusAlias = normalized.includes("citric") ? " citrico citrica citricos citricas citrus" : "";
  return `${normalized}${citrusAlias}`;
}

function buildProductSearchTokens(product: Product) {
  return new Set(buildProductSearchText(product).split(/[^a-z0-9]+/).filter(Boolean));
}

function productContainsSearchToken(product: Product, token: string) {
  const normalizedToken = normalizeSearchText(token);

  if (normalizedToken.length <= 3) {
    return buildProductSearchTokens(product).has(normalizedToken);
  }

  return buildProductSearchText(product).includes(normalizedToken);
}

export function getSearchTokenGroups(query: string): TokenGroup[] {
  return normalizeSearchText(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((token) => aliases[token] ?? [token]);
}

export function scoreProductSearch(product: Product, tokenGroups: TokenGroup[]) {
  if (!tokenGroups.length) return 1;

  return tokenGroups.reduce((score, group) => {
    const matchedAlias = group.find((token) => productContainsSearchToken(product, token));
    return matchedAlias ? score + (matchedAlias === group[0] ? 2 : 1) : score;
  }, 0);
}

export function productMatchesAllSearchTerms(product: Product, tokenGroups: TokenGroup[]) {
  if (!tokenGroups.length) return true;

  return tokenGroups.every((group) => group.some((token) => productContainsSearchToken(product, token)));
}
