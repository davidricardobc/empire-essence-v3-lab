import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";

const FALLBACK_SITE_URL = "https://empireessence.co";

export const siteName = "Empire Essence";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
export const defaultOgImage = "/revision-images/empire-home-hero-v1.png";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    sameAs: ["https://wa.me/573156753404"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+57 315 675 3404",
        areaServed: "CO",
        availableLanguage: ["es"],
      },
    ],
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    inLanguage: "es-CO",
  };
}

export function createProductJsonLd(product: Product) {
  const lowestPrice = Math.min(...product.variants.map((variant) => variant.retailPriceCop));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.publicName,
    description: `${product.shortDescription} ${product.longDescription}`,
    image: [absoluteUrl("/assets/empire-collection-lineup.png")],
    sku: product.variants.map((variant) => variant.sku).join(", "),
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    category: product.category,
    offers: {
      "@type": "AggregateOffer",
      url: absoluteUrl(`/producto/${product.slug}`),
      priceCurrency: "COP",
      lowPrice: lowestPrice,
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: siteName,
      },
      offers: product.variants.map((variant) => ({
        "@type": "Offer",
        url: absoluteUrl(`/producto/${product.slug}`),
        priceCurrency: "COP",
        price: variant.retailPriceCop,
        availability: "https://schema.org/InStock",
        sku: variant.sku,
        itemCondition: "https://schema.org/NewCondition",
      })),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Concentracion",
        value: product.concentration,
      },
      {
        "@type": "PropertyValue",
        name: "Duracion",
        value: product.duration,
      },
      {
        "@type": "PropertyValue",
        name: "Intensidad",
        value: product.intensity,
      },
      {
        "@type": "PropertyValue",
        name: "Notas clave",
        value: [...product.notes.top, ...product.notes.heart, ...product.notes.base].join(", "),
      },
    ],
  };
}

export function createBlogPostingJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.heroImage)],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "es-CO",
    articleSection: post.category,
    about: post.conversionIntent,
    keywords: [...post.productSlugs, post.category, post.conversionIntent].join(", "),
  };
}
