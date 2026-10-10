/*
 * puebas con "claude-sonnet-5-5"
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
