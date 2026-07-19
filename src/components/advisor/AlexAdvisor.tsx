"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { products } from "@/data/products";
import { buildWhatsappUrl } from "@/lib/whatsapp";

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
      "Hola, soy Alex. Te ayudo a elegir una fragancia para ti, para regalar o para armar un pedido mayorista con buena rotacion.",
  },
];

const quickOptions = ["Femenina poderosa", "Fresco diario", "Noche sensual", "Mayorista top ventas", "Regalo seguro"];

export function AlexAdvisor() {
  const pathname = usePathname();
  const { drawerOpen } = useCart();
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
      <button type="button" className="alex-trigger" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={20} /> : <Sparkles size={20} />}
        <span>Alex</span>
      </button>

      <section className={`alex-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
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
            <Link key={product.id} href={`/producto/${product.slug}`} onClick={() => setOpen(false)}>
              <strong>{product.publicName}</strong>
              <span>{product.shortDescription}</span>
            </Link>
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
  const term = text.toLowerCase();
  const wantsWholesale = wholesaleOnly || term.includes("mayor") || term.includes("emprend");

  return products
    .filter((product) => (wantsWholesale ? product.wholesaleEligible : true))
    .map((product) => {
      let score = product.topSeller ? (wantsWholesale ? 7 : 3) : 0;
      if (term.includes("mujer") || term.includes("femenina")) score += product.category === "femenina" ? 8 : 0;
      if (term.includes("hombre") || term.includes("masculina")) score += product.category === "masculina" ? 8 : 0;
      if (term.includes("unisex")) score += product.category === "unisex" ? 8 : 0;
      if (term.includes("mayor") || term.includes("emprendedor")) score += product.topSeller ? 8 : 0;
      [...product.families, ...product.moods, ...product.occasions].forEach((tag) => {
        if (term.includes(tag.toLowerCase())) score += 4;
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
  const text = userTranscript.join(" ").toLowerCase();

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

  if (mentionsPayment(text)) {
    return {
      content:
        "No puedo confirmar pagos ni estados de Wompi desde este chat. El estado real solo cuenta cuando entra el webhook o el equipo valida la referencia por WhatsApp. Si ya pagaste, comparte tu referencia y te ayudamos a revisarlo.",
      forceLocal: true,
    };
  }

  if (profile.channel === "wholesale") {
    const questionKey = getNextQuestion(profile, askedQuestions);
    return {
      content: [
        `Para mayorista te moveria por ${picks} porque suelen rotar bien para primer pedido.`,
        "El minimo mayorista sigue siendo de 10 unidades mixtas.",
        questionKey ? getQuestionCopy(questionKey, "wholesale") : "Si quieres, te dejo el siguiente paso por WhatsApp con el kit ya orientado.",
      ].join(" "),
      questionKey,
      forceLocal: false,
    };
  }

  const questionKey = getNextQuestion(profile, askedQuestions);
  const opening =
    profile.recipient === "gift"
      ? `Para regalo te recomendaria ${picks}.`
      : `Te recomendaria ${picks} para empezar sin perder tiempo.`;

  return {
    content: [
      opening,
      "Puedo afinarte la opcion por estilo, ocasion o intensidad sin repetir lo que ya me dijiste.",
      questionKey ? getQuestionCopy(questionKey, "retail") : "Si una te gusta, abre la ficha o te armo el mensaje de WhatsApp.",
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
      return "Es para ti o para regalo?";
    case "occasion":
      return "La buscas para diario, oficina o noche?";
    case "category":
      return "La prefieres femenina, masculina o unisex?";
    case "wholesaleMix":
      return channel === "wholesale"
        ? "En tu rotacion vendes mas femenino, masculino o mixto?"
        : "La prefieres femenina, masculina o unisex?";
    default:
      return "Cuentame un poco mas y te afino la recomendacion.";
  }
}

function mentionsWholesale(text: string) {
  const term = text.toLowerCase();
  return term.includes("mayorista") || term.includes("emprend") || term.includes("revender") || term.includes("negocio");
}

function mentionsPayment(text: string) {
  const term = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return (
    term.includes("wompi") ||
    term.includes("pago") ||
    term.includes("pague") ||
    term.includes("transferencia") ||
    term.includes("tarjeta") ||
    term.includes("confirmar pedido") ||
    term.includes("confirmar pago") ||
    term.includes("estado de mi pedido") ||
    term.includes("estado del pago") ||
    term.includes("referencia")
  );
}
