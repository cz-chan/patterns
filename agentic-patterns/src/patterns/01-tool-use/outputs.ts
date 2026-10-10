/*
* output de openai sin tools:

┌─ [witout-tools] step 1 · 451 tokens
│   │  TEXT  → Necesito los precios y la duración (en horas) de cada curso para calcularlo exactamente. ¿Me los facilitas? Puedes darme, por ejemplo:
│ 
│ - Precio Curso
│   └─
│ 
│  Respuesta:  Necesito los precios y la duración (en horas) de cada curso para calcularlo exactamente. ¿Me los facilitas? Puedes darme, por ejemplo:
│ 
│ - Precio Curso TypeScript: (moneda)
│ - Horas Curso TypeScript:
│ - Precio Curso Docker: (misma moneda)
│ - Horas Curso Docker:
│ 
│ Si prefieres, puedo usar un ejemplo orientativo (y en ese caso indícame la moneda). Ejemplo rápido: si TypeScript cuesta 50 € y dura 20 h, y Docker cuesta 60 € y dura 15 h:
│ 
│ - Precio total sin descuento = 50 + 60 = 110 €
│ - Con 20% de descuento = 110 × 0.8 = 88 €
│ - Horas totales = 20 + 15 = 35 h
│ 
│ Dime los precios y horas reales (y la moneda) y lo calculo exactamente.
│ 
│ 
│  ======= Comparativa ========
│ ┌───────────┬───────┬─────────────┐
│ │           │ steps │ totalTokens │
│ ├───────────┼───────┼─────────────┤
│ │ sin tools │ 1     │ 451         │
│ └───────────┴───────┴─────────────┘
*/
