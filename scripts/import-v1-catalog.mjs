import fs from "fs";
import path from "path";
import vm from "vm";
import { execSync } from "child_process";

const repoRoot = process.cwd();
const v1Path = process.argv[2] ?? "/home/ricardo/.openclaw/workspace/empire-essence-web/index.html";
const currentProductsPath = path.join(repoRoot, "src/data/products.ts");
const outputJsonPath = path.join(repoRoot, "src/data/products.generated.json");

function toAscii(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00d7/g, "x")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return toAscii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function extractEvaluatedExpression(source, pattern, expressionName) {
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`No pude encontrar ${expressionName}`);
  }
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${match[0]}; globalThis.__out = ${expressionName};`, context);
  return context.__out;
}

function extractCurrentProducts(source) {
  const retailVariants = [
    "const retailVariants = (base, prices = [30000, 46000, 70000]) => [",
    "  { sizeMl: 30, sku: base + '-30', retailPriceCop: prices[0] },",
    "  { sizeMl: 50, sku: base + '-50', retailPriceCop: prices[1] },",
    "  { sizeMl: 100, sku: base + '-100', retailPriceCop: prices[2] },",
    "];",
  ].join("\n");
  const match = source.match(/export const products: Product\[\] = \[(.|\n|\r)*?\n\];/);
  if (!match) {
    throw new Error("No pude encontrar el arreglo actual de products");
  }
  const rewritten = match[0]
    .replace("export const products: Product[] =", "const products =");
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${retailVariants}\n${rewritten}\n globalThis.__out = products;`, context);
  return context.__out;
}

function buildFamilyDictionary(v1Source) {
  const raw = extractEvaluatedExpression(v1Source, /const NOTE_FAMILIES = \{(.|\n|\r)*?\n\};/, "NOTE_FAMILIES");
  return {
    amaderada: raw.amaderado,
    citric: raw["citrico"] ?? raw["cítrico"] ?? [],
    floral: raw.floral,
    dulce: raw.dulce,
    especiada: raw.especiado,
    acuatica: raw["acuatico"] ?? raw["acuático"] ?? [],
    oriental: raw.oriental,
    frutal: [
      "pina", "manzana", "pera", "durazno", "melocoton", "frambuesa", "maracuya", "grosella negra",
      "ciruela", "cereza", "mango", "melon", "lychee", "lichi", "frutas tropicales", "frutas jugosas",
      "frutas secas", "mandarina roja", "naranja sanguina"
    ],
    gourmand: [
      "cafe", "cacao", "praline", "caramelo", "miel", "azucar", "chocolate", "vainilla",
      "haba tonka", "regaliz", "almendra amarga", "notas gourmand"
    ],
    almizclada: ["almizcle", "almizcle blanco", "almizcle negro", "ambar gris", "ambroxan"],
    fresca: [
      "bergamota", "limon", "menta", "lavanda", "notas marinas", "notas acuaticas", "pomelo",
      "mandarina", "naranja", "romero", "te verde", "neroli"
    ],
  };
}

function inferFamilies(notes, dictionary) {
  const normalizedNotes = notes.map((note) => toAscii(note).toLowerCase());
  const scores = new Map();

  for (const [family, keywords] of Object.entries(dictionary)) {
    let score = 0;
    for (const note of normalizedNotes) {
      for (const keyword of keywords.map((item) => toAscii(item).toLowerCase())) {
        if (note.includes(keyword) || keyword.includes(note)) {
          score += 1;
        }
      }
    }
    if (score > 0) scores.set(family, score);
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([family]) => family);
  if (ranked.includes("citric") || ranked.includes("acuatica")) {
    if (!ranked.includes("fresca")) ranked.push("fresca");
  }
  return ranked.slice(0, 3);
}

function inferIntensity(product, families) {
  const notes = [...product.top, ...product.heart, ...product.base].map((note) => toAscii(note).toLowerCase());
  const warmKeywords = ["oud", "tabaco", "vainilla", "cuero", "ambar", "haba tonka", "pachuli", "incienso", "cacao", "cafe", "miel", "azafran"];
  const freshKeywords = ["bergamota", "limon", "mandarina", "notas marinas", "notas acuaticas", "menta", "lavanda", "te"];
  const warmScore = notes.reduce((sum, note) => sum + warmKeywords.filter((keyword) => note.includes(keyword)).length, 0);
  const freshScore = notes.reduce((sum, note) => sum + freshKeywords.filter((keyword) => note.includes(keyword)).length, 0);
  const desc = toAscii(product.desc).toLowerCase();

  if (warmScore >= 3 || /noche|intens|seductor|profund|opulent|magnet/.test(desc)) return "alta";
  if (freshScore >= 3 && warmScore === 0) return "suave";
  if (families.includes("oriental") || families.includes("gourmand")) return "alta";
  return "media";
}

function inferDuration(intensity) {
  if (intensity === "alta") return "8 a 10 horas";
  if (intensity === "suave") return "5 a 7 horas";
  return "6 a 8 horas";
}

function inferSillage(intensity, families) {
  if (intensity === "alta") return families.includes("oriental") ? "Profunda y envolvente" : "Marcada y memorable";
  if (intensity === "suave") return "Limpia y cercana";
  return "Equilibrada y agradable";
}

