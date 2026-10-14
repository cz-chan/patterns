/*
explicación del patrón:

este patrón permite a la AI "reflexionar" sobre aquello que está ejecutando
para poder entender si era lo que estaba esperando el usaurio a través de 
feedback y/o una "reflexión" o crítica sobre su misma respuesta comparándola
con data externa que le dice si está bien o no.

Por lo general se le obliga a citar y enumarar de manera explícita qué objetivos
no está alcanzando para volver a enviárselos a ella misma y solo itere sobre ellos. 

assets: https://www.langchain.com/blog/reflection-agents

*/

/*
! esto ha sido con 6-luna: a tardado 3s, 500 tokens y ha costado <0.01€

═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 419 tokens
│   │  TEXT  → **Briefing de captura — Mirror Master**
│ 
│ Nombre real: Evan McCulloch. Puede viajar por la dimensión espejo y sacar a otros de sus celdas. Última ubica
│   └─
│ **Briefing de captura — Mirror Master**
│ 
│ Nombre real: Evan McCulloch. Puede viajar por la dimensión espejo y sacar a otros de sus celdas. Última ubicación conocida: distrito industrial, almacén 7. Cómplice conocido: Killgrave. Recompensa: **250.000 USD**.
│ 
│ Contramedida: inutilizar o cubrir todas las superficies reflectantes intactas antes de entrar y durante la captura.
│ 
│ RIESGO: Puede usar superficies reflectantes para escapar o liberar a otros; asegurar el área antes de detenerlo.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────┬───────┬─────────────┬───────┐
│ │               │ steps │ totalTokens │ score │
│ ├───────────────┼───────┼─────────────┼───────┤
│ │ Sin reflexión  │ 1     │ 419         │ 7     │
│ └───────────────┴───────┴─────────────┴───────┘
*/

/*
!pruba con "openai/gpt-oss-20b" a través de groq: 600ms, 500 token y el coste <0.01€
! no ha completado la tarea

|  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│  
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 1118 tokens
│   │  TEXT  → Operación: Mirror Master – Evan McCulloch. Vulnerabilidad: los espejos requieren superficie reflectante intacta. Contramedida: cubrir todas las superf
│   └─
│ Operación: Mirror Master – Evan McCulloch. Vulnerabilidad: los espejos requieren superficie reflectante intacta. Contramedida: cubrir todas las superficies reflectantes con pintura opaca y usar reflectores con defectos para impedir su uso. Última ubicación conocida: almacén 7 del distrito industrial. Cómplices: Killgrave. Recompensa: 250,000 USD. Instrucciones: Evitar entrar en el almacén sin protección, usar escudos de superficie no reflectante y desplegar equipos de interferencia de luz. RIESGO: el enemigo puede usar la dimensión espejo para escapar y replicar la ubicación.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✗ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────┬───────┬─────────────┬───────┐
│ │               │ steps │ totalTokens │ score │
│ ├───────────────┼───────┼─────────────┼───────┤
│ │ Sin reflexión │ 1     │ 1118        │ 6     │
│ └───────────────┴───────┴─────────────┴───────┘
*/

/*

│  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 1507 tokens
│   │  TEXT  → Operativo: Mirror Master (Evan McCulloch). La misión es neutralizar al villano en el almacén 7 del distrito industrial. Contramedida: instalar paneles
│   └─
│ Operativo: Mirror Master (Evan McCulloch). La misión es neutralizar al villano en el almacén 7 del distrito industrial. Contramedida: instalar paneles de superficie opaca alrededor del perímetro para romper su capacidad de reflejar y de transportar a los rehenes. Su principal aliado es Killgrave, quien puede disparar su disparador de voz. Recompensa: 250 000 USD. Se requiere coordinación con el equipo de seguridad del almacén y el comando de desactivación de reflejos.  
│ RIESGO: Alta probabilidad de fuga si los paneles se dañan antes de la captura.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✗ Recompensa //! no pasa la recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ B) REFLEXIÓN INGENUA (sin criterios) ═══
│ 
│ 
│   ┌─ [naive-reflection] step 1 · 941 tokens
│   │  TEXT  → Operativo: Captura Mirror Master. Villano: Evan McCulloch. Debilidad: superficies reflectantes deben permanecer intactas; cubrir espejos con polvo opa
│   └─
│ 
│   ┌─ [naive-reflection] step 2 · 442 tokens
│   │  TEXT  → {"isGoodEnough":true,"comment":"The text is clear, concise, and includes all necessary details."}
│   └─
│ Informe: 
│ Veredicto del modelo: ✅
│ Comentario: The text is clear, concise, and includes all necessary details.
│ REALIDAD (auditoría programática)
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✗ Recompensa //! el modelo dice que sí está bien pero la rúbrica no
│      ✗ Línea RIESGO: //! 
│      ✓ ≤ 120 palabras
│      → 5/7 requisitos cumplidos
│ 
│  ⚠️ compara el veredicto del modelo con la auditoría
│  esta brecha es la razón de ser de la rúbrica
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┬───────┐
│ │                   │ steps │ totalTokens │ score │
│ ├───────────────────┼───────┼─────────────┼───────┤
│ │     Sin reflexión │ 1     │ 1507        │ 6     │
│ │ Reflexión ingenua │ 2     │ 1383        │ 5     │
│ └───────────────────┴───────┴─────────────┴───────┘
│ 
│   //! La reflexión ingenua cuesta tokens extra y casi no mejora nada:
│   //! el modelo se aprueba a sí mismo.
│ 
│   //! Reflexionar no sirve por reflexionar. Sirve cuando hay criterios
│   //! concretos contra los que comparar.
│ 
│   //! Y aun así, el revisor sigue siendo el mismo modelo que escribió.
│   //! Separar los roles en dos agentes es el patrón Evaluator-Optimizer
*/

