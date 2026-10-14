/*
explicación del patrón:

la idea de este patrón es proveer a la AI de algún método, ya sea por nuestra parte
o indicando que lo haga ella, para desestructurar una tarea compleja en subtareas
consecuentes que le permitan llegar a un resultado más optimo con mayor facilidad
y tener mayor accuracy.

assets: https://www.snowflake.com/en/artificial-intelligence/agents/agent-planning/
*/

/*
 * puebas con "claude-sonnet-5-5", "claude-haiku-5-5", "gpt-5-mini" y "gpt-6-luna"

  !! las conclusiones: LA API DE ANTHROPIC ES DESCARADAMENTE CARA :/

  y por supuesto, dependiendo de la tarea a realizar requiere más o menos
  razonamiento pero llevando los modelos lo más guiados posibles y 
  dejándoles hacer lo mínimo necesario, un modelo "tonto" puede ahorrarte
  mucho dinero y token en el mismo lapso de tiempo.

  quizá las suscripciones de claude puedan ser buenas pero la API, para
  según que tareas... se ríen de ti y te roban DÁNDOTE cuenta de que lo están haciendo
 */

/*
*sin superman
═══ A) SIN PLANIFICACIÓN ═══
│ 
│ 
│   ┌─ [without-plan] step 1 · 2653 tokens
│   │  TEXT  → # Operativo de recaptura
│ 
│ ## Veredicto: no es viable al 100 %
│ Se pueden recapturar **6 de los 7 villanos**. **The Shade** queda libre por falta de ho
│   └─
│ 
│  Respuesta:  # Operativo de recaptura
│ 
│ ## Veredicto: no es viable al 100 %
│ Se pueden recapturar **6 de los 7 villanos**. **The Shade** queda libre por falta de horas de luz.
│ 
│ ## Análisis de capacidad
│ Cada captura cuesta 2 h.
│ 
│ | Especialidad | Villanos | Horas necesarias | Héroe | Horas disponibles | Capturas posibles |
│ |---|---|---|---|---|---|
│ | Fuego | 1 | 2 | Antorcha Humana | 6 | 3 |
│ | Tecnología | 2 | 4 | Iron Man | 5 | 2 |
│ | Telequinesis | 1 | 2 | Jean Grey | 3 | 1 |
│ | **Luz** | **3** | **6** | **Green Lantern** | **4** | **2** ❌ |
│ 
│ El déficit está solo en la luz: faltan 2 h. Ningún otro héroe puede cubrirlas, porque cada uno solo neutraliza villanos de su especialidad.
│ 
│ ## Orden de ejecución
│ 
│ **Fase 0: prioridad absoluta**
│ - **Iron Man captura a Mirror Master** (2 h). Puede sacar a los demás de sus celdas, así que cae antes que nadie, aunque su prioridad nominal sea 3.
│ 
│ **Fase 1: resto del operativo, en paralelo y por prioridad**
│ 1. **Antorcha Humana** captura a **Mister Freeze** (prioridad 1), 2 h.
│ 2. **Iron Man** captura a **Killgrave** (prioridad 2), 2 h.
│ 3. **Green Lantern** captura a **Doctor Light** (prioridad 4), 2 h.
│ 4. **Jean Grey** captura a **Juggernaut** (prioridad 5), 2 h.
│ 5. **Green Lantern** captura a **Solomon Grundy** (prioridad 6), 2 h.
│ 6. **The Shade** (prioridad 7) **queda sin asignar**. Es el menos urgente, así que es el sacrificado cuando faltan horas.
│ 
│ ## Uso de horas
│ 
│ | Héroe | Usadas / Disponibles | Capturas |
│ |---|---|---|
│ | Antorcha Humana | 2 / 6 | Mister Freeze |
│ | Green Lantern | 4 / 4 | Doctor Light, Solomon Grundy |
│ | Iron Man | 4 / 5 | Mirror Master, Killgrave |
│ | Jean Grey | 2 / 3 | Juggernaut |
│ 
│ Ningún héroe excede su presupuesto de horas.
│ 
│ ## Para completar la misión
│ Hacen falta **2 horas adicionales de luz**, ya sea:
│ - que Green Lantern tenga 6 h en total, o
│ - que se sume otro héroe de luz con al menos 2 h.
│ 
│ Las horas sobrantes de Antorcha Humana (4), Iron Man (1) y Jean Grey (1) no sirven para The Shade, porque notienen la especialidad de luz.
│ 
│   ⚠️  Verifica: ¿va Mirror Master primero?
│       ¿cada héroe contrarresta de verdad el poder asignado?
│       ¿son atrapados en orden de amenaza?
│       ¿alguien supera sus horas disponibles?
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Sin planificación  │ 1     │ 2653        │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada.
*/

