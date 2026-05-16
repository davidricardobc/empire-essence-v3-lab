"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { products } from "@/data/products";
import { buildWhatsappUrl } from "@/lib/whatsapp";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [loading, setLoading] = useState(false);

  const recommended = useMemo(() => recommendFromText(messages.map((message) => message.content).join(" ")), [messages]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", content: clean }]);
    setLoading(true);

    const webhook = process.env.NEXT_PUBLIC_EE_CHAT_WEBHOOK;
    if (webhook) {
      try {
        const response = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, { role: "user", content: clean }] }),
        });
        const data = (await response.json()) as { response?: string };
        setMessages((current) => [
          ...current,
          { role: "assistant", content: data.response || "Puedo ayudarte mejor si me cuentas ocasion y estilo." },
        ]);
        setLoading(false);
        return;
      } catch {
        // Fall through to local recommendation.
      }
    }

    const recs = recommendFromText(clean);
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: `Te llevaria por ${recs
          .slice(0, 3)
          .map((item) => item.publicName)
          .join(", ")}. Si quieres cerrar rapido, agrega una al carrito o te armo el mensaje de WhatsApp.`,
      },
    ]);
    setLoading(false);
  }

  return (
    <div id="alex" className="alex-root">
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
          <a href={buildWhatsappUrl("Hola Alex. Quiero asesoria avanzada para comprar en Empire Essence.")} target="_blank">
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

function recommendFromText(text: string) {
  const term = text.toLowerCase();
  return products
    .map((product) => {
      let score = product.topSeller ? 3 : 0;
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