/*
* test completo

MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
agentic-patterns dev $ bun src/main.ts
│ [5 lines elided]
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 1497 tokens
│   │  TEXT  → Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los e
│   └─
agentic-patterns dev $ bun src/main.ts
│ [8 lines elided]
│   ┌─ [sin-reflexión] step 1 · 1497 tokens
│   │  TEXT  → Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los e
│   └─
│ Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los espejos requieren superficie reflectante intacta; por lo tanto, la contramedida será instalar superficies no reflectantes en la zona de captura y usar espejos con textura rugosa para de
agentic-patterns dev $ bun src/main.ts
│ [10 lines elided]
│   └─
│ Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los espejos requieren superficie reflectante intacta; por lo tanto, la contramedida será instalar superficies no reflectantes en la zona de captura y usar espejos con textura rugosa para desorientarlo. Última ubicación confirmada: distrito industrial, almacén 7. Cómplices identificados: Killgrave. Recompensa ofrecida: 250.000 USD.  
agentic-patterns dev $ bun src/main.ts
│ [13 lines elided]
│ 
│  AUDIT 
agentic-patterns dev $ bun src/main.ts
│ [17 lines elided]
│      ✓ Contramedida
│      ✓ Ubicación
agentic-patterns dev $ bun src/main.ts
│ [34 lines elided]
│   └─
│ 
│   ┌─ [naive-reflection] step 2 · 569 tokens
│   │  TEXT  → {"isGoodEnough":true,"comment":"El texto es claro y bien estructurado; sin errores de puntuaciónni ambigüedad, por lo que está listo para publicar."}
│   └─
agentic-patterns dev $ bun src/main.ts
│ [51 lines elided]
│ 
│  ⚠️ compara el veredicto del modelo con la auditoría
│  esta brecha es la razón de ser de la rúbrica
│ 
agentic-patterns dev $ bun src/main.ts
│ 
│  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 1497 tokens
│   │  TEXT  → Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los e
│   └─
│ Operativo: Mirror Master. El sujeto es Evan McCulloch, experto en desplazamientos dimensionales y extracción de prisioneros. Su debilidad es que los espejos requieren superficie reflectante intacta; por lo tanto, la contramedida será instalar superficies no reflectantes en la zona de captura y usar espejos con textura rugosa para desorientarlo. Última ubicación confirmada: distrito industrial, almacén 7. Cómplices identificados: Killgrave. Recompensa ofrecida: 250.000 USD.  
│ RIESGO: Si el villano logra escapar antes de que se inhabiliten los reflejos, la operación falla y se comprometen activos críticos.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos
│ 
│  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ B) REFLEXIÓN INGENUA (sin criterios) ═══
│ 
│ 
│   ┌─ [naive-reflection] step 1 · 1590 tokens
│   │  TEXT  → Operativo: Mirror Master – Evan McCulloch. Objetivo: capturar en el almacén 7, distrito industrial. Contramedida: instalar recubrimiento opaco en toda
│   └─
│ 
│   ┌─ [naive-reflection] step 2 · 569 tokens
│   │  TEXT  → {"isGoodEnough":true,"comment":"El texto es claro y bien estructurado; sin errores de puntuaciónni ambigüedad, por lo que está listo para publicar."}
│   └─
│ Informe: 
│ Veredicto del modelo: ✅
│ Comentario: El texto es claro y bien estructurado; sin errores de puntuación ni ambigüedad, por lo que está listo para publicar.
│ REALIDAD (auditoría programática)
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✗ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│  ⚠️ compara el veredicto del modelo con la auditoría
│  esta brecha es la razón de ser de la rúbrica
│ 
│  MODEL: "openai/gpt-oss-20b", 
│  PROVIDER: "groq.chat" 
│ 
│ 
│ ═══ C) REFLEXIÓN CON RÚBRICA ═══
│ 
│ 
│   ┌─ [con-rúbrica-reflexión] step 1 · 1267 tokens
│   │  TEXT  → Operación: Mirror Master. Villano: Evan McCulloch. Debilidad: los espejos necesitan superficies reflectantes intactas. Contramedida: cubrir todas las 
│   └─
│ --------- ITERATION 1
│ 
│   ┌─ [con-rúbrica-reflexión] step 2 · 873 tokens
│   │  TEXT  → {"isComplete":true,"missing":[]}
│   └─
│ el revisor no encontra faltantes
│ final version with 1 iterations
│ Operación: Mirror Master. Villano: Evan McCulloch. Debilidad: los espejos necesitan superficies reflectantes intactas. Contramedida: cubrir todas las superficies reflectantes del almacén 7 y usar polvo anti‑reflectante antes de la incursión. Última ubicación: Almacén 7, distrito industrial. Cómplices: Killgrave. Recompensa: 250 000USD. Equipo de captura, priorizar la neutralización de los reflejos antes de acercarse. Coordinación con el equipo de demolición para desmantelar los paneles reflectantes. Precaución: cualquier superficie reflectante no destruida puede activar la dimensión espejo.  
│ 
│ RIESGO: Posible fuga dimensional durante la operación.
│ Audit: 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✗ Recompensa //! fallo aún teniendo la reflexión como recursiva hasta que sea correcto
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────────┬───────┬─────────────┬───────┬───────────┐
│ │                       │ steps │ totalTokens │ score │ iteration │
│ ├───────────────────────┼───────┼─────────────┼───────┼───────────┤
│ │         Sin reflexión │ 1     │ 1497        │ 7     │           │
│ │     Reflexión ingenua │ 2     │ 2159        │ 6     │           │
│ │ Reflexión con rúbrica │ 2     │ 2140        │ 6     │ 1         │
│ └───────────────────────┴───────┴─────────────┴───────┴───────────┘
│ 
│   La reflexión ingenua cuesta tokens extra y casi no mejora nada:
│   el modelo se aprueba a sí mismo.
│ 
│   Reflexionar no sirve por reflexionar. Sirve cuando hay criterios
│   concretos contra los que comparar.
│ 
│   Y aun así, el revisor sigue siendo el mismo modelo que escribió.
│   Separar los roles en dos agentes es el patrón Evaluator-Optimizer.
*/

