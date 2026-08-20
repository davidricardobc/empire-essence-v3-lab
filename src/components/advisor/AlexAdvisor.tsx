"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { products } from "@/data/products";
import { getCommercialPriority, getCommercialPriorityScore, sortByCommercialPriority } from "@/lib/commercial-priority";
import { formatCop } from "@/lib/currency";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { Product, ProductVariant } from "@/types/product";

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
    content: "Hola, soy Alexa. Te ayudo a elegir rápido: para ti, para regalo o para ordenar seguro.",
  },
];

type QuickOption = {
  label: string;
  value: string;
};

const starterQuickOptions: QuickOption[] = [
  { label: "Para mí", value: "Quiero una fragancia para mí" },
  { label: "Para regalo", value: "Quiero una fragancia para regalo" },
  { label: "Mayorista", value: "Quiero armar un pedido mayorista" },
];

export function AlexAdvisor() {
  const pathname = usePathname();
  const { addItem, drawerOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [askedQuestions, setAskedQuestions] = useState<AdvisorQuestionKey[]>([]);
  const [selectedRecommendationSkus, setSelectedRecommendationSkus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const compactRoute =
    pathname.startsWith("/checkout") || pathname.startsWith("/mayoristas") || pathname.startsWith("/blog");

  const userTranscript = useMemo(
    () => messages.filter((message) => message.role === "user").map((message) => message.content),
    [messages],
  );
  const profile = useMemo(() => buildAdvisorProfile(userTranscript), [userTranscript]);
  const recommended = useMemo(
    () => recommendFromText(userTranscript.join(" "), profile),
    [profile, userTranscript],
  );
  const pendingQuestion = useMemo(() => getNextQuestion(profile), [profile]);
  const activeQuickOptions = useMemo(
    () => getQuickOptions(profile, pendingQuestion, userTranscript.length),
    [pendingQuestion, profile, userTranscript.length],
  );
  const showRecommendations = userTranscript.length > 0 && Boolean(profile.category);
  const panelId = "alex-panel";

  useEffect(() => {
    if (!open) return;
    const conversation = conversationRef.current;
    if (!conversation) return;
    if (messages.length <= starterMessages.length && !loading) {
      conversation.scrollTo({ top: 0 });
      return;
    }
    conversation.scrollTo({ top: conversation.scrollHeight, behavior: "smooth" });
  }, [loading, messages, open]);

  function getSelectedRecommendationVariant(product: Product) {
    return (
      product.variants.find((variant) => variant.sku === selectedRecommendationSkus[product.id]) ??
      getDefaultRetailVariant(product)
    );
  }

  function selectRecommendationVariant(product: Product, sku: string) {
    setSelectedRecommendationSkus((current) => ({ ...current, [product.id]: sku }));
  }

  function addRecommendation(product: Product, selectedVariant?: ProductVariant) {
    const variant = selectedVariant ?? getSelectedRecommendationVariant(product);
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

  function goToSecureCheckout(product: Product, selectedVariant?: ProductVariant) {
    addRecommendation(product, selectedVariant);
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
      recommended: recommendFromText(nextUserTranscript.join(" "), nextProfile),
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
        <span>Alexa</span>
      </button>

      <section
        id={panelId}
        className={`alex-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Asesora Alexa"
      >
        <div className="alex-head">
          <div>
            <span className="eyebrow">Asesor de fragancias</span>
            <h2>Alexa</h2>
          </div>
          <a
            href={buildWhatsappUrl("Hola Alexa. Quiero asesoria avanzada para comprar en Empire Essence.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        <div className="alex-conversation" ref={conversationRef}>
          <div className="alex-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`alex-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {loading ? <div className="alex-message assistant">Estoy revisando tu perfil...</div> : null}
          </div>

          <div className="alex-recs">
            {showRecommendations
              ? recommended.slice(0, 2).map((product) => {
                  const selectedVariant = getSelectedRecommendationVariant(product);

                  if (!selectedVariant) return null;

                  return (
                    <article key={product.id} className="alex-rec-card">
                      <Link href={`/producto/${product.slug}`} onClick={() => setOpen(false)}>
                        <small>{getAdvisorBadge(product)}</small>
                        <strong>{product.publicName}</strong>
                        <span>{product.shortDescription}</span>
                        <em>
                          {selectedVariant.sizeMl} ml · {formatCop(selectedVariant.retailPriceCop)}
                        </em>
                      </Link>
                      <div className="alex-size-picker" role="radiogroup" aria-label={`Tamaño para ${product.publicName}`}>
                        <span>Tamaño</span>
                        <div>
                          {product.variants.map((variant) => {
                            const active = variant.sku === selectedVariant.sku;

                            return (
                              <button
                                key={variant.sku}
                                type="button"
                                className={active ? "is-active" : ""}
                                onClick={() => selectRecommendationVariant(product, variant.sku)}
                                aria-pressed={active}
                              >
                                {variant.sizeMl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="alex-rec-actions">
                        <button type="button" onClick={() => addRecommendation(product, selectedVariant)}>
                          <ShoppingBag size={14} />
                          Agregar
                        </button>
                        <button type="button" onClick={() => goToSecureCheckout(product, selectedVariant)}>
                          <CreditCard size={14} />
                          Ordenar
                        </button>
                      </div>
                    </article>
                  );
                })
              : null}
          </div>
        </div>

        <div className="quick-options">
          {activeQuickOptions.map((option) => (
            <button key={option.label} type="button" onClick={() => send(option.value)}>
              {option.label}
            </button>
          ))}
        </div>

        <form
          className="alex-input"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ej: quiero algo para una cita" />
          <button type="submit" aria-label="Enviar">
            <Send size={16} />
          </button>
        </form>
      </section>
    </div>
  );
}

function recommendFromText(text: string, profile: AdvisorProfile = buildAdvisorProfile([text])) {
  const term = normalizeText(text);
  const wantsWholesale = profile.channel === "wholesale" || term.includes("mayor") || term.includes("emprend");
  const allowedCategories = getAllowedCategories(profile.category);

  return sortByCommercialPriority(products)
    .filter((product) => (wantsWholesale ? product.wholesaleEligible : true))
    .filter((product) => allowedCategories.includes(product.category))
    .map((product) => {
      let score = getCommercialPriorityScore(product);
      if (wantsWholesale && getCommercialPriority(product) === "campaign") score += 14;
      if (
        term.includes("publicidad") ||
        term.includes("pauta") ||
        term.includes("almacen") ||
        term.includes("desead") ||
        term.includes("antoja") ||
        term.includes("mas vend")
      ) {
        score += getCommercialPriority(product) === "campaign" ? 18 : 0;
      }
      if (
        term.includes("mujer") ||
        term.includes("femenina") ||
        term.includes("ella") ||
        term.includes("novia") ||
        term.includes("esposa") ||
        term.includes("inolvidable")
      ) {
        score += product.category === "femenina" ? 26 : product.category === "unisex" ? 10 : 0;
      }
      if (
        term.includes("hombre") ||
        term.includes("masculino") ||
        term.includes("masculina") ||
        term.includes("para hombre") ||
        term.includes("para el")
      ) {
        score += product.category === "masculina" ? 26 : product.category === "unisex" ? 10 : 0;
      }
      if (term.includes("unisex")) score += product.category === "unisex" ? 26 : 0;
      if (term.includes("mayor") || term.includes("emprendedor")) score += product.topSeller ? 8 : 0;
      [
        ...product.families,
        ...product.moods,
        ...product.occasions,
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ].forEach((tag) => {
        if (term.includes(normalizeText(tag))) score += 4;
      });
      if (term.includes("regalo") || term.includes("sorprender") || term.includes("no falla")) {
        score += product.intensity === "media" ? 5 : 0;
      }
      if (term.includes("noche") || term.includes("cita") || term.includes("salir") || term.includes("presencia")) {
        score += product.occasions.includes("noche") ? 5 : 0;
      }
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
    recipient:
      text.includes("regalo") ||
      text.includes("para ella") ||
      text.includes("novia") ||
      text.includes("esposa") ||
      text.includes("sorprender")
        ? "gift"
        : text.includes("para mi") || text.includes("para uso personal") || text.includes("impecable") || text.includes("oler")
          ? "self"
          : null,
    category:
      text.includes("unisex") || text.includes("mixto")
        ? "unisex"
        : text.includes("masculino") ||
            text.includes("masculina") ||
            text.includes("hombre") ||
            text.includes("para el") ||
            text.includes("para hombre")
          ? "masculina"
          : text.includes("femenina") ||
              text.includes("femenino") ||
              text.includes("mujer") ||
              text.includes("ella") ||
              text.includes("novia") ||
              text.includes("esposa")
            ? "femenina"
            : null,
    occasion: text.includes("oficina")
      ? "oficina"
      : text.includes("noche") || text.includes("cita") || text.includes("salir") || text.includes("presencia")
        ? "noche"
        : text.includes("regalo") || text.includes("para ella") || text.includes("no falla")
          ? "regalo"
          : text.includes("diario") || text.includes("dia a dia") || text.includes("dia")
            ? "diario"
            : null,
  };
}

function buildLocalReply({
  text,
  profile,
  recommended,
}: {
  text: string;
  profile: AdvisorProfile;
  recommended: typeof products;
}): LocalReply {
  const picks = recommended.slice(0, 2).map((product) => product.publicName).join(" o ");
  const secureCloseCopy = "Elige Ordenar y seguimos al checkout seguro. WhatsApp queda listo si prefieres ayuda.";

  if (mentionsPaymentStatus(text)) {
    return {
      content:
        "No puedo confirmar pagos ni estados de Wompi desde este chat. El estado real solo cuenta cuando entra el webhook o el equipo valida la referencia por WhatsApp. Si ya pagaste, comparte tu referencia y te ayudamos a revisarlo.",
      forceLocal: true,
    };
  }

  if (wantsSecureCheckout(text)) {
    return {
      content: [`Perfecto: iría por ${picks}.`, secureCloseCopy].join(" "),
      forceLocal: false,
    };
  }

  if (profile.channel === "wholesale") {
    const questionKey = getNextQuestion(profile);
    if (questionKey === "wholesaleMix") {
      return {
        content: getQuestionCopy(questionKey, profile),
        questionKey,
        forceLocal: false,
      };
    }

    return {
      content: [
        `Para mayorista arrancaría con ${picks}: rotan fácil y se explican rápido.`,
        questionKey ? getQuestionCopy(questionKey, profile) : "Te puedo llevar a WhatsApp con el kit orientado.",
      ].join(" "),
      questionKey,
      forceLocal: false,
    };
  }

  const questionKey = getNextQuestion(profile);
  if (profile.recipient === "gift" && questionKey === "category") {
    return {
      content: `Perfecto. ${getQuestionCopy(questionKey, profile)}`,
      questionKey,
      forceLocal: false,
    };
  }

  if (profile.recipient === "self" && questionKey === "category") {
    return {
      content: `Claro. ${getQuestionCopy(questionKey, profile)}`,
      questionKey,
      forceLocal: false,
    };
  }

  const opening =
    profile.recipient === "gift"
      ? `Para regalo ${getCategoryCopy(profile.category)}, iría por ${picks}.`
      : `Para ti, iría por ${picks}.`;

  return {
    content: [opening, questionKey ? getQuestionCopy(questionKey, profile) : secureCloseCopy].join(" "),
    questionKey,
    forceLocal: false,
  };
}

function getNextQuestion(profile: AdvisorProfile): AdvisorQuestionKey | null {
  if (profile.channel === "wholesale") {
    if (!profile.category) return "wholesaleMix";
    if (!profile.occasion) return "occasion";
    return null;
  }

  if (!profile.recipient) return "recipient";
  if (!profile.category) return "category";
  if (!profile.occasion) return "occasion";
  return null;
}

function getQuestionCopy(questionKey: AdvisorQuestionKey, profile: AdvisorProfile) {
  switch (questionKey) {
    case "recipient":
      return "¿Es para ti o para regalo?";
    case "occasion":
      return "¿Diario, oficina, cita o noche?";
    case "category":
      return profile.recipient === "gift"
        ? "¿El regalo es para mujer, hombre o prefieres unisex?"
        : "¿Qué género quieres ver: mujer, hombre o unisex?";
    case "wholesaleMix":
      return "¿Tu mix venderá más mujer, hombre o unisex?";
    default:
      return "Cuéntame un poco más y te afino la recomendación.";
  }
}

function getQuickOptions(
  profile: AdvisorProfile,
  pendingQuestion: AdvisorQuestionKey | null,
  userMessageCount: number,
): QuickOption[] {
  if (userMessageCount === 0 || pendingQuestion === "recipient") return starterQuickOptions;

  if (pendingQuestion === "category" || pendingQuestion === "wholesaleMix") {
    return [
      { label: "Mujer", value: "Femenina" },
      { label: "Hombre", value: "Masculina" },
      { label: "Unisex", value: "Unisex" },
    ];
  }

  if (pendingQuestion === "occasion") {
    return [
      { label: "Diario", value: "Para uso diario" },
      { label: "Oficina", value: "Para oficina" },
      { label: "Noche", value: "Para una cita o noche con presencia" },
    ];
  }

  if (profile.channel === "wholesale") {
    return [
      { label: "Top ventas", value: "Muéstrame las más vendidas para mayorista" },
      { label: "Mix seguro", value: "Quiero un mix mayorista seguro para empezar" },
      { label: "Comprar", value: "Quiero cerrar pedido mayorista" },
    ];
  }

  return [
    { label: "Agregar", value: "Quiero agregar una recomendación al carrito" },
    { label: "Comprar", value: "Quiero comprar y pagar seguro" },
    { label: "WhatsApp", value: "Quiero ayuda por WhatsApp" },
  ];
}

function getAllowedCategories(category: AdvisorProfile["category"]) {
  if (category === "masculina") return ["masculina", "unisex"];
  if (category === "femenina") return ["femenina", "unisex"];
  if (category === "unisex") return ["unisex"];
  return ["masculina", "femenina", "unisex"];
}

function getDefaultRetailVariant(product: Product) {
  return product.variants.find((variant) => variant.sizeMl === 50) ?? product.variants[0];
}

function getCategoryCopy(category: AdvisorProfile["category"]) {
  if (category === "masculina") return "para hombre";
  if (category === "femenina") return "para mujer";
  if (category === "unisex") return "unisex";
  return "seguro";
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
    term.includes("comprar ya") ||
    term.includes("cerrar pedido")
  );
}

function getAdvisorBadge(product: Product) {
  const priority = getCommercialPriority(product);
  if (priority === "campaign") return "Selección destacada";
  if (priority === "support") return "Muy elegido";
  return "Recomendación";
}

function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
