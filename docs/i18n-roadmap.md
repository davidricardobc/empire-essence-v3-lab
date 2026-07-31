# Empire Essence V3 - estrategia de idiomas

## Decision

Si vamos a parecer una marca grande, la version en otros idiomas tiene sentido. Pero debe entrar despues de cerrar bien el flujo en espanol, porque traducir una experiencia floja solo multiplica deuda.

## Idiomas recomendados

1. Espanol Colombia como idioma principal.
2. Ingles como primera expansion: sirve para compradores internacionales, portafolio y posicionamiento premium.
3. Portugues como segunda expansion si la marca apunta a Brasil o dropshipping regional.

## Orden correcto

1. Separar textos de interfaz de los componentes.
2. Mantener productos, precios, Wompi y WhatsApp como fuente unica.
3. Crear rutas por idioma: `/`, `/en`, `/pt`.
4. Traducir primero navegacion, home, catalogo, carrito, checkout y mensajes de error.
5. Traducir SEO: title, description, Open Graph, sitemap alternates.
6. Ajustar WhatsApp por idioma sin cambiar el numero oficial.

## Reglas

- No traducir nombres de fragancias ni referencias inspiradas salvo criterio de marca.
- No duplicar archivos de producto por idioma si solo cambia copy.
- No activar selector de idioma si hay rutas incompletas.
- No publicar idiomas nuevos sin QA visual mobile, porque ingles/portugues cambian largos de texto.

## Primer MVP posible

- Selector ES/EN discreto en header.
- Home, catalogo, carrito y checkout en ingles.
- Mensajes de WhatsApp generados en el idioma activo.
- SEO alterno para `/en`.

## Recomendacion actual

Terminar QA y conversion en espanol. Despues crear una rama de internacionalizacion para ingles, con arquitectura limpia antes de traducir todo.