/*
*con superman

═══ A) SIN PLANIFICACIÓN ═══
│ 
│ 
│   ┌─ [without-plan] step 1 · 2992 tokens
│   │  TEXT  → # Operativo de recaptura
│ 
│ ## Veredicto: es viable, pero sin margen en los villanos de luz
│ 
│ ## Análisis de capacidad
│ Cada operación cuesta 2 h, así que
│   └─
│ 
│  Respuesta:  # Operativo de recaptura
│ 
│ ## Veredicto: es viable, pero sin margen en los villanos de luz
│ 
│ ## Análisis de capacidad
│ Cada operación cuesta 2 h, así que cada héroe puede hacer:
│ 
│ | Héroe | Horas | Operaciones | Especialidad |
│ |---|---|---|---|
│ | Antorcha Humana | 6 | 3 | fuego |
│ | Green Lantern | 4 | 2 | luz |
│ | Iron Man | 5 | 2 (sobra 1 h) | tecnología |
│ | Jean Grey | 3 | 1 (sobra 1 h) | telequinesis |
│ | Superman | 2 | 1 | fuego o luz |
│ 
│ | Tipo | Villanos | Capacidad |
│ |---|---|---|
│ | Fuego | 1 | 3 (Antorcha) |
│ | Tecnología | 2 | 2 (Iron Man) |
│ | Telequinesis | 1 | 1 (Jean Grey) |
│ | Luz | 3 | 3 (Green Lantern 2 + Superman 1) |
│ 
│ La demanda coincide exactamente con la capacidad en luz y tecnología. Superman es imprescindible en luz, asíque no puede apoyar con fuego.
│ 
│ ## Prioridad
│ **Mirror Master va primero.** Puede sacar a los demás de sus celdas, por lo que tiene preferencia sobre todos, aunque su amenaza sea 3. Después se sigue el orden de amenaza: Freeze (1), Killgrave (2), Doctor Light (4), Juggernaut (5), Grundy (6) y Shade (7).
│ 
│ ## Plan
│ 
│ **Fase 0 (horas 0–2): neutralizar al que puede liberar a otros**
│ - Iron Man captura a **Mirror Master**.
│ 
│ **Fase 1 (horas 2–4): en paralelo, asignadas por prioridad**
│ 1. Antorcha Humana captura a **Mister Freeze** (amenaza 1).
│ 2. Iron Man captura a **Killgrave** (amenaza 2).
│ 3. Green Lantern captura a **Doctor Light** (amenaza 4).
│ 4. Jean Grey captura a **Juggernaut** (amenaza 5).
│ 5. Superman captura a **Solomon Grundy** (amenaza 6).
│ 
│ **Fase 2 (horas 4–6)**
│ - Green Lantern captura a **The Shade** (amenaza 7).
│ 
│ ## Uso de horas
│ 
│ | Héroe | Usadas / Disponibles | Objetivos |
│ |---|---|---|
│ | Antorcha Humana | 2 / 6 | Freeze |
│ | Green Lantern | 4 / 4 | Doctor Light, Shade |
│ | Iron Man | 4 / 5 | Mirror Master, Killgrave |
│ | Jean Grey | 2 / 3 | Juggernaut |
│ | Superman | 2 / 2 | Grundy |
│ 
│ Los 7 villanos quedan recapturados y ningún héroe excede sus horas.
│ 
│ ## Riesgos
│ - Green Lantern y Superman no tienen reserva. Si alguno falla o se retrasa, no queda nadie más que pueda detener a un villano de luz.
│ - Antorcha Humana tiene 4 h libres, pero no puede cubrir luz, tecnología ni telequinesis por su especialidad.
│ - Si Mirror Master fallara en la Fase 0, habría que repetir el intento con Iron Man. Eso lo dejaría sin horas para Killgrave (solo le queda 1 h tras dos operaciones), y el operativo dejaría de ser viable.
│ 
│   ⚠️  Verifica: ¿va Mirror Master primero?
│       ¿cada héroe contrarresta de verdad el poder asignado?
│       ¿son atrapados en orden de amenaza?
│       ¿alguien supera sus horas disponibles?
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Sin planificación  │ 1     │ 2992        │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada.
*/