function inferOccasions(category, intensity, families) {
  if (intensity === "alta") return ["noche", "citas", "eventos"];
  if (families.includes("fresca") || families.includes("acuatica")) return ["diario", "oficina", "salidas"];
  if (category === "unisex") return ["eventos", "cenas", "ocasiones especiales"];
  return ["diario", "salidas", "citas"];
}

function inferMoods(category, intensity, families) {
  if (families.includes("dulce") && intensity === "alta") return ["seduccion", "impacto", "noche"];
  if (families.includes("fresca") || families.includes("acuatica")) return ["energia", "versatil", "confianza"];
  if (category === "femenina" && families.includes("floral")) return ["elegancia", "encanto", "femineidad"];
  if (category === "unisex" && families.includes("oriental")) return ["lujo", "misterio", "presencia"];
  return ["seguridad", "estilo", "presencia"];
}

function inferCollection(category, intensity, topSeller) {
  if (topSeller) return "top-ventas";
  if (category === "unisex") return "nicho";
  if (intensity === "alta") return "firma";
  return "diario";
}

function buildShortDescription(product, families, intensity) {
  const parts = [];
  if (families[0]) parts.push(families[0]);
  if (families[1]) parts.push(families[1]);
  parts.push(intensity === "alta" ? "con presencia fuerte" : intensity === "suave" ? "de lectura limpia" : "equilibrada y facil de llevar");
  return toAscii(parts.join(", ") + ".");
}

function buildLongDescription(product) {
  const desc = toAscii(product.desc);
  return desc.endsWith(".")
    ? `${desc} Inspirado en ${toAscii(product.inspired)} para clientes que quieren una referencia clara y facil de recomendar.`
    : `${desc}. Inspirado en ${toAscii(product.inspired)} para clientes que quieren una referencia clara y facil de recomendar.`;
}

function buildBestFor(category, occasions) {
  const audience = category === "femenina"
    ? "Clientes que buscan una fragancia femenina"
    : category === "masculina"
      ? "Clientes que buscan una fragancia masculina"
      : "Clientes que buscan una fragancia unisex";
  return `${audience} ideal para ${occasions.join(", ")}.`;
}

function buildVariants(slug, prices) {
  return [30, 50, 100].map((size) => ({
    sizeMl: size,
    sku: `${slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "EE"}-${size}`,
    retailPriceCop: prices[size],
  }));
}

function normalizeCurrentProduct(product) {
  return JSON.parse(JSON.stringify(product));
}

const v1Source = fs.readFileSync(v1Path, "utf8");
function loadCurrentProductsSource() {
  const liveSource = fs.readFileSync(currentProductsPath, "utf8");
  if (/export const products: Product\[\] = \[/.test(liveSource)) {
    return liveSource;
  }
  return execSync("git show HEAD:src/data/products.ts", { cwd: repoRoot, encoding: "utf8" });
}

const currentProductsSource = loadCurrentProductsSource();
const v1Products = extractEvaluatedExpression(v1Source, /const PRODUCTS = \[(.|\n|\r)*?\n\];/, "PRODUCTS");
const popularIds = new Set(extractEvaluatedExpression(v1Source, /const POPULAR_IDS = \[(.|\n|\r)*?\];/, "POPULAR_IDS"));
const currentProducts = extractCurrentProducts(currentProductsSource).map(normalizeCurrentProduct);
const familyDictionary = buildFamilyDictionary(v1Source);

const currentByInspiration = new Map(
  currentProducts.map((product) => [toAscii(product.inspirationReference).toLowerCase(), product]),
);
const usedSlugs = new Set();
const merged = v1Products.map((product) => {
  const inspirationKey = toAscii(product.inspired).toLowerCase();
  const existing = currentByInspiration.get(inspirationKey);
  if (existing) {
    usedSlugs.add(existing.slug);
    return existing;
  }

  let slug = slugify(product.name);
  if (!slug) slug = `perfume-${product.id}`;
  if (usedSlugs.has(slug)) slug = `${slug}-${product.id}`;
  usedSlugs.add(slug);

  const notes = [...product.top, ...product.heart, ...product.base];
  const families = inferFamilies(notes, familyDictionary);
  const intensity = inferIntensity(product, families);
  const topSeller = popularIds.has(product.id);
  const occasions = inferOccasions(product.cat, intensity, families);
  const moods = inferMoods(product.cat, intensity, families);

  return {
    id: `p-${slug}`,
    slug,
    publicName: toAscii(product.name),
    inspirationReference: toAscii(product.inspired),
    category: toAscii(product.cat),
    collection: inferCollection(product.cat, intensity, topSeller),
    shortDescription: buildShortDescription(product, families, intensity),
    longDescription: buildLongDescription(product),
    bestFor: buildBestFor(product.cat, occasions),
    concentration: "60% esencia",
    duration: inferDuration(intensity),
    intensity,
    sillage: inferSillage(intensity, families),
    notes: {
      top: product.top.map(toAscii),
      heart: product.heart.map(toAscii),
      base: product.base.map(toAscii),
    },
    families,
    moods,
    occasions,
    variants: buildVariants(slug, {
      30: product.prices[30],
      50: product.prices[50],
      100: product.prices[100],
    }),
    featured: topSeller,
    topSeller,
    wholesaleEligible: true,
  };
});

fs.writeFileSync(outputJsonPath, JSON.stringify(merged, null, 2) + "\n", "utf8");
console.log(`Catalogo generado: ${merged.length} productos -> ${outputJsonPath}`);
