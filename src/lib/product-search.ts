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
  "p-audacia": ["montblanc legend red", "legend red", "mont blanc red"],
  "p-sombra": ["bvlgari man in black", "bulgari man in black", "man in black"],
  "p-fortuna": ["one million lucky", "1 million lucky", "paco rabanne lucky", "rabanne lucky"],
  "p-brujula": ["montblanc legend spirit", "legend spirit", "mont blanc spirit"],
  "p-cadencia": ["chanel allure homme sport", "allure homme sport", "allure sport"],
  "p-coraje": ["diesel spirit of the brave", "spirit of the brave"],
  "p-fervor": ["invictus intense", "paco rabanne invictus intense", "rabanne invictus intense"],
  "p-contraste": ["black xs angeles", "black xs los angeles", "black xs la"],
  "p-exceso": ["black xs exces", "black xs l exces", "black xs l'exces", "black xs excess"],
  "p-susurro": ["212 sexy men", "carolina herrera 212 sexy men", "212 sexy hombre"],
  "p-frenesi": ["212 vip men wild party", "212 vip wild party hombre", "wild party men"],
  "p-obsidiana": ["invictus onyx", "invictus onyx collector", "onyx invictus"],
  "p-sahara": ["ch men africa", "carolina herrera ch africa", "ch africa hombre"],
  "p-expedicion": ["swiss army", "victorinox swiss army", "swiss army classic"],
  "p-calma": ["polo blue", "ralph lauren polo blue"],
  "p-ignicion": ["polo red", "ralph lauren polo red"],
  "p-conexion": ["ck in2u him", "ck in2u hombre", "calvin klein in2u him", "calvin klein ck in2u"],
  "p-profundo": ["versace dylan blue", "dylan blue pour homme", "dylan blue hombre"],
  "p-llama": ["versace eros flame", "eros flame"],
  "p-raices": ["valentino born in roma", "valentino uomo born in roma", "born in roma uomo"],
  "p-rebote": ["212 heroes", "carolina herrera 212 heroes", "heroes 212"],
  "p-supremo": ["invictus victory elixir", "paco rabanne victory elixir", "rabanne victory elixir"],
  "p-triunfo": ["invictus victory", "paco rabanne invictus victory", "rabanne invictus victory"],
  "p-espectro": ["paco rabanne phantom", "rabanne phantom", "phantom perfume"],
  "p-herencia": ["jean marie farina", "roger gallet farina", "roger gallet jean marie farina"],
  "p-esencia": ["dolce gabbana the one men", "the one for men edp", "the one hombre"],
  "p-divergencia": ["hugo boss just different", "boss just different", "just different"],
  "p-chispa": ["hugo boss tonic", "boss bottled tonic", "boss tonic"],
  "p-rocio": ["lacoste eau fraiche", "lacoste blanc eau fraiche", "l1212 blanc eau fraiche"],
  "p-brio": ["lacoste blue", "lacoste bleu", "lacoste bleu powerful", "l1212 bleu"],
  "p-calidez": ["lacoste rouge", "lacoste l1212 rouge", "lacoste red rouge"],
  "p-sendero": ["hugo boss journey", "hugo urban journey", "boss urban journey"],
  "p-huella": ["hugo boss the scent", "boss the scent", "the scent hombre"],
  "p-escarcha": ["hugo boss iced", "hugo iced", "boss iced"],
  "p-vigor": ["lacoste red", "lacoste style in play", "style in play"],
  "p-sigilo": ["lacoste noir", "lacoste black", "lacoste l1212 noir"],
  "p-vitalidad": ["lacoste energized", "lacoste l1212 energized", "l1212 energized"],
  "p-pilar": ["lacoste essential", "essential lacoste"],
  "p-fluir": ["issey miyake", "l'eau d'issey pour homme", "leau dissey hombre"],
  "p-corriente": ["issey miyake majeure", "l'eau majeure d'issey", "leau majeure dissey"],
  "p-ceremonial": ["creed santal", "creed original santal", "original santal"],
  "p-lusitania": ["creed portugal", "creed bois du portugal", "bois du portugal"],
  "p-tierra": ["creed vetiver", "creed original vetiver", "original vetiver"],
  "p-soberano": ["creed millesime imperial", "millesime imperial", "creed imperial"],
  "p-pradera": ["creed green irish tweed", "green irish tweed", "irish tweed"],
  "p-tempestad": ["creed viking", "viking creed"],
  "p-ocaso": ["polo black", "ralph lauren polo black"],
  "p-permanencia": ["ck eternity men", "calvin klein eternity men", "eternity for men"],
  "p-existir": ["ck be", "calvin klein ck be", "calvin klein be"],
  "p-solsticio": ["ck one summer", "calvin klein ck one summer", "ck one summer 2013"],
  "p-solaz": ["tommy hilfiger", "tommy hilfiger tommy", "tommy men"],
  "p-abismo": ["acqua di gio profumo", "acqua profumo", "armani profumo"],
  "p-insignia": ["montblanc emblem", "mont blanc emblem", "emblem montblanc"],
  "p-leyenda": ["montblanc legend", "mont blanc legend", "legend montblanc"],
  "p-estela": ["versace man eau fraiche", "versace eau fraiche", "eau fraiche versace"],
  "p-gallardia": ["versace pour homme", "versace hombre"],
  "p-reinado": ["dolce gabbana k", "k dolce gabbana", "k by dolce gabbana", "dolce gabbana king"],
  "p-mediterraneo": ["dolce gabbana light blue homme", "light blue pour homme", "light blue hombre"],
  "p-costanera": ["light blue italian zest hombre", "light blue italian zest pour homme", "italian zest hombre"],
  "p-onix": ["212 vip black", "carolina herrera 212 vip black", "vip black"],
  "p-cazador": ["azzaro wanted", "wanted azzaro"],
  "p-jubilo": ["clinique happy men", "clinique happy for men", "happy hombre"],
  "p-giro": ["perry ellis 360 red", "360 red men", "360 red hombre"],
  "p-panorama": ["perry ellis 360", "360 men", "360 hombre"],
  "p-chispazo": ["tommy girl now", "tommy now girl", "tommy hilfiger girl now"],
  "p-antojo": ["ralph lauren big pony 2", "big pony 2", "big pony purple"],
  "p-riviera": ["light blue italian zest mujer", "light blue italian zest feminina", "dolce gabbana italian zest mujer"],
  "p-encanto": ["dolce gabbana the one mujer", "the one mujer", "the one feminine"],
  "p-amatista": ["bvlgari omnia amethyste", "bulgari omnia amethyste", "omnia amethyste"],
  "p-cristal": ["bvlgari omnia crystalline", "bulgari omnia crystalline", "omnia crystalline"],
  "p-oleada": ["perry ellis 360 mujer", "360 mujer", "360 femenina"],
  "p-ligereza": ["ralph lauren ralph", "ralph mujer", "ralph by ralph lauren"],
  "p-destello": ["lady million lucky", "paco rabanne lady million lucky", "rabanne lady million lucky"],
  "p-corona": ["lady million empire", "paco rabanne lady million empire", "rabanne lady million empire"],
  "p-coqueteo": ["victoria secret tease", "victoria's secret tease", "tease victoria secret"],
  "p-mimo": ["katy perry meow", "meow katy perry"],
  "p-caricia": ["katy perry purr", "purr katy perry"],
  "p-floracion": ["dkny fresh blossom", "be delicious fresh blossom", "dkny be delicious fresh blossom"],
  "p-hechizo": ["britney midnight fantasy", "britney spears midnight fantasy", "midnight fantasy"],
  "p-dulzura": ["ariana sweet like candy", "ariana grande sweet like candy", "sweet like candy"],
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