//* planning con steps

/*
====== PLANNING 
│ 
│   ┌─ [with planning] step 1 · 2405 tokens
│   │  TEXT  → {"steps":[{"goal":"Identificar qué villano puede liberar a otros y fijarlo como primer objetivodel operativo.","reason":"La regla exige que quien pue
│   └─
│ stpes [
│   {
│     goal: "Identificar qué villano puede liberar a otros y fijarlo como primer objetivo del operativo.",
│     reason: "La regla exige que quien pueda liberar a los demás caiga antes que nadie. Mirror Master saca a otros de sus celdas, así que este paso define el punto de partida y condiciona todo el orden posterior.",
│   },
│   {
│     goal: "Ordenar a los 6 villanos restantes por nivel de prioridad (1 el más urgente) detrás del villano liberador.",
│     reason: "Con el primer objetivo ya fijado, la prioridad solo se aplica al resto. Esto da la secuencia completa de atención que usarán los pasos siguientes.",
│   },
│   {
│     goal: "Emparejar a cada villano con los héroes cuya especialidad puede detenerlo y calcular las horas necesarias (2 por villano) frente a las horas disponibles de cada especialidad.",
│     reason: "Con la secuencia definida, se comprueba si hay capacidad suficiente por especialidad. Aquí se descubre si el operativo es viable antes de asignar a nadie.",
│   },
│   {
│     goal: "Asignar un héroe concreto a cada villano en el orden establecido, sin que ningún héroe supere su presupuesto de horas y usando a Superman, que cubre fuego y luz, donde haga falta.",
│     reason: "Solo con el cálculo de capacidad se puede repartir el trabajo sin excederse. La asignación respeta el orden de prioridad y permite operar en paralelo cuando los héroes son distintos.",
│   },
│   {
│     goal: "Validar el plan completo contra todas las reglas y declarar si el operativo es viable, indicando qué villanos quedarían sin capturar si no lo fuera.",
│     reason: "Es la verificación final sobre la asignación ya hecha. Confirma que se cumplen las reglas y deja un veredicto claro de viabilidad.",
│   }
│ ]
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────────┐
│ │                   │ Values    │
│ ├───────────────────┼───────────┤
│ │ Con planificación  │ undefined  │
│ └───────────────────┴───────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada.
*/

