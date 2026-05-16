# Empire Essence V3 Lab

Nueva propuesta independiente para Empire Essence, construida como un laboratorio comercial y frontend desde cero. El objetivo no es reparar V1 ni V2, sino disenar una experiencia mas clara, deseable y orientada a venta diaria.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Catalogo local tipado
- Carrito retail/mayorista
- Checkout Wompi-ready con fallback a WhatsApp
- Asesor Alex con recomendaciones deterministicas y webhook opcional

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

En este entorno PowerShell puede bloquear `npm.ps1`; si ocurre, ejecutar npm con Node:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

## Variables

Copiar `.env.example` a `.env.local` y configurar:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_EE_CHAT_WEBHOOK` opcional
- `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` opcional para Checkout Web
- `WOMPI_INTEGRITY_SECRET` opcional para firma de integridad del checkout
- `WOMPI_EVENTS_SECRET` requerido para validar eventos/webhooks de pago
- `WOMPI_PRIVATE_KEY` opcional si luego se consulta estado de transacciones desde backend

Sin Wompi configurado, el checkout opera en modo fallback y genera una URL de WhatsApp con el pedido completo.

Para produccion real con Wompi, configura en el dashboard la URL de eventos:

```text
https://TU-DOMINIO/api/wompi/events
```

La redireccion a `/gracias` no confirma pago por si sola; la confirmacion confiable llega por el evento validado.

## Rutas Principales

- `/`: home comercial con hero, guias de eleccion, top sellers y entrada mayorista.
- `/catalogo`: catalogo con busqueda y filtros por familia, mood, ocasion, intensidad y categoria.
- `/producto/[slug]`: ficha de producto con piramide olfativa, perfil, variantes, CTA y handoff a Alex/WhatsApp.
- `/checkout`: checkout retail o mayorista con respuesta Wompi-ready.
- `/mayoristas`: embudo para emprendedores con calculadora de margen, kit builder y reglas de precio.
- `/gracias`: confirmacion posterior a compra o contacto.
- `/api/wompi/events`: endpoint para validar eventos de Wompi por checksum.

## Reglas Mayoristas

- Minimo: 10 unidades mixtas.
- 30ml: 10-19 unidades a `$22.000`; 20+ a `$20.000`.
- 50ml: 10-19 unidades a `$32.000`; 20+ a `$29.000`.
- 100ml: 10-19 unidades a `$48.000`; 20+ a `$44.000`.
- Insumos por litro/gramo quedan como cotizacion por WhatsApp o lead.

## Concepto Visual

El concepto aceptado se conserva en `docs/accepted-home-concept.png`. La imagen final usada por la home vive en `public/assets/empire-hero-product.png`.
