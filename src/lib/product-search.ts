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

const aliases: Record<string, string[]> = {
  citrico: citrusAliases,
  citrica: citrusAliases,
  citricos: citrusAliases,
  citrus: citrusAliases,
  fiesta: partyAliases,
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

export function getSearchTokenGroups(query: string): TokenGroup[] {
  return normalizeSearchText(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((token) => aliases[token] ?? [token]);
}

export function scoreProductSearch(product: Product, tokenGroups: TokenGroup[]) {
  if (!tokenGroups.length) return 1;

  const haystack = buildProductSearchText(product);
  return tokenGroups.reduce((score, group) => {
    const matchedAlias = group.find((token) => haystack.includes(token));
    return matchedAlias ? score + (matchedAlias === group[0] ? 2 : 1) : score;
  }, 0);
}

export function productMatchesAllSearchTerms(product: Product, tokenGroups: TokenGroup[]) {
  if (!tokenGroups.length) return true;

  const haystack = buildProductSearchText(product);
  return tokenGroups.every((group) => group.some((token) => haystack.includes(token)));
}