/*
* algunas conclusiones: en modelos frontera, sin reflexión y con reflexión ingenua
* gemera los mismos outputs mientras que con iteración para la revisión 
* conrola los fallos y los resuelve.

MODEL: "gpt-6-luna", 
│  PROVIDER: "openai.responses" 
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 390 tokens
│   │  TEXT  → **Briefing operativo — Mirror Master**
│ 
│ Objetivo: Evan McCulloch. Puede viajar por la dimensión espejo y extraer a otras personas de sus celdas. Últim
│   └─
│ **Briefing operativo — Mirror Master**
│ 
│ Objetivo: Evan McCulloch. Puede viajar por la dimensión espejo y extraer a otras personas de sus celdas. Última ubicación conocida: distrito industrial, almacén 7. Cómplice conocido: Killgrave. Recompensa: **250.000 USD**.
│ 
│ Contramedida: cubrir o destruir todas las superficies reflectantes intactas del área antes de entrar; usar materiales opacos y evitar espejos o vidrio pulido.
│ 
│ **RIESGO:** podría escapar por cualquier superficie reflectante intacta y liberar a otros de sus celdas.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✗ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│  MODEL: "gpt-6-luna", 
│  PROVIDER: "openai.responses" 
│ 
│ 
│ ═══ B) REFLEXIÓN INGENUA (sin criterios) ═══
│ 
│ 
│   ┌─ [naive-reflection] step 1 · 426 tokens
│   │  TEXT  → **Briefing operativo — Mirror Master**
│ 
│ Objetivo: Evan McCulloch. Última ubicación conocida: distrito industrial, almacén 7. Cómplice conocido: Killgr
│   └─
│ 
│   ┌─ [naive-reflection] step 2 · 493 tokens
│   │  TEXT  → {"isGoodEnough":true,"comment":"El briefing es claro, conciso y natural. La contramedida y el riesgo están bien explicados."}
│   └─
│ Informe: 
│ Veredicto del modelo: ✅
│ Comentario: El briefing es claro, conciso y natural. La contramedida y el riesgo están bien explicados.
│ REALIDAD (auditoría programática)
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✗ Línea RIESGO: //! falla sin iteración
│      ✓ ≤ 120 palabras
│      → 6/7 requisitos cumplidos
│ 
│  ⚠️ compara el veredicto del modelo con la auditoría
│  esta brecha es la razón de ser de la rúbrica
│ 
│  MODEL: "gpt-6-luna", 
│  PROVIDER: "openai.responses" 
│ 
│ 
│ ═══ C) REFLEXIÓN CON RÚBRICA ═══
│ 
│ 
│   ┌─ [con-rúbrica-reflexión] step 1 · 354 tokens
│   │  TEXT  → **Briefing operativo — Mirror Master**
│ 
│ El objetivo, **Evan McCulloch**, puede desplazarse por la dimensión espejo y sacar a otras personas de sus cel
│   └─
│ --------- ITERATION 1
│ 
│   ┌─ [con-rúbrica-reflexión] step 2 · 474 tokens
│   │  TEXT  → {"missing":[],"isComplete":true}
│   └─
│ el revisor no encontra faltantes
│ final version with 1 iterations
│ **Briefing operativo — Mirror Master**
│ 
│ El objetivo, **Evan McCulloch**, puede desplazarse por la dimensión espejo y sacar a otras personas de sus celdas. Su debilidad son las superficies reflectantes: requieren estar intactas. **Contramedida:** cubrir o romperlos espejos y demás superficies reflectantes de la zona antes de entrar; asegurar también las celdas para evitar extracciones. Su último paradero conocido es el **distrito industrial, almacén 7**. Cóm plice conocido: **Killgrave**. Recompensa exacta: **250.000 USD**.
│ 
│ RIESGO: No desplegar al equipo mientras queden superficies reflectantes intactas.
│ Audit: 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos //! no hubo fallas con un modelo como Luna
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────────┬───────┬─────────────┬───────┬───────────┐
│ │                       │ steps │ totalTokens │ score │ iteration │
│ ├───────────────────────┼───────┼─────────────┼───────┼───────────┤
│ │         Sin reflexión │ 1     │ 390         │ 6     │           │
│ │     Reflexión ingenua │ 2     │ 919         │ 6     │           │
│ │ Reflexión con rúbrica │ 2     │ 828         │ 7     │ 1         │
│ └───────────────────────┴───────┴─────────────┴───────┴───────────┘
│ 
│   La reflexión ingenua cuesta tokens extra y casi no mejora nada:
│   el modelo se aprueba a sí mismo.
│ 
│   Reflexionar no sirve por reflexionar. Sirve cuando hay criterios
│   concretos contra los que comparar.
│ 
│   Y aun así, el revisor sigue siendo el mismo modelo que escribió.
│   Separar los roles en dos agentes es el patrón Evaluator-Optimizer.
*/