/*
!esta tarea me ha costado 0.21€, 54000 tokens y ~1.5min -> esto es asquerosamente caro para lo que es
! he pasado a usar "claude-haiku-5-5" comomodelo por defecto de cladue 
====== PLANNING 
│ 
│   ┌─ [with planning] step 1 · 2701 tokens
│   │  TEXT  → {"steps":[{"goal":"Inventariar villanos, debilidades y prioridades, y agrupar a los villanos por la especialidad requerida (fuego, tecnología, luz, te
│   └─
│ 
│   ┌─ [with planning] step 2 · 1881 tokens
│   │  TEXT  → # Paso 1: Inventario de villanos y agrupación por especialidad
│ 
│ ## Inventario ordenado por prioridad (1 = más urgente)
│ 
│ | Prioridad | Villano | Poder 
│   └─
│ 
│   ┌─ [with planning] step 3 · 2648 tokens
│   │  TEXT  → # Paso 1: Inventario de villanos y agrupación por especialidad
│ 
│ ## Inventario ordenado por prioridad (1 = más urgente)
│ 
│ | Prioridad | Villano | Poder 
│   └─
│ 
│   ┌─ [with planning] step 4 · 3671 tokens
│   │  TEXT  → # Paso 2: Horas de los héroes convertidas en operaciones
│ 
│ Cada operación cuesta 2 horas, así que operaciones = horas ÷ 2, redondeando hacia abajo. Una
│   └─
│ 
│   ┌─ [with planning] step 5 · 4875 tokens
│   │  TEXT  → # Paso 3: Demanda frente a capacidad y viabilidad
│ 
│ Cada villano requiere una operación de su especialidad, es decir, 2 horas de un héroe con esa espec
│   └─
│ 
│   ┌─ [with planning] step 6 · 5487 tokens
│   │  TEXT  → # Paso 4: Villano capaz de liberar a los demás y primer objetivo
│ 
│ ## Revisión del poder de cada villano
│ 
│ | Villano | Poder | ¿Puede liberar a otros? |
│   └─
│ 
│   ┌─ [with planning] step 7 · 6517 tokens
│   │  TEXT  → # Paso 5: Secuencia de captura tras el villano liberador
│ 
│ ## Punto de partida
│ 
│ - Mirror Master ya está fijado como 1.º objetivo, porque puede liberar 
│   └─
│ 
│   ┌─ [with planning] step 8 · 7771 tokens
│   │  TEXT  → # Paso 6: Asignación de héroes a villanos y verificación de horas
│ 
│ ## Criterios
│ 
│ - Cada villano se asigna a un héroe de la especialidad que lo detiene
│   └─
│ 
│   ┌─ [with planning] step 9 · 9353 tokens
│   │  TEXT  → # Paso 7: Programación de las operaciones en bloques de 2 horas
│ 
│ ## Criterios
│ 
│ - Cada operación ocupa un bloque de 2 horas. Los héroes distintos traba
│   └─
│ 
│   ┌─ [with planning] step 10 · 9329 tokens
│   │  TEXT  → # Operativo de recaptura: resumen final
│ 
│ **Viabilidad: viable.** Demanda de 7 operaciones (14 h) frente a 9 disponibles. La condición es que Superman 
│   └─
│ 
│ 
│  final plan:  # Operativo de recaptura: resumen final
│ 
│ **Viabilidad: viable.** Demanda de 7 operaciones (14 h) frente a 9 disponibles. La condición es que Superman gaste su única operación en **luz**, porque sin él luz queda con déficit de 1.
│ 
│ ## Orden de captura
│ 1. **Mirror Master (3/7)** va primero por la regla del villano liberador, aunque su prioridad sea 3.
│ 2. Después van por prioridad: Mister Freeze (1), Killgrave (2), Doctor Light (4), Juggernaut (5), Solomon Grundy (6) y The Shade (7).
│ 
│ ## Asignación y calendario (2 h por operación, héroes en paralelo)
│ 
│ | Bloque | Héroe | Villano |
│ |---|---|---|
│ | 1 (h 0-2) | Iron Man | **Mirror Master**, él solo |
│ | 2 (h 2-4) | Antorcha Humana | Mister Freeze |
│ | | Iron Man | Killgrave |
│ | | Green Lantern | Doctor Light |
│ | | Jean Grey | Juggernaut |
│ | 3 (h 4-6) | Green Lantern | Solomon Grundy |
│ | | Superman | The Shade |
│ 
│ ## Horas por héroe
│ 
│ | Héroe | Usadas / disponibles |
│ |---|---|
│ | Antorcha Humana | 2 / 6 |
│ | Green Lantern | 4 / 4 |
│ | Iron Man | 4 / 5 |
│ | Jean Grey | 2 / 3 |
│ | Superman | 2 / 2 |
│ 
│ Ningún héroe excede sus horas. Se usan 14 h en total, sin solapamientos y sin villanos omitidos. La duración total es de 6 h (3 bloques).
│ 
│ ## Riesgos y contingencia
│ - **Luz no tiene margen.** Green Lantern y Superman quedan al tope, así que si falla una operación de luz no hay reemplazo.
│ - **Las horas sobrantes no sirven para otras especialidades.** Antorcha Humana (4 h), Iron Man (1 h) y Jean Grey (1 h) solo cubrirían un reintento en su propia especialidad. Para fuego, Antorcha Humana puede repetir hasta 2 veces.
│ - **Si Mirror Master falla,** se repite su operación antes de actuar contra nadie más. Iron Man tiene 1 h libre, que no alcanza para otra operación completa, así que habría que cubrir la repetición con una de las operaciones de Killgrave y dejar a ese villano sin captura.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Con planificación  │ 10    │ 54233       │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada.
*/

