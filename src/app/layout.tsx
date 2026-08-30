import type { Metadata } from "next";
import Script from "next/script";
import { AlexAdvisor } from "@/components/advisor/AlexAdvisor";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { absoluteUrl, createOrganizationJsonLd, createWebsiteJsonLd, defaultOgImage } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Empire Essence | Perfumes inspirados y fragancias premium",
    template: "%s | Empire Essence",
  },
  description:
    "Perfumes inspirados para mujer, hombre y unisex con alta concentración, catálogo curado, compra directa y asesoría por WhatsApp en Colombia.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "perfumes inspirados",
    "fragancias premium",
    "perfumes para mujer",
    "perfumes para hombre",
    "perfumeria en Colombia",
    "perfumes al por mayor",
  ],
  openGraph: {
    title: "Empire Essence | Perfumes inspirados y fragancias premium",
    description:
      "Perfumes inspirados para mujer, hombre y unisex con compra directa, asesoría por WhatsApp y opción mayorista en Colombia.",
    url: "/",
    type: "website",
    locale: "es_CO",
    siteName: "Empire Essence",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Empire Essence - perfumes inspirados y fragancias premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empire Essence | Perfumes inspirados y fragancias premium",
    description:
      "Perfumes inspirados para mujer, hombre y unisex con compra directa y asesoría por WhatsApp en Colombia.",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = createOrganizationJsonLd();
  const websiteJsonLd = createWebsiteJsonLd();

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yaddd8b6yr");
          `}
        </Script>
        <CartProvider>
          <MotionProvider />
          <a href="#site-content" className="skip-link">
            Saltar al contenido
          </a>
          <SiteHeader />
          <div id="site-content" tabIndex={-1}>
            {children}
          </div>
          <SiteFooter />
          <CartDrawer />
          <AlexAdvisor />
        </CartProvider>
      </body>
    </html>
  );
}
