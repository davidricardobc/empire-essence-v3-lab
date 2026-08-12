# Empire Essence V3 - Estado Actual y Roadmap

## Estado del Proyecto

Empire Essence V3 es el laboratorio correcto para continuar el proyecto. No depende de reparar V1 ni V2: toma sus aprendizajes y reconstruye una experiencia comercial nueva, enfocada en venta diaria, confianza y compra asistida.

Ruta de trabajo:

```text
/mnt/c/CODEX/Empire Essence V3/empire-essence-v3-lab
```

Estado general: base funcional avanzada, lista para auditoria visual, QA comercial y preparacion de una version mostrable.

## Que Ya Existe

- Home comercial con hero, beneficios, colecciones, top sellers, prueba de marca y entrada mayorista.
- Catalogo con busqueda y filtros por categoria, familia, mood, ocasion e intensidad.
- Fichas de producto con informacion olfativa, variantes y acciones de compra.
- Carrito con flujo retail y mayorista.
- Checkout con modo WhatsApp y preparacion para Wompi.
- Ruta mayorista con calculadora, kit builder y reglas de volumen.
- Blog y contenido educativo inicial.
- Alex como asesor deterministico con webhook opcional.
- Datos de productos tipados y reglas de negocio separadas.

## Lo Que Debe Cuidarse

- No mezclar cambios de marca, checkout, pagos y catalogo en un solo commit.
- No activar Wompi como pago final sin prueba completa de sandbox, integridad y eventos.
- No asumir que el catalogo completo de 150+ referencias ya esta listo para publicarse.
- No tocar V1 ni V2 para continuar esta etapa.
- No convertir WhatsApp en un boton generico: debe cerrar con contexto del pedido.

## Prioridad Comercial

La meta inmediata no es tener la tienda perfecta. La meta es tener una version que ayude a vender y permita aprender rapido:

1. Que la persona entienda que vende Empire Essence en menos de 5 segundos.
2. Que pueda elegir un perfume sin sentirse perdida.
3. Que el carrito y WhatsApp lleven un pedido claro.
4. Que mayoristas entiendan minimo, margen y siguiente paso.
5. Que Natalia y David puedan mostrar la marca con orgullo.

## Roadmap Corto

### 1. Auditoria Funcional

Objetivo: saber que funciona hoy sin cambiar diseno.

Checklist:

- Home carga sin errores en desktop y mobile.
- Catalogo filtra correctamente por cada criterio.
- Busqueda encuentra productos por nombre, inspiracion y notas.
- Ficha de producto permite elegir variante y agregar al carrito.
- Carrito conserva productos al navegar.
- Checkout arma pedido retail para WhatsApp.
- Checkout mayorista respeta minimo de 10 unidades.
- Pagina mayorista calcula precios y margen esperado.
- Alex recomienda sin romper la navegacion.
- Blog y rutas SEO cargan correctamente.

### 2. Ajuste de Copy Comercial

Objetivo: textos mas cortos, con mas deseo y menos explicacion.

Lineas guia:

- Vender seguridad al elegir, no solo perfumes.
- Hablar de ocasion, emocion y presencia.
- Reducir frases largas en heroes, cards y CTAs.
- Mantener un tono premium cercano, sin lujo falso.
- Separar retail y mayorista con promesas distintas.

Ejemplos de direccion:

- Retail: "Elige una fragancia que hable por ti."
- Mayorista: "Empieza con un kit pensado para vender."
- WhatsApp: "Confirma tu pedido con asesoria real."

### 3. QA Visual Mobile

Objetivo: que se sienta confiable en celular, donde probablemente llegara la mayor parte del trafico.

Revisar:

- Hero y CTA principal.
- Cards de producto.
- Filtros del catalogo.
- Drawer del carrito.
- Checkout.
- Calculadora mayorista.
- Botones sticky.
- Textos largos y posibles overflows.

### 4. Preparacion de Venta Asistida

Objetivo: que WhatsApp reciba mensajes utiles para cerrar.

Revisar que el mensaje incluya:

- Nombre del producto.
- Variante y cantidad.
- Total estimado.
- Canal retail o mayorista.
- Datos del cliente cuando existan.
- Pregunta de cierre clara.

### 5. Wompi Sandbox

Objetivo: validar pagos solo cuando el flujo WhatsApp ya este firme.

Pendiente:

- Confirmar credenciales sandbox.
- Configurar `DATABASE_URL` con Postgres persistente antes de activar Wompi fuera de local.
- Crear tabla base con `docs/wompi-orders-postgres.sql`.
- Probar firma de integridad.
- Probar redireccion a `/gracias`.
- Probar evento en `/api/wompi/events`.
- Definir que estados de pago se guardan.
- Documentar diferencia entre redireccion y confirmacion real por webhook.

## Roadmap Medio

- Cargar catalogo completo con curaduria por top sellers y familias.
- Crear colecciones: oficina, cita, diario, regalo, noche, emprendedor.
- Mejorar Alex con preguntas de intencion antes de recomendar.
- Crear panel simple de pedidos recibidos o leads.
- Medir clics a WhatsApp por fuente y producto.
- Crear landing mayorista independiente para anuncios.
- Preparar calendario de contenido para Instagram, YouTube y WhatsApp.

## Primer Sprint Recomendado

Sprint: "Version Mostrable para Venta Asistida"

Alcance:

- QA funcional completo.
- Pulir textos criticos del home, catalogo y checkout.
- Validar carrito + WhatsApp.
- Revisar mobile con capturas.
- Dejar Wompi apagado si no esta probado.

Criterio de listo:

- `npm run lint` pasa.
- `npm run typecheck` pasa.
- `npm run build` pasa.
- Flujo manual retail completo probado.
- Flujo manual mayorista completo probado.
- Capturas desktop/mobile revisadas.
- Lista corta de pendientes documentada.

## Siguiente Accion

Ejecutar auditoria funcional y visual sin editar la app. Con los hallazgos, hacer commits pequenos y separados:

1. `docs:` estado y roadmap.
2. `fix:` errores funcionales encontrados.
3. `style:` ajustes mobile.
4. `content:` copy comercial.
5. `feat:` mejoras nuevas.
