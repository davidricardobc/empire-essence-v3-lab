import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <span className="eyebrow">Empire Essence V3</span>
          <h2>Una experiencia creada para vender todos los dias.</h2>
          <p>
            Fragancias inspiradas con presencia premium, checkout directo, asesoria inteligente y ruta mayorista para
            emprendedores.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/catalogo">Comprar retail</Link>
          <Link href="/mayoristas">Pedido mayorista</Link>
          <Link href="/checkout">Ir a checkout</Link>
          <a href="mailto:EmpireEssence.oficial@gmail.com">
            <Mail size={16} />
            Email
          </a>
          <a href={buildWhatsappUrl("Hola Empire Essence. Quiero asesoria para elegir fragancias.")} target="_blank">
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
