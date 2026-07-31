# Perfumes priorizados para publicidad

Fecha: 2026-07-31

## Decisión

Mientras no exista una tabla real de inventario por unidades, la pauta debe empujar primero las referencias que el sitio ya marca como `featured`, `topSeller` y elegibles para mayorista. Esa prioridad queda reflejada en `src/lib/commercial-priority.ts` para que Alex y el catálogo recomienden lo mismo.

Cuando David confirme cantidades de almacén, esta lista debe ajustarse con tres datos:

- Unidades disponibles por referencia y tamaño.
- Margen o utilidad por tamaño.
- Necesidad de rotar inventario quieto.

## Tier 1 - prioridad campaña

Estas son las referencias que conviene usar primero en anuncios, piezas orgánicas y recomendaciones de Alex:

- Conquista, inspirado en Creed Aventus.
- Despertar, inspirado en Dior Sauvage.
- Ambición, inspirado en Paco Rabanne One Million.
- Impulso, inspirado en Paco Rabanne Invictus.
- Celebración, inspirado en Carolina Herrera Good Girl.
- Desvelo, inspirado en YSL Black Opium.
- Misterio, inspirado en MFK Baccarat Rouge 540.
- Radiante, inspirado en Xerjoff Erba Pura.
- Éxtasis, inspirado en Montale Arabians Tonka.
- Éxtasis, inspirado en Viktor & Rolf Flowerbomb.
- Oleaje, inspirado en Paco Rabanne Invictus Legend.
- Provocacion, inspirado en Paco Rabanne Black XS.

## Tier 2 - soporte de alta rotación

Estas referencias ayudan a completar conversación, regalos, perfiles jóvenes y mix mayorista:

- Vértigo, inspirado en Versace Eros.
- Plenitud, inspirado en Carolina Herrera 212 VIP Rose.
- Gracia, inspirado en Lancôme La Vie Est Belle.
- Atrevimiento, inspirado en Jean Paul Gaultier Scandal.

## Regla para Alex

Alex debe:

- Recomendar primero Tier 1 cuando el cliente quiere comprar rápido, pagar por Wompi o viene desde pauta.
- Usar Tier 2 para afinar por género, ocasión o regalo.
- Llevar a carrito y checkout cuando el cliente ya muestra intención de compra.
- No prometer disponibilidad exacta sin inventario real confirmado.
- No confirmar pagos de Wompi desde el chat; solo orientar hacia checkout o WhatsApp.

## Próximo dato que falta

Para convertir esta prioridad en publicidad real de almacén, hace falta una tabla simple:

```txt
Referencia | Tamaño | Unidades | Costo | Precio | Prioridad
```

Con eso la pauta puede ordenar por stock real, margen y urgencia de rotación.
