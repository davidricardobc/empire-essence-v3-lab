import type { Metadata } from "next";
import { AlexAdvisor } from "@/components/advisor/AlexAdvisor";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Empire Essence | Fragancias premium e inspiradas",
  description:
    "Fragancias inspiradas con alta concentracion, catalogo curado, compra directa, asesoria por WhatsApp y ruta mayorista para emprendedores.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
          <AlexAdvisor />
        </CartProvider>
      </body>
    </html>
  );
}