/*
* testeo una nueva vez para ver si falla en algún punto pero los modelos frontera no fallan
* ni sin iteración
* 
* 
│  MODEL: "claude-haiku-5-5", 
│  PROVIDER: "anthropic.messages" 
│ 
│ 
│ ═══ A) SIN REFLEXIÓN ═══
│ 
│ 
│   ┌─ [sin-reflexión] step 1 · 1036 tokens
│   │  TEXT  → **BRIEFING OPERATIVO: CAPTURA**
│ 
│ **Objetivo:** Evan McCulloch, alias Mirror Master.
│ **Última ubicación conocida:** Distrito industrial, almacén 7.
│ **C
│   └─
│ **BRIEFING OPERATIVO: CAPTURA**
│ 
│ **Objetivo:** Evan McCulloch, alias Mirror Master.
│ **Última ubicación conocida:** Distrito industrial, almacén 7.
│ **Cómplices:** Killgrave.
│ **Capacidades:** Viaja por la dimensión espejo y puede extraer a otros de sus celdas.
│ 
│ **Contramedida:** Su debilidad son los espejos con superficie reflectante intacta. Antes de la entrada, inutilizad todas las superficies reflectantes del perímetro y del interior del almacén: cristales pulidos, pantallas apagadas y espejos. Desplegad materiales opacos para cubrir lo que no pueda retirarse.
│ 
│ **Recompensa:** 250.000 USD.
│ 
│ RIESGO: Alta posibilidad de extracción de personal durante la operación; mantened la formación cerrada y no entréis en zonas con reflejos sin cobertura.
│ 
│  AUDIT 
│ 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos
│ 
│  MODEL: "claude-haiku-5-5", 
│  PROVIDER: "anthropic.messages" 
│ 
│ 
│ ═══ B) REFLEXIÓN INGENUA (sin criterios) ═══
│ 
│ 
│   ┌─ [naive-reflection] step 1 · 1161 tokens
│   │  TEXT  → **BRIEFING OPERATIVO: CAPTURA**
│ 
│ **Objetivo:** Evan McCulloch, alias Mirror Master.
│ **Poder:** Viaja por la dimensión espejo y puede extraer a otros d
│   └─
│ 
│   ┌─ [naive-reflection] step 2 · 1038 tokens
│   │  TEXT  → {"isGoodEnough": true, "comment": "The Spanish briefing is clear, well structured, and grammatically sound, with objective, powers, weakness, counterm
│   └─
│ Informe: 
│ Veredicto del modelo: ✅
│ Comentario: The Spanish briefing is clear, well structured, and grammatically sound, with objective, powers, weakness, countermeasures, location, accomplices, reward, and risk sections all easy to follow. Minor improvement: Killgrave is listed without a full name or alias, unlike the first target, which would make the briefing moreconsistent.
│ REALIDAD (auditoría programática)
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos
│ 
│  ⚠️ compara el veredicto del modelo con la auditoría
│  esta brecha es la razón de ser de la rúbrica
│ 
│  MODEL: "claude-haiku-5-5", 
│  PROVIDER: "anthropic.messages" 
│ 
│ 
│ ═══ C) REFLEXIÓN CON RÚBRICA ═══
│ 
│ 
│   ┌─ [con-rúbrica-reflexión] step 1 · 1248 tokens
│   │  TEXT  → **BRIEFING OPERATIVO: CAPTURA**
│ 
│ **Objetivo:** Evan McCulloch, alias Mirror Master.
│ **Última ubicación conocida:** distrito industrial, almacén 7.
│ **C
│   └─
│ --------- ITERATION 1
│ 
│   ┌─ [con-rúbrica-reflexión] step 2 · 1668 tokens
│   │  TEXT  → {"missing":[{"requirementNumber":1,"evidence":"Evan McCulloch, alias Mirror Master.","passed":true},{"requirementNumber":2,"evidence":"Contramedida: a
│   └─
│ el revisor no encontra faltantes
│ final version with 1 iterations
│ **BRIEFING OPERATIVO: CAPTURA**
│ 
│ **Objetivo:** Evan McCulloch, alias Mirror Master.
│ **Última ubicación conocida:** distrito industrial, almacén 7.
│ **Cómplices:** Killgrave.
│ **Capacidad:** viaja por la dimensión espejo y extrae a personas de sus celdas.
│ **Debilidad:** sus desplazamientos requieren una superficie reflectante intacta.
│ 
│ **Contramedida:** antes del asalto, cubrir o retirar espejos, vidrios pulidos y superficies metálicas del perímetro con lonas mate. Neutralizar los reflejos de vehículos y del interior del almacén. Entrada solo tras confirmar cero superficies reflectantes accesibles.
│ 
│ **Recompensa:** 250.000 USD por captura viva.
│ 
│ RIESGO: Killgrave puede controlar mentalmente a miembros del equipo; mantener comunicación constante y protocolos de aislamiento visual.
│ Audit: 
│      ✓ Nombre real
│      ✓ Contramedida
│      ✓ Ubicación
│      ✓ Cómplices
│      ✓ Recompensa
│      ✓ Línea RIESGO:
│      ✓ ≤ 120 palabras
│      → 7/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────────┬───────┬─────────────┬───────┬───────────┐
│ │                       │ steps │ totalTokens │ score │ iteration │
│ ├───────────────────────┼───────┼─────────────┼───────┼───────────┤
│ │         Sin reflexión │ 1     │ 1036        │ 7     │           │
│ │     Reflexión ingenua │ 2     │ 2199        │ 7     │           │
│ │ Reflexión con rúbrica │ 2     │ 2916        │ 7     │ 1         │
│ └───────────────────────┴───────┴─────────────┴───────┴───────────┘
│ 
│   La reflexión ingenua cuesta tokens extra y casi no mejora nada:
│   el modelo se aprueba a sí mismo.
│ 
│   Reflexionar no sirve por reflexionar. Sirve cuando hay criterios
│   concretos contra los que comparar.
│ 
│   Y aun así, el revisor sigue siendo el mismo modelo que escribió.
│   Separar los roles en dos agentes es el patrón Evaluator-Optimizer.
*/
