# Wompi production runbook

Este flujo prepara Empire Essence V3 para recibir pagos reales sin depender de `data/orders.json`.

## 1. Base de datos

Crear una base Postgres persistente en Supabase, Neon o equivalente.

Ejecutar:

```sql
-- docs/wompi-orders-postgres.sql
```

Tambien se puede dejar que la app cree la tabla automaticamente si `DATABASE_URL` usa un usuario con permisos de `CREATE TABLE`.

## 2. Variables en Vercel

Configurar en Production y Preview:

```text
NEXT_PUBLIC_SITE_URL=https://dominio-real
NEXT_PUBLIC_WHATSAPP_NUMBER=57XXXXXXXXXX
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...
WOMPI_INTEGRITY_SECRET=prod_integrity_...
WOMPI_EVENTS_SECRET=prod_events_...
WOMPI_PRIVATE_KEY=prv_prod_...
WOMPI_CHECKOUT_URL=https://checkout.wompi.co/p/
DATABASE_URL=postgres://...
```

Para sandbox, usar llaves de prueba y una base de prueba o registros claramente marcados.

## 3. Eventos Wompi

En el dashboard de Wompi, configurar:

```text
https://dominio-real/api/wompi/events
```

El pago solo se considera confirmado cuando el webhook firmado marca la orden como `paid` / `confirmed`.

## 4. Pruebas antes de live

- Crear pedido retail y confirmar que se guarda en `order_records`.
- Crear pedido mayorista y confirmar minimo de unidades.
- Simular webhook con firma invalida: debe responder `401`.
- Simular webhook con monto diferente: debe responder `409`.
- Simular webhook aprobado con monto correcto: debe marcar `paid` y `confirmed`.
- Entrar a `/gracias?ref=REFERENCIA` y confirmar que refleja el estado guardado.

## 5. Regla de salida

No activar Wompi live en produccion si falta cualquiera de estos puntos:

- `DATABASE_URL` persistente.
- Variables Wompi de produccion correctas.
- Evento HTTPS configurado.
- Prueba end-to-end aprobada por David.