/*
! esto es con haiku 5.5
! ha costado 0.03€, ha tardado ~1.5min y ha consumido 58000 tokens

 ====== PLANNING 
│ 
│   ┌─ [with planning] step 1 · 5298 tokens
│   │  TEXT  → {"steps":[{"goal":"Verificar la viabilidad comparando la demanda de operaciones por especialidad con las horas disponibles: fuego 1 operación (Freeze)
│   └─
│ 
│   ┌─ [with planning] step 2 · 2564 tokens
│   │  TEXT  → ## Verificación de viabilidad: demanda vs. capacidad por especialidad
│ 
│ Cada villano requiere 1 operación de 2 horas. Cada héroe puede realizar `floor(
│   └─
│ 
│   ┌─ [with planning] step 3 · 3015 tokens
│   │  TEXT  → ## Verificación de viabilidad
│ 
│ Comprobé los cálculos de cada especialidad y son correctos. Cada héroe tiene `floor(horas / 2)` operaciones, y cada vil
│   └─
│ 
│   ┌─ [with planning] step 4 · 3702 tokens
│   │  TEXT  → ## Verificación de viabilidad
│ 
│ Cada villano requiere una operación de 2 horas. Cada héroe puede realizar `floor(horas / 2)` operaciones.
│ 
│ | Especialid
│   └─
│ 
│   ┌─ [with planning] step 5 · 4758 tokens
│   │  TEXT  → ## Verificación de viabilidad
│ 
│ Cada villano requiere una operación de 2 horas, y cada héroe puede realizar `floor(horas / 2)` operaciones.
│ 
│ | Especial
│   └─
│ 
│   ┌─ [with planning] step 6 · 5075 tokens
│   │  TEXT  → ## Paso: contener a Mister Freeze con Antorcha Humana
│ 
│ | Héroe | Villano | Operación | Horas consumidas | Horas restantes |
│ |---|---|---|---|---|
│ | An
│   └─
│ 
│   ┌─ [with planning] step 7 · 5898 tokens
│   │  TEXT  → ## Paso: contener a Mister Freeze con Antorcha Humana
│ 
│ **Estado: pendiente. No debe ejecutarse todavía.**
│ 
│ Mirror Master puede sacar a otros villanos 
│   └─
│ 
│   ┌─ [with planning] step 8 · 5922 tokens
│   │  TEXT  → ## Paso: neutralizar a The Shade con Superman (prioridad 3)
│ 
│ | Héroe | Villano | Especialidad requerida | Operación | Horas consumidas | Horas restant
│   └─
│ 
│   ┌─ [with planning] step 9 · 6394 tokens
│   │  TEXT  → ## Paso: neutralizar a Solomon Grundy con la segunda operación de Green Lantern (prioridad 4)
│ 
│ | Héroe | Villano | Especialidad requerida | Operación 
│   └─
│ 
│   ┌─ [with planning] step 10 · 6842 tokens
│   │  TEXT  → ## Paso: neutralizar a Juggernaut con Jean Grey (prioridad 5)
│ 
│ | Héroe | Villano | Especialidad requerida | Operación | Horas consumidas | Horas resta
│   └─
│ 
│   ┌─ [with planning] step 11 · 8880 tokens
│   │  TEXT  → ## Resumen final del operativo
│ 
│ **Viabilidad: sí, pero sin margen de error.** Los 7 villanos pueden capturarse con los recursos disponibles, pero solo
│   └─
│ 
│ 
│  final plan:  ## Resumen final del operativo
│ 
│ **Viabilidad: sí, pero sin margen de error.** Los 7 villanos pueden capturarse con los recursos disponibles, pero solo si cada operación sale bien a la primera. Ningún héroe de luz, tecnología ni telequinesis tiene reserva.
│ 
│ ### Asignación y orden de captura
│ 
│ | Prioridad | Villano | Héroe | Especialidad | Ventana | Motivo |
│ |---|---|---|---|---|---|
│ | 1 | Mirror Master | Iron Man (op. 1) | Tecnología | 0–2 h | Puede liberar a los demás; debe caer primero |
│ | 2 | Killgrave | Iron Man (op. 2) | Tecnología | 2–4 h | Controla mentes con la voz |
│ | 3 | Doctor Light | Green Lantern (op. 1) | Luz | 2–4 h | Absorbe luz y puede interferir con los ataques de luz |
│ | 4 | The Shade | Superman | Luz | 4–6 h | Amenaza 7/7; debe esperar a Doctor Light |
│ | 5 | Solomon Grundy | Green Lantern (op. 2) | Luz | 4–6 h | Debe caer después de Doctor Light |
│ | 6 | Juggernaut | Jean Grey | Telequinesis | 2–4 h | Solo puede empezar tras Mirror Master |
│ | 7 | Mister Freeze | Antorcha Humana | Fuego | 2–4 h | Amenaza mínima (1/7); operación independiente |
│ 
│ ### Uso de horas
│ 
│ - **Iron Man:** 4 de 5 h (sobra 1 h, inutilizable).
│ - **Green Lantern:** 4 de 4 h.
│ - **Superman:** 2 de 2 h.
│ - **Jean Grey:** 2 de 3 h (sobra 1 h, inutilizable).
│ - **Antorcha Humana:** 2 de 6 h (4 h de reserva, solo útiles para fuego).
│ 
│ Ningún héroe supera sus horas disponibles. El operativo termina en 6 horas.
│ 
│ ### Riesgos
│ 
│ 1. **Luz (3 villanos, 3 operaciones):** depende exclusivamente de Green Lantern y Superman. Si una operación falla, no hay repetición posible.
│ 2. **Tecnología y telequinesis:** misma situación. Un fallo en Mirror Master, Killgrave o Juggernaut deja la captura sin solución.
│ 3. **Mirror Master:** si no cae en las primeras 2 horas, todo el plan se bloquea, porque los demás villanos podrían ser liberados.
│ 
│ ### Conclusión
│ 
│ El operativo es **viable** y se puede ejecutar siguiendo el orden anterior. Sin embargo, cualquier fallo en una operación de luz, tecnología o telequinesis hace **inviable** completar la misión con los recursos actuales.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Con planificación │ 11    │ 58348       │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada
 */

