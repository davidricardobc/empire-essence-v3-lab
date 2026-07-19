# Wompi security checklist

Fecha de verificacion: 2026-07-19

Este documento define como Empire Essence V3 evita confirmar pagos que no correspondan al checkout real del negocio.

## Reglas del flujo

1. El cliente no decide el precio final.
   - El navegador envia SKUs y cantidades.
   - `/api/checkout` normaliza los items contra el catalogo local.
   - El subtotal, envio y total se recalculan en servidor.

2. El checkout de Wompi se crea en servidor.
   - `src/lib/wompi.ts` arma la URL con `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`.
   - La firma de integridad se calcula con `WOMPI_INTEGRITY_SECRET`.
   - La referencia y el monto firmado salen del servidor.

3. La pagina de gracias no confirma pagos.
   - Solo muestra informacion de retorno.
   - El estado real del pago debe venir por webhook.

4. El webhook debe estar firmado.
   - `/api/wompi/events` rechaza eventos sin `WOMPI_EVENTS_SECRET`.
   - Rechaza JSON invalido.
   - Rechaza firmas invalidas con `401`.

5. La referencia debe existir.
   - Un evento firmado para una referencia no guardada se rechaza con `404`.

6. El monto debe coincidir.
   - El `amount_in_cents` del evento debe ser igual a `order.totalCop * 100`.
   - Un monto diferente se rechaza con `409`.

## Variables requeridas

Produccion:

- `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` debe tener prefijo `pub_prod_`.
- `WOMPI_INTEGRITY_SECRET` debe tener prefijo `prod_integrity_`.
- `WOMPI_EVENTS_SECRET` debe tener prefijo `prod_events_`.
- `WOMPI_PRIVATE_KEY` debe tener prefijo `prv_prod_` si se usa para consultas backend.

Pruebas:

- Usar las equivalentes de sandbox/test.
- No mezclar llaves test con checkout de produccion.

## Antes de publicar

- Confirmar en el dashboard de Wompi que las llaves pertenecen a la cuenta correcta de Empire Essence.
- Configurar URL de eventos HTTPS:

```text
https://TU-DOMINIO/api/wompi/events
```

- Confirmar que las variables reales esten solo en Vercel Environment Variables.
- No commitear `.env.local`, `.vercel/` ni `data/orders.json`.

## Verificacion local realizada

- Checkout con precio manipulado desde cliente: el servidor recalculo `CONQ-30` a precio real y no uso el precio enviado por el navegador.
- Checkout Wompi generado con host `checkout.wompi.co`.
- URL de checkout generada con `signature:integrity`.
- Webhook con firma invalida: rechazado con `401`.
- Webhook firmado con monto incorrecto: rechazado con `409`.
- Webhook firmado con monto exacto: aceptado y marca `paid` / `confirmed`.
