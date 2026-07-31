"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { products } from "@/data/products";
import { getCommercialPriority, getCommercialPriorityScore, sortByCommercialPriority } from "@/lib/commercial-priority";
import { formatCop } from "@/lib/currency";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type AdvisorQuestionKey = "recipient" | "occasion" | "category" | "wholesaleMix";

type AdvisorProfile = {
  channel: "retail" | "wholesale";
  recipient: "self" | "gift" | null;
  category: "femenina" | "masculina" | "unisex" | null;
  occasion: "diario" | "oficina" | "noche" | "regalo" | null;
};

type LocalReply = {
  content: string;
  questionKey?: AdvisorQuestionKey | null;
  forceLocal: boolean;
};

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hola, soy Alex. Te recomiendo una fragancia según ocasión, presupuesto y rotación. Si ya tienes una opción clara, te ayudo a llevarla al carrito y cerrar por pago seguro.",
  },
];

const quickOptions = ["Comprar hoy", "Top para pauta", "Femenina poderosa", "Fresco diario", "Noche sensual", "Regalo seguro"];

export function AlexAdvisor() {
  const pathname = usePathname();
  const { addItem, drawerOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [askedQuestions, setAskedQuestions] = useState<AdvisorQuestionKey[]>([]);
  const [loading, setLoading] = useState(false);
  const compactRoute =
    pathname.startsWith("/checkout") || pathname.startsWith("/mayoristas") || pathname.startsWith("/blog");

  const userTranscript = useMemo(
    () => messages.filter((message) => message.role === "user").map((message) => message.content),
    [messages],
  );
  const profile = useMemo(() => buildAdvisorProfile(userTranscript), [userTranscript]);
  const recommended = useMemo(
    () => recommendFromText(userTranscript.join(" "), profile.channel === "wholesale"),
    [profile.channel, userTranscript],
  );
  const panelId = "alex-panel";

  function addRecommendation(product: Product) {
    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.publicName,
      sizeMl: variant.sizeMl,
      sku: variant.sku,
      quantity: 1,
      unitPriceCop: variant.retailPriceCop,
      channel: "retail",
    });
  }

  function goToSecureCheckout(product: Product) {
    addRecommendation(product);
    window.setTimeout(() => {
      window.location.href = "/checkout?channel=retail";
    }, 150);
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const nextMessages = [...messages, { role: "user" as const, content: clean }];
    const nextUserTranscript = nextMessages
      .filter((message) => message.role === "user")
      .map((message) => message.content);
    const nextProfile = buildAdvisorProfile(nextUserTranscript);
    const localReply = buildLocalReply({
      text: clean,
      profile: nextProfile,
      askedQuestions,
      recommended: recommendFromText(nextUserTranscript.join(" "), nextProfile.channel === "wholesale"),
    });

    setInput("");
    setMessages(nextMessages);
    if (localReply.questionKey) {
      setAskedQuestions((current) =>
        current.includes(localReply.questionKey as AdvisorQuestionKey) ? current : [...current, localReply.questionKey!],
      );
    }
    setLoading(true);

    const webhook = process.env.NEXT_PUBLIC_EE_CHAT_WEBHOOK;
    if (webhook && !localReply.forceLocal) {
      try {
        const response = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            profile: nextProfile,
            askedQuestions,
            rules: {
              avoidRepeatingQuestions: true,
              neverConfirmPaymentsFromChat: true,
              neverInventWompiStatus: true,
            },
          }),
        });
        const data = (await response.json()) as { response?: string };
        setMessages((current) => [
          ...current,
          { role: "assistant", content: data.response || localReply.content },
        ]);
        setLoading(false);
        return;
      } catch {
        // Fall through to local recommendation.
      }
    }

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: localReply.content,
      },
    ]);
    setLoading(false);
  }

  return (
    <div
      id="alex"
      className={`alex-root ${drawerOpen ? "is-drawer-open" : ""} ${compactRoute ? "is-compact-route" : ""}`}
    >
      <button
        type="button"
        className="alex-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-controls={panelId}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
        <span>Alex</span>
      </button>

      <section
        id={panelId}
        className={`alex-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Asesor Alex"
      >
        <div className="alex-head">
          <div>
            <span className="eyebrow">Asesor de fragancias</span>
            <h2>Alex</h2>
          </div>
          <a
            href={buildWhatsappUrl("Hola Alex. Quiero asesoria avanzada para comprar en Empire Essence.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        <div className="alex-messages">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`alex-message ${message.role}`}>
              {message.content}
            </div>
          ))}
          {loading ? <div className="alex-message assistant">Estoy revisando tu perfil...</div> : null}
        </div>

        <div className="quick-options">
          {quickOptions.map((option) => (
            <button key={option} type="button" onClick={() => send(option)}>
              {option}
            </button>
          ))}
        </div>

        <div className="alex-recs">
          {recommended.slice(0, 2).map((product) => (
            <article key={product.id} className="alex-rec-card">
              <Link href={`/producto/${product.slug}`} onClick={() => setOpen(false)}>
                <small>{getAdvisorBadge(product)}</small>
                <strong>{product.publicName}</strong>
                <span>{product.shortDescription}</span>
                <em>Desde {formatCop(product.variants[0]?.retailPriceCop ?? 0)}</em>
              </Link>
              <div className="alex-rec-actions">
                <button type="button" onClick={() => addRecommendation(product)}>
                  <ShoppingBag size={14} />
                  Agregar
                </button>
                <button type="button" onClick={() => goToSecureCheckout(product)}>
                  <CreditCard size={14} />
                  Pagar
                </button>
              </div>
            </article>
          ))}
        </div>

        <form
          className="alex-input"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ej: algo dulce para noche" />
          <button type="submit" aria-label="Enviar">
            <Send size={16} />
          </button>
        </form>
      </section>
    </div>
  );
}

function recommendFromText(text: string, wholesaleOnly = false) {
  const term = normalizeText(text);
  const wantsWholesale = wholesaleOnly || term.includes("mayor") || term.includes("emprend");

  return sortByCommercialPriority(products)
    .filter((product) => (wantsWholesale ? product.wholesaleEligible : true))
    .map((product) => {
      let score = getCommercialPriorityScore(product);
      if (wantsWholesale && getCommercialPriority(product) === "campaign") score += 14;
      if (term.includes("publicidad") || term.includes("pauta") || term.includes("almacen")) {
        score += getCommercialPriority(product) === "campaign" ? 18 : 0;
      }
      if (term.includes("mujer") || term.includes("femenina")) score += product.category === "femenina" ? 8 : 0;
      if (term.includes("hombre") || term.includes("masculina")) score += product.category === "masculina" ? 8 : 0;
      if (term.includes("unisex")) score += product.category === "unisex" ? 8 : 0;
      if (term.includes("mayor") || term.includes("emprendedor")) score += product.topSeller ? 8 : 0;
      [...product.families, ...product.moods, ...product.occasions, ...product.notes.top, ...product.notes.heart, ...product.notes.base].forEach((tag) => {
        if (term.includes(normalizeText(tag))) score += 4;
      });
      if (term.includes("regalo")) score += product.intensity === "media" ? 5 : 0;
      if (term.includes("noche")) score += product.occasions.includes("noche") ? 5 : 0;
      if (term.includes("fresco")) score += product.families.includes("fresca") ? 5 : 0;
      if (term.includes("dulce")) score += product.families.includes("dulce") ? 5 : 0;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}

function buildAdvisorProfile(userTranscript: string[]): AdvisorProfile {
  const text = normalizeText(userTranscript.join(" "));

  return {
    channel: mentionsWholesale(text) ? "wholesale" : "retail",
    recipient: text.includes("regalo") ? "gift" : text.includes("para mi") || text.includes("para uso personal") ? "self" : null,
    category: text.includes("femenina") || text.includes("mujer")
      ? "femenina"
      : text.includes("masculina") || text.includes("hombre")
        ? "masculina"
        : text.includes("unisex")
          ? "unisex"
          : null,
    occasion: text.includes("oficina")
      ? "oficina"
      : text.includes("noche")
        ? "noche"
        : text.includes("regalo")
          ? "regalo"
          : text.includes("diario") || text.includes("dia a dia") || text.includes("dia")
            ? "diario"
            : null,
  };
}

function buildLocalReply({
  text,
  profile,
  askedQuestions,
  recommended,
}: {
  text: string;
  profile: AdvisorProfile;
  askedQuestions: AdvisorQuestionKey[];
  recommended: typeof products;
}): LocalReply {
  const picks = recommended.slice(0, 3).map((product) => product.publicName).join(", ");
  const secureCloseCopy =
    "Puedes agregar una recomendación aquí mismo y cerrar en checkout con pago seguro por Wompi cuando esté disponible; si necesitas ayuda, WhatsApp sale con el pedido armado.";

  if (mentionsPaymentStatus(text)) {
    return {
      content:
        "No puedo confirmar pagos ni estados de Wompi desde este chat. El estado real solo cuenta cuando entra el webhook o el equipo valida la referencia por WhatsApp. Si ya pagaste, comparte tu referencia y te ayudamos a revisarlo.",
      forceLocal: true,
    };
  }

  if (wantsSecureCheckout(text)) {
    return {
      content: [
        "Perfecto. Te dejo opciones listas para comprar.",
        `Mi primera selección sería ${picks}.`,
        secureCloseCopy,
      ].join(" "),
      forceLocal: false,
    };
  }

  if (profile.channel === "wholesale") {
    const questionKey = getNextQuestion(profile, askedQuestions);
    return {
      content: [
        `Para mayorista te movería por ${picks} porque son referencias de alta rotación y buena lectura comercial.`,
        "El mínimo mayorista sigue siendo de 10 unidades mixtas.",
        questionKey ? getQuestionCopy(questionKey, "wholesale") : "Si quieres, te dejo el siguiente paso por WhatsApp con el kit ya orientado.",
      ].join(" "),
      questionKey,
      forceLocal: false,
    };
  }

  const questionKey = getNextQuestion(profile, askedQuestions);
  const opening =
    profile.recipient === "gift"
      ? `Para regalo te recomendaría ${picks}.`
      : `Te recomendaría ${picks} para empezar sin perder tiempo.`;

  return {
    content: [
      opening,
      "Son opciones fuertes para convertir porque cubren deseo claro: fresco diario, noche intensa, regalo o lujo reconocible.",
      questionKey ? getQuestionCopy(questionKey, "retail") : secureCloseCopy,
    ].join(" "),
    questionKey,
    forceLocal: false,
  };
}

function getNextQuestion(profile: AdvisorProfile, askedQuestions: AdvisorQuestionKey[]): AdvisorQuestionKey | null {
  if (profile.channel === "wholesale") {
    if (!profile.category && !askedQuestions.includes("wholesaleMix")) return "wholesaleMix";
    if (!profile.occasion && !askedQuestions.includes("occasion")) return "occasion";
    return null;
  }

  if (!profile.recipient && !askedQuestions.includes("recipient")) return "recipient";
  if (!profile.occasion && !askedQuestions.includes("occasion")) return "occasion";
  if (!profile.category && !askedQuestions.includes("category")) return "category";
  return null;
}

function getQuestionCopy(questionKey: AdvisorQuestionKey, channel: "retail" | "wholesale") {
  switch (questionKey) {
    case "recipient":
      return "¿Es para ti o para regalo?";
    case "occasion":
      return "¿La buscas para diario, oficina o noche?";
    case "category":
      return "¿La prefieres femenina, masculina o unisex?";
    case "wholesaleMix":
      return channel === "wholesale"
        ? "¿En tu rotación vendes más femenino, masculino o mixto?"
        : "¿La prefieres femenina, masculina o unisex?";
    default:
      return "Cuéntame un poco más y te afino la recomendación.";
  }
}

function mentionsWholesale(text: string) {
  const term = normalizeText(text);
  return term.includes("mayorista") || term.includes("emprend") || term.includes("revender") || term.includes("negocio");
}

function mentionsPaymentStatus(text: string) {
  const term = normalizeText(text);
  return (
    term.includes("pague") ||
    term.includes("ya pague") ||
    term.includes("transferencia") ||
    term.includes("confirmar pago") ||
    term.includes("estado de mi pedido") ||
    term.includes("estado del pago") ||
    term.includes("referencia")
  );
}

function wantsSecureCheckout(text: string) {
  const term = normalizeText(text);
  return (
    term.includes("comprar") ||
    term.includes("pagar") ||
    term.includes("wompi") ||
    term.includes("tarjeta") ||
    term.includes("checkout") ||
    term.includes("comprar hoy") ||
    term.includes("cerrar pedido")
  );
}

function getAdvisorBadge(product: Product) {
  const priority = getCommercialPriority(product);
  if (priority === "campaign") return "Prioridad para pauta";
  if (priority === "support") return "Alta rotación";
  return "Recomendación";
}

function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