//! AQUÍ VOY A USAR "gpt-5-mini" con planning

/*
! este ha tardado ~1min, ha costado 0.02€ y ha consumido 22500token

│ ====== PLANNING 
│ 
│   ┌─ [with planning] step 1 · 3484 tokens
│   │  TEXT  → {"steps":[{"goal":"Neutralizar a Mirror Master (tecnología) asignando a Iron Man.","reason":"Mirror Master puede sacar a otros de sus celdas, por regl
│   └─
│ 
│   ┌─ [with planning] step 2 · 1364 tokens
│   │  TEXT  → Hecho.
│ 
│ - Asignación: Iron Man (especialidad: tecnología) neutraliza a Mirror Master (detenido por tecnología).
│ - Cumple las reglas: Mirror Master pue
│   └─
│ 
│   ┌─ [with planning] step 3 · 1229 tokens
│   │  TEXT  → Confirmado — paso resuelto.
│ 
│ Detalles de la operación realizada:
│ - Asignación: Iron Man (especialidad: tecnología) neutraliza a Mirror Master.
│ - Motiv
│   └─
│ 
│   ┌─ [with planning] step 4 · 1609 tokens
│   │  TEXT  → Hecho — paso resuelto.
│ 
│ Detalles de la operación realizada:
│ - Asignación: Antorcha Humana (especialidad: fuego) neutraliza a Mister Freeze (detenido p
│   └─
│ 
│   ┌─ [with planning] step 5 · 2213 tokens
│   │  TEXT  → Hecho — paso resuelto.
│ 
│ Detalles de la operación realizada:
│ - Asignación: Iron Man (especialidad: tecnología) neutraliza a Killgrave (detenido por tec
│   └─
│ 
│   ┌─ [with planning] step 6 · 2266 tokens
│   │  TEXT  → Hecho — paso resuelto.
│ 
│ Detalles de la operación realizada:
│ - Asignación: Green Lantern (especialidad: luz) neutraliza a Doctor Light (detenido por lu
│   └─
│ 
│   ┌─ [with planning] step 7 · 2921 tokens
│   │  TEXT  → Hecho — paso resuelto.
│ 
│ Operación realizada:
│ - Asignación: Jean Grey (telequinesis) neutraliza a Juggernaut.
│ - Coste: 2 horas.
│ - Horas restantes de Je
│   └─
│ 
│   ┌─ [with planning] step 8 · 3757 tokens
│   │  TEXT  → Estado actual confirmado:
│ - Villanos recapturados: Mirror Master, Mister Freeze, Killgrave, Doctor Light, Juggernaut.
│ - Villanos pendientes (por prior
│   └─
│ 
│   ┌─ [with planning] step 9 · 3737 tokens
│   │  TEXT  → Resumen final (orden, prioridades y asignaciones). Viable — todos recapturados.
│ 
│ Reglas aplicadas: cada operación = 2 h del héroe; los héroes actúan e
│   └─
│ 
│ 
│  final plan:  Resumen final (orden, prioridades y asignaciones). Viable — todos recapturados.
│ 
│ Reglas aplicadas: cada operación = 2 h del héroe; los héroes actúan en paralelo pero no pueden exceder sus horas; se atiende por prioridad (1 más urgente) excepto que Mirror Master, que puede liberar a otros, debe caer antes que nadie.
│ 
│ Orden de ejecución y asignaciones (con motivo y coste):
│ 1) Mirror Master (puede liberar a otros) — Iron Man (tecnología). Coste: 2 h.  
│ 2) Mister Freeze (amenaza 1) — Antorcha Humana (fuego). Coste: 2 h.  
│ 3) Killgrave (amenaza 2) — Iron Man (tecnología). Coste: 2 h.  
│ 4) Doctor Light (amenaza 4) — Green Lantern (luz). Coste: 2 h.  
│ 5) Juggernaut (amenaza 5) — Jean Grey (telequinesis). Coste: 2 h.  
│ 6) Solomon Grundy (amenaza 6, detenido por luz) — Green Lantern (luz). Coste: 2 h.  
│ 7) The Shade (amenaza 7, detenido por luz) — Superman (luz/fuego). Coste: 2 h.
│ 
│ Horas consumidas y restantes por héroe:
│ - Iron Man: 5 h iniciales → usado 4 h (Mirror Master + Killgrave) → 1 h restante.  
│ - Antorcha Humana: 6 h → usado 2 h (Mister Freeze) → 4 h restante.  
│ - Green Lantern: 4 h → usado 4 h (Doctor Light + Solomon Grundy) → 0 h restante.  
│ - Jean Grey: 3 h → usado 2 h (Juggernaut) → 1 h restante.  
│ - Superman: 2 h → usado 2 h (The Shade) → 0 h restante.
│ 
│ Resultado final: todos los villanos recapturados en el orden indicado, respetando prioridades y la excepción de liberador. Operativo viable y completo.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Con planificación │ 9     │ 22580       │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada.
*/

