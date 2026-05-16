# Empire Essence V3 - Estrategia y Racional

## Punto de Partida

Empire Essence necesita pasar de ventas ocasionales a una experiencia que facilite ventas diarias. La V3 se plantea como una propuesta independiente: usa V1, V2 y el catalogo mayorista como contexto, pero reconstruye la experiencia comercial desde cero.

## Que se Tomo de V1

- Mecanicas de venta directas: busqueda, filtros, promos, combos y compra asistida.
- Fallback a WhatsApp como ruta de cierre cuando el pago online no esta listo o el cliente necesita seguridad.
- Idea de Alex como asesor de fragancias, orientado a recomendar en vez de responder de forma generica.
- Notas olfativas y referencias de inspiracion para ayudar a decidir rapido.
- Pensamiento de catalogo amplio, pero con descubrimiento guiado para no abrumar.

## Que se Tomo de V2

- Direccion tecnica con Next.js, TypeScript y datos tipados.
- Patron de carrito/proveedor para mantener estado de compra de forma limpia.
- Intencion de checkout con Wompi.
- Base de funnel B2B y scoring para emprendedores.
- Separacion mas clara entre datos, UI, librerias de negocio y endpoints.

## Que se Tomo del PDF Mayorista

- Posicionamiento para emprendedores y revendedores.
- Pedido minimo de 10 unidades mixtas.
- Precios mayoristas por volumen para 30ml, 50ml y 100ml.
- Concentracion comunicada de 60%.
- Promesa de mas de 150 fragancias.
- Top sellers y logica de surtido inicial.
- Envio nacional y entrega estimada de 3 a 5 dias habiles.
- Insumos como alcohol, fijador, feromonas, envases y esencias por litro/gramo como cotizacion, no compra fija.

## Problemas Detectados en V1 y V2

- La intencion comercial existe, pero la jerarquia visual no siempre guia hacia una decision rapida.
- Hay demasiado peso en tener catalogo antes de tener curaduria; eso puede hacer que el cliente mire mucho y compre poco.
- Las fichas de producto necesitan explicar mejor para quien es cada perfume, cuando usarlo, que intensidad tiene y cual talla conviene.
- WhatsApp debe ser un cierre natural y de alto valor, no solo un boton suelto.
- El flujo mayorista necesitaba reglas claras de volumen, margen y siguiente accion.
- La marca necesitaba verse premium sin caer en lujo falso, exceso de dorado o plantillas genericas.

## Lo Reconstruido Desde Cero

- Sistema visual: paleta, espaciado, tipografia, tarjetas, CTAs, estados sticky y lenguaje premium limpio.
- Home: hero con oferta clara, top sellers, guias por intencion y entrada mayorista.
- Catalogo: exploracion completa con filtros utiles y resultados escaneables.
- PDP: piramide olfativa, perfil de uso, variantes, duracion, intensidad, confianza y productos similares.
- Checkout: payload estructurado, totales, envio, Wompi-ready y fallback WhatsApp con mensaje completo.
- Alex: asesor React con recomendaciones deterministicas y webhook configurable.
- Mayoristas: calculadora de margen, kit builder, validacion de minimo y manejo quote-only para insumos.
- Datos: catalogo tipado, reglas de precio y funciones de negocio separadas.

## Por Que Esta V3 Deberia Vender Mejor

- Reduce friccion: cada pagina importante tiene un CTA primario claro y un fallback humano por WhatsApp.
- Aumenta deseo: presenta los perfumes por mood, ocasion, intensidad y notas, no solo por nombre.
- Mejora confianza: comunica concentracion, envio, pago, asesoria y reglas mayoristas de forma visible.
- Acelera decision: top sellers y guia de Alex ayudan a escoger sin recorrer todo el catalogo.
- Convierte B2B: el emprendedor ve minimo, inversion, margen estimado y siguiente paso en una sola experiencia.
- Mantiene escalabilidad: los datos, precios, checkout y UI quedan separados para crecer sin rehacer la base.

## Verificacion Esperada

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- QA manual de home, catalogo, PDP, carrito, checkout, gracias, Alex y mayoristas.
- Validaciones API de checkout y cotizacion mayorista.
- Revision responsive desktop/mobile, con atencion a overflow, CTAs sticky y lectura de cards.
