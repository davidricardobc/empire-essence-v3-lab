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

const productSpecificAliases: Record<string, string[]> = {
  "p-virtud": ["carolina herrera good girl blanca", "good girl blanca", "good girl white", "blanca"],
  "p-manhattan": [
    "caro herrera new york",
    "carolina herrera new york",
    "carolina herrera nueva york",
    "212 new york",
    "212 nyc",
  ],
  "p-intensidad": ["hugo bosss deep red", "hugo boss deep red", "boss deep red"],
  "p-costa": ["light blue fem", "light blue femenina", "light blue mujer", "dolce gabbana light blue mujer"],
  "p-cumbre": ["creed silver", "silver mountain water", "silver mountain"],
  "p-oud-wood": ["oud wood", "tom ford oud", "tom ford oud wood"],
  "p-tobacco-vanille": [
    "tobacco vanille",
    "tobacco vanilla",
    "tabacco vanille",
    "tabaco vainilla",
    "tom ford tobacco",
  ],
  "p-kirke": ["kirke", "tiziana kirke", "tiziana terenzi kirke"],
  "p-nube": ["cloud", "ariana cloud", "ariana grande cloud"],
  "p-burbuja": ["toy bubblegum", "toy bubble gum", "moschino toy bubblegum", "moschino toy 2"],
  "p-pascal": ["jean pascal"],
  "p-santuario": ["al haramain amber oud", "amber oud original", "amber oud"],
  "p-rubi": ["al haramain amber oud ruby", "amber oud ruby edition", "amber oud ruby", "ruby edition"],
  "p-unidad": ["ck one", "calvin klein one", "calvin klein ck one", "unisex limpio", "unisex fresco"],
  "p-lienzo": ["lacoste blanc", "lacoste blanco", "lacoste white", "l1212 blanc", "l 12 12 blanc"],
  "p-eternidad": ["chanel no 5", "chanel n5", "chanel numero 5", "no 5", "n5"],
  "p-monarca": ["bharara king", "king bharara"],
  "p-coraza": ["diesel only", "diesel only the brave", "only the brave", "only brave"],
  "p-deriva": ["bvlgari aqva", "bulgari aqva", "aqva pour homme", "aqua pour homme"],
  "p-marea": ["bvlgari aqva marine", "bulgari aqva marine", "aqva marine", "aqua marine"],
  "p-travesia": ["nautica voyage", "voyage nautica"],
  "p-enigma": ["armani code", "giorgio armani code", "code armani"],
  "p-brisa": ["paris hilton for men", "paris hilton hombre", "paris hilton men"],
  "p-adrenalina": ["hugo boss sport", "boss bottled sport", "boss sport"],
  "p-horizonte": ["hugo boss unlimited", "boss bottled unlimited", "boss unlimited"],
  "p-penumbra": ["hugo boss night", "boss bottled night", "boss night"],
  "p-distincion": ["eau de cartier", "cartier eau", "cartier unisex"],
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
    ...(productSpecificAliases[product.id] ?? []),
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

function scoreProductSpecificAlias(product: Product, tokenGroups: TokenGroup[]) {
  const aliases = productSpecificAliases[product.id];
  if (!aliases?.length || !tokenGroups.length) return 0;

  const queryTokens = new Set(tokenGroups.map((group) => group[0]));
  const matchesAlias = aliases.some((alias) => {
    const aliasTokens = normalizeSearchText(alias)
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    return aliasTokens.every((token) => queryTokens.has(token));
  });

  return matchesAlias ? 10 : 0;
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
  }, scoreProductSpecificAlias(product, tokenGroups));
}

export function productMatchesAllSearchTerms(product: Product, tokenGroups: TokenGroup[]) {
  if (!tokenGroups.length) return true;

  return tokenGroups.every((group) => group.some((token) => productContainsSearchToken(product, token)));
}