//! AQUÍ VOY A USAR "gpt-6-luna" con planning

/*
! ha consumido 16000 token, ha tardado 1min y ha costado 0.01€

====== PLANNING 
│ 
agentic-patterns dev $ bun src/main.ts
│ [1 lines elided]
│ 
│   ┌─ [with planning] step 1 · 1545 tokens
agentic-patterns dev $ bun src/main.ts
│ [2 lines elided]
│   ┌─ [with planning] step 1 · 1545 tokens
│   │  TEXT  → {"steps":[{"goal":"Traducir las reglas en criterios de planificación: cada recaptura cuagentic-patterns dev $ bun src/main.ts
│ [8 lines elided]
│ 
│ - Cada recaptura cuenta como una operación y consume **2 horas** del héroe asignado.
agentic-patterns dev $ bun src/main.ts
│ [17 lines elided]
│ - Solo puede encargarse de un villano un
│   └─
agentic-patterns dev $ bun src/main.ts
│ [21 lines elided]
│   │  TEXT  → ### Excepción de seguridad
│ 
│ **Mirror Master debe ser neutralizado primero**, antes que cualquier otro villano, porque puede libeagentic-patterns dev $ bun src/main.ts
│ [27 lines elided]
│   │  TEXT  → Tras neutralizar primero a **Mirror Master**, el orden de los seis villanos restantes por urgencia es:
│ 
agentic-patterns dev $ bun src/main.ts
│ [44 lines elided]
│ 
│   ┌─ [with planning] step 8 · 2073 tokens
│   │  TEXT  → ### Asignación viable
│ 
│ | Orden | Villano | Héroe asignado | Horas |
agentic-patterns dev $ bun src/main.ts
│ [47 lines elided]
│ 
│ | Orden | Villano | Héroe asignado | Horas |
│ |---:|---|---|---:|
│ | 1 | **Mirror Master** | Iron Man | 2 |
│ | 2 | Mister Freeze |
agentic-patterns dev $ bun src/main.ts
│ [52 lines elided]
│   └─
│ 
│   ┌─ [with planning] step 9 · 2841 tokens
│   │  TEXT  → Con la regla de prioridad interpretada estrictamente —un objetivo menos urgente no puede empezar antes de que el más urgente esté neutralizado— **no s
agentic-patterns dev $ bun src/main.ts
│ [57 lines elided]
│ 
│   ┌─ [with planning] step 10 · 2426 tokens
│   │  TEXT  → ## Operativo viable
│ 
agentic-patterns dev $ bun src/main.ts
│ ====== PLANNING 
│ 
│   ┌─ [with planning] step 1 · 1545 tokens
│   │  TEXT  → {"steps":[{"goal":"Traducir las reglas en criterios de planificación: cada recaptura cuesta 2 horas, solo puede realizarla un héroe con la especialida
│   └─
│ 
│   ┌─ [with planning] step 2 · 829 tokens
│   │  TEXT  → ### Criterios de planificación
│ 
│ - Cada recaptura cuenta como una operación y consume **2 horas** del héroe asignado.
│ - Solo puede recapturar a un vill
│   └─
│ 
│   ┌─ [with planning] step 3 · 1006 tokens
│   │  TEXT  → ### Criterios de planificación
│ 
│ - Cada recaptura es una operación que consume **2 horas** del héroe asignado.
│ - Solo puede encargarse de un villano un
│   └─
│ 
│   ┌─ [with planning] step 4 · 1025 tokens
│   │  TEXT  → ### Excepción de seguridad
│ 
│ **Mirror Master debe ser neutralizado primero**, antes que cualquier otro villano, porque puede liberar a los demás. Para 
│   └─
│ 
│   ┌─ [with planning] step 5 · 1197 tokens
│   │  TEXT  → Tras neutralizar primero a **Mirror Master**, el orden de los seis villanos restantes por urgencia es:
│ 
│ 1. **Mister Freeze** — amenaza 1/7  
│ 2. **Kill
│   └─
│ 
│   ┌─ [with planning] step 6 · 1669 tokens
│   │  TEXT  → ### Recursos necesarios y horas compatibles
│ 
│ | Especialidad | Villanos que requieren esa especialidad | Recapturas | Horas necesarias | Horas disponib
│   └─
│ 
│   ┌─ [with planning] step 7 · 2049 tokens
│   │  TEXT  → ### Comprobación de capacidad
│ 
│ Sí, **hay capacidad suficiente** para recapturar a los siete villanos sin exceder ningún presupuesto. Una asignación vi
│   └─
│ 
│   ┌─ [with planning] step 8 · 2073 tokens
│   │  TEXT  → ### Asignación viable
│ 
│ | Orden | Villano | Héroe asignado | Horas |
│ |---:|---|---|---:|
│ | 1 | **Mirror Master** | Iron Man | 2 |
│ | 2 | Mister Freeze |
│   └─
│ 
│   ┌─ [with planning] step 9 · 2841 tokens
│   │  TEXT  → Con la regla de prioridad interpretada estrictamente —un objetivo menos urgente no puede empezar antes de que el más urgente esté neutralizado— **no s
│   └─
│ 
│   ┌─ [with planning] step 10 · 2426 tokens
│   │  TEXT  → ## Operativo viable
│ 
│ Se neutraliza primero a **Mirror Master**, porque puede liberar a los demás. Después se sigue estrictamente el orden de amenaza. 
│   └─
│ 
│ 
│  final plan:  ## Operativo viable
│ 
│ Se neutraliza primero a **Mirror Master**, porque puede liberar a los demás. Después se sigue estrictamente el orden de amenaza. Para no adelantar a un objetivo menos urgente, las operaciones se realizan **una tras otra**, con confirmación antes de avanzar.
│ 
│ | Etapa | Objetivo | Héroe | Duración |
│ |---:|---|---|---:|
│ | 1 | **Mirror Master** | Iron Man | 2 h |
│ | 2 | **Mister Freeze** | Antorcha Humana | 2 h |
│ | 3 | **Killgrave** | Iron Man | 2 h |
│ | 4 | **Doctor Light** | Green Lantern | 2 h |
│ | 5 | **Juggernaut** | Jean Grey | 2 h |
│ | 6 | **Solomon Grundy** | Green Lantern | 2 h |
│ | 7 | **The Shade** | Superman | 2 h |
│ 
│ Tras cada etapa, confirmar la recaptura antes de iniciar la siguiente. El operativo dura **14 horas en total** y respeta los presupuestos: Iron Man 4/5 h, Antorcha Humana 2/6 h, Green Lantern 4/4 h, Jean Grey 2/3 h y Superman 2/2 h. **Todos los villanos pueden ser recapturados con los recursos disponibles.**
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────┬───────┬─────────────┐
│ │                   │ steps │ totalTokens │
│ ├───────────────────┼───────┼─────────────┤
│ │ Con planificación │ 10    │ 16660       │
│ └───────────────────┴───────┴─────────────┘
│ 
│   Planificar cuesta más llamadas y más tokens.
│   Lo que compra es que las restricciones sobrevivan hasta el final.
│   Si no hay restricciones que perder, no compra nada
*/
