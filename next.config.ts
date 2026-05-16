import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/blog/mejores-perfumes-hombre-2026.html",
        destination: "/blog/mejores-perfumes-hombre-2026-mayoristas",
        permanent: true,
      },
      {
        source: "/blog/como-comprar-perfumeria-al-por-mayor-sin-equivocarse.html",
        destination: "/blog/comprar-perfumeria-mayor-sin-equivocarse",
        permanent: true,
      },
      {
        source: "/blog/errores-comunes-al-empezar-a-revender-fragancias.html",
        destination: "/blog/errores-al-revender-fragancias",
        permanent: true,
      },
      {
        source: "/blog/senales-de-que-ya-estas-listo-para-vender-perfumes-como-mayorista.html",
        destination: "/blog/senales-listo-vender-perfumes-mayorista",
        permanent: true,
      },
      {
        source: "/blog/por-que-trabajar-con-un-proveedor-confiable-cambia-tu-margen-y-tu-tranquilidad.html",
        destination: "/blog/proveedor-confiable-margen-tranquilidad",
        permanent: true,
      },
      {
        source: "/blog/como-elegir-perfume-ideal.html",
        destination: "/blog/perfume-dulce-fresco-o-amaderado",
        permanent: true,
      },
      {
        source: "/blog/regalos-perfumes-para-ella.html",
        destination: "/blog/perfumes-para-regalar-sin-fallar",
        permanent: true,
      },
      {
        source: "/blog/perfumes-inspirados-colombia.html",
        destination: "/catalogo",
        permanent: true,
      },
      {
        source: "/blog/perfumes-con-feromonas.html",
        destination: "/catalogo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
