/*
  este patrón es muy similar al de ReAct ya que también necesitamos tener un plan
  antes de empezar pero en ReAct, a raíz de observar el resultado, actua y vuelve
  a ejecutar las acciones pertinentes para completar el plan.

  en este patrón "paln and execute" el plan se crea tal cual pero también se necesita
  planear el flujo de herramientas que se va a necesitar llamar para su ejecución.
  es decir, en este patrón en el propio plan ya está implementado cuáles son las 
  herramientas y los momentos en los que se van a llamar.

  le implementa de forma PROGRAMÁTICA, a través de código, no es el modelo el que 
  lo ejecuta. este solo nos da el plan y qué es lo que tenemos que hacer y ya nosotros
  contruimos el código en la secuencia que nos ha dejado

  en este plan el modelo SOLO interviene una única vez, en el plan. en ReAct, el agente
  puede intervenir tantas veces como sea necesario, o nosotros le digamos, hasta que
  complete la tarea

  assets: https://www.langchain.com/blog/planning-agents
*/

/*
! tarea 'one shot prompt' con el pattern ReAct.Resuelto en 2 pasos y consultó 8 tools de 4 en 4
│ 
│ ##### TAREA PREDECIBLE #####
│ 
│       claude-haiku-5-5
│       anthropic.messages
│ 
│ ═══ A) REACT ═══
│ 
│ 
│   ┌─ [react] step 1 · 1149 tokens
│   │  TOOL  → getCellStatus({"villain":"Mister Freeze"})
│   │  TOOL  → getCellStatus({"villain":"Killgrave"})
│   │  TOOL  → getCellStatus({"villain":"Mirror Master"})
│   │  TOOL  → getCellStatus({"villain":"Juggernaut"})
│   │  TOOL  → getGuardLog({"villain":"Mister Freeze"})
│   │  TOOL  → getGuardLog({"villain":"Killgrave"})
│   │  TOOL  → getGuardLog({"villain":"Mirror Master"})
│   │  TOOL  → getGuardLog({"villain":"Juggernaut"})
│   │  RESULT← {"villain":"Mister Freeze","block":"C","cell":12,"integrity":97,"lastInspection":"2026-08-20"}
│   │  RESULT← {"villain":"Killgrave","block":"A","cell":3,"integrity":88,"lastInspection":"2026-08-21"}
│   │  RESULT← {"villain":"Mirror Master","block":"D","cell":1,"integrity":41,"lastInspection":"2026-08-15"}
│   │  RESULT← {"villain":"Juggernaut","block":"B","cell":7,"integrity":73,"lastInspection":"2026-08-19"}
│   │  RESULT← {"villain":"Mister Freeze","entries":["Sin novedad","Sin novedad"],"incidents":0}
│   │  RESULT← {"villain":"Killgrave","entries":["Intentó hablar con un guardia; protocolo de silencio aplicado"],"incidents":1}
│   │  RESULT← {"villain":"Mirror Master","entries":["Superficie de la puerta pulida por el interno","Reflejo detectado en el suelo de la celda"],"incidents":2}
│   │  RESULT← {"villain":"Juggernaut","entries":["Sin novedad"],"incidents":0}
│   └─
│ 
│   ┌─ [react] step 2 · 2162 tokens
│   │  TEXT  → **Informe de estado de celdas**
│ 
│ | Villano | Bloque | Celda | Integridad | Última inspección | Incidentes en bitácora |
│ |---|---|---|---|---|---|
│ | Mi
│   └─
│ 
│  Informe: **Informe de estado de celdas**
│ 
│ | Villano | Bloque | Celda | Integridad | Última inspección | Incidentes en bitácora |
│ |---|---|---|---|---|---|
│ | Mister Freeze | C | 12 | 97% | 2026-08-20 | 0 |
│ | Killgrave | A | 3 | 88% | 2026-08-21 | 1 |
│ | Mirror Master | D | 1 | 41% | 2026-08-15 | 2 |
│ | Juggernaut | B | 7 | 73% | 2026-08-19 | 0 |
│ 
│ **Notas de la bitácora:**
│ - **Mister Freeze:** Sin novedad en sus entradas.
│ - **Killgrave:** Intentó hablar con un guardia; se aplicó el protocolo de silencio.
│ - **Mirror Master:** Superficie de la puerta pulida por el interno; reflejo detectado en el suelo de la celda.
│ - **Juggernaut:** Sin novedad en sus entradas.
│ 
│ **Puntos a vigilar:** La celda de Mirror Master tiene la integridad más baja (41%) y la inspección más antigua (15 de agosto), además de dos incidentes registrados. Conviene priorizar su revisión.
│
│ 
│ ═══ B) PLAN-AND-EXECUTE ═══
│ 
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────────┬───────┬─────────────┐
│ │                    │ steps │ totalTokens │
│ ├────────────────────┼───────┼─────────────┤
│ │ ReAct (predecible) │ 2     │ 3311        │
│ └────────────────────┴───────┴─────────────┘
│ 
│   Plan-and-Execute compra coste: menos llamadas, menos tokens.
│   Lo paga con adaptabilidad: el plan se decide antes de ver ningún dato.
│   Si un paso depende del resultado de otro, vuelve a ReAct.
*/

/*
│ ##### TAREA PREDECIBLE #####
│ 
│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ A) REACT ═══
│ 
│ 
│   ┌─ [react] step 1 · 510 tokens
│   │  TOOL  → getCellStatus({"villain":"Mister Freeze"})
│   │  RESULT← {"villain":"Mister Freeze","block":"C","cell":12,"integrity":97,"lastInspection":"2026-08-20"}
│   └─
│ 
│   ┌─ [react] step 2 · 575 tokens
│   │  TOOL  → getGuardLog({"villain":"Mister Freeze"})
│   │  RESULT← {"villain":"Mister Freeze","entries":["Sin novedad","Sin novedad"],"incidents":0}
│   └─
│ 
│   ┌─ [react] step 3 · 638 tokens
│   │  TOOL  → getCellStatus({"villain":"Killgrave"})
│   │  RESULT← {"villain":"Killgrave","block":"A","cell":3,"integrity":88,"lastInspection":"2026-08-21"}
│   └─
│ 
│   ┌─ [react] step 4 · 705 tokens
│   │  TOOL  → getGuardLog({"villain":"Killgrave"})
│   │  RESULT← {"villain":"Killgrave","entries":["Intentó hablar con un guardia; protocolo de silencio aplicado"],"incidents":1}
│   └─
│ 
│   ┌─ [react] step 5 · 771 tokens
│   │  TOOL  → getCellStatus({"villain":"Mirror Master"})
│   │  RESULT← {"villain":"Mirror Master","block":"D","cell":1,"integrity":41,"lastInspection":"2026-08-15"}
│   └─
│ 
│   ┌─ [react] step 6 · 838 tokens
│   │  TOOL  → getGuardLog({"villain":"Mirror Master"})
│   │  RESULT← {"villain":"Mirror Master","entries":["Superficie de la puerta pulida por el interno","Reflejo detectado en el suelo de la celda"],"incidents":2}
│   └─
│ 
│   ┌─ [react] step 7 · 919 tokens
│   │  TOOL  → getCellStatus({"villain":"Juggernaut"})
│   │  RESULT← {"villain":"Juggernaut","block":"B","cell":7,"integrity":73,"lastInspection":"2026-08-19"}
│   └─
│ 
│   ┌─ [react] step 8 · 990 tokens
│   │  TOOL  → getGuardLog({"villain":"Juggernaut"})
│   │  RESULT← {"villain":"Juggernaut","entries":["Sin novedad"],"incidents":0}
│   └─
│ 
│   ┌─ [react] step 9 · 1332 tokens
│   │  TEXT  → **Informe de estado (en español)**  
│ 
│ | Villano | Bloque | Celda | Integridad | Incidentes registrados |
│ |---------|--------|-------|------------|----
│   └─
│ 
│  Informe: **Informe de estado (en español)**  
│ 
│ | Villano | Bloque | Celda | Integridad | Incidentes registrados |
│ |---------|--------|-------|------------|------------------------|
│ | **Mister Freeze** | C | 12 | 97 % | 0 |
│ | **Killgrave** | A | 3 | 88 % | 1 |
│ | **Mirror Master** | D | 1 | 41 % | 2 |
│ | **Juggernaut** | B | 7 | 73 % | 0 |
│ 
│ **Observaciones adicionales**
│ 
│ - **Mister Freeze**: la celda se inspeccionó el 20 de agosto de 2026 y se mantiene en excelente estado. No se registraron incidentes en el registro de guardias.  
│ - **Killgrave**: la última inspección fue el 21 de agosto de 2026. Se documenta un incidente en el que el villano intentó hablar con un guardia; se aplicó el protocolo de silencio.  
│ - **Mirror Master**: la celda muestra un nivel crítico de integridad (41 %) y se inspeccionó el 15 de agosto de 2026. Se registraron dos incidentes: manipulación de la superficie de la puerta y detección de reflejos en el suelo.  
│ - **Juggernaut**: inspección más reciente el 19 de agosto de 2026. No se han registrado incidentes.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────────┬───────┬─────────────┐
│ │                    │ steps │ totalTokens │
│ ├────────────────────┼───────┼─────────────┤
│ │ ReAct (predecible) │ 9     │ 7278        │
│ └────────────────────┴───────┴─────────────┘

*/

/*
! primer paso del plan: solo devuelve qué pasos hay que seguir
│ ##### TAREA PREDECIBLE #####
│ 
│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ B) PLAN-AND-EXECUTE ═══
│ 
│ 
│   ┌─ [plan-and-execute] step 1 · 1329 tokens
│   │  TEXT  → {"steps":[{"tool":"getCellStatus","villain":"Mister Freeze","why":"Obtener bloque, celda y estado de integridad de Mister Freeze."},{"tool":"getGuardL
│   └─
│ 
│  Plan (8 pasos):
│    1. getCellStatus(Mister Freeze) — Obtener bloque, celda y estado de integridad de Mister Freeze.
│    2. getGuardLog(Mister Freeze) — Obtener número de incidentes registrados en el log de Mister Freeze.
│    3. getCellStatus(Killgrave) — Obtener bloque, celda y estado de integridad de Killgrave.
│    4. getGuardLog(Killgrave) — Obtener número de incidentes registrados en el log de Killgrave.
│    5. getCellStatus(Mirror Master) — Obtener bloque, celda y estado de integridad de Mirror Master.
│    6. getGuardLog(Mirror Master) — Obtener número de incidentes registrados en el log de Mirror Master.
│    7. getCellStatus(Juggernaut) — Obtener bloque, celda y estado de integridad de Juggernaut.
│    8. getGuardLog(Juggernaut) — Obtener número de incidentes registrados en el log de Juggernaut.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────────────────┬───────┬─────────────┐
│ │                               │ steps │ totalTokens │
│ ├───────────────────────────────┼───────┼─────────────┤
│ │ Plan-and-Execute (predecible) │ 1     │ 1329        │
│ └───────────────────────────────┴───────┴─────────────┘
*/

/*
! tarea completada: es útil este patrón ya que ahorra tokens en comparación al ReAct. 
│ 
│ ##### TAREA PREDECIBLE #####
│ 
│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ A) REACT ═══
│ 
│ 
│   ┌─ [react] step 1 · 538 tokens
│   │  TOOL  → getCellStatus({"villain":"Mister Freeze"})
│   │  RESULT← {"villain":"Mister Freeze","block":"C","cell":12,"integrity":97,"lastInspection":"2026-08-20"}
│   └─
│ 
│   ┌─ [react] step 2 · 610 tokens
│   │  TOOL  → getGuardLog({"villain":"Mister Freeze"})
│   │  RESULT← {"villain":"Mister Freeze","entries":["Sin novedad","Sin novedad"],"incidents":0}
│   └─
│ 
│   ┌─ [react] step 3 · 670 tokens
│   │  TOOL  → getCellStatus({"villain":"Killgrave"})
│   │  RESULT← {"villain":"Killgrave","block":"A","cell":3,"integrity":88,"lastInspection":"2026-08-21"}
│   └─
│ 
│   ┌─ [react] step 4 · 742 tokens
│   │  TOOL  → getGuardLog({"villain":"Killgrave"})
│   │  RESULT← {"villain":"Killgrave","entries":["Intentó hablar con un guardia; protocolo de silencio aplicado"],"incidents":1}
│   └─
│ 
│   ┌─ [react] step 5 · 808 tokens
│   │  TOOL  → getCellStatus({"villain":"Mirror Master"})
│   │  RESULT← {"villain":"Mirror Master","block":"D","cell":1,"integrity":41,"lastInspection":"2026-08-15"}
│   └─
│ 
│   ┌─ [react] step 6 · 880 tokens
│   │  TOOL  → getGuardLog({"villain":"Mirror Master"})
│   │  RESULT← {"villain":"Mirror Master","entries":["Superficie de la puerta pulida por el interno","Reflejo detectado en el suelo de la celda"],"incidents":2}
│   └─
│ 
│   ┌─ [react] step 7 · 961 tokens
│   │  TOOL  → getCellStatus({"villain":"Juggernaut"})
│   │  RESULT← {"villain":"Juggernaut","block":"B","cell":7,"integrity":73,"lastInspection":"2026-08-19"}
│   └─
│ 
│   ┌─ [react] step 8 · 1039 tokens
│   │  TOOL  → getGuardLog({"villain":"Juggernaut"})
│   │  RESULT← {"villain":"Juggernaut","entries":["Sin novedad"],"incidents":0}
│   └─
│ 
│   ┌─ [react] step 9 · 1260 tokens
│   │  TEXT  → **Informe de estado (en español)**  
│ 
│ | Villano | Bloque | Celda | Integridad de la celda (%) | Incidentes registrados |
│ |---------|--------|-------|-
│   └─
│ 
│  Informe: **Informe de estado (en español)**  
│ 
│ | Villano | Bloque | Celda | Integridad de la celda (%) | Incidentes registrados |
│ |---------|--------|-------|-----------------------------|------------------------|
│ | Mister Freeze | C | 12 | 97 | 0 |
│ | Killgrave | A | 3 | 88 | 1 |
│ | Mirror Master | D | 1 | 41 | 2 |
│ | Juggernaut | B | 7 | 73 | 0 |
│ 
│ **Resumen de incidentes**  
│ - **Mister Freeze**: No hay incidentes registrados.  
│ - **Killgrave**: 1 incidente (intento de comunicación con guardia).  
│ - **Mirror Master**: 2 incidentes (pulsado la puerta y reflejo en el suelo).  
│ - **Juggernaut**: No hay incidentes registrados.
│ 
│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ B) PLAN-AND-EXECUTE ═══
│ 
│ 
│   ┌─ [plan-and-execute] step 1 · 933 tokens
│   │  TEXT  → {"steps":[{"tool":"getCellStatus","villain":"Mister Freeze","why":"obtener información del bloque y celda y su integridad."},{"tool":"getGuardLog","vi
│   └─
│ 
│  Ejecución completada sin consultar al modelo.
│ 
│   ┌─ [plan-and-execute] step 2 · 1091 tokens
│   │  TEXT  → **Informe de Estado – Villanos**
│ 
│ | Villano        | Bloque | Celda | Integridad | Incidentes Registrados |
│ |----------------|--------|-------|-------
│   └─
│ informe:
│  **Informe de Estado – Villanos**
│ 
│ | Villano        | Bloque | Celda | Integridad | Incidentes Registrados |
│ |----------------|--------|-------|------------|------------------------|
│ | Mister Freeze  | C      | 12    | 97         | 0                      |
│ | Killgrave      | A      | 3     | 88         | 1                      |
│ | Mirror Master  | D      | 1     | 41         | 2                      |
│ | Juggernaut     | B      | 7     | 73         | 0                      |
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌───────────────────────────────┬───────┬─────────────┐
│ │                               │ steps │ totalTokens │
│ ├───────────────────────────────┼───────┼─────────────┤
│ │            ReAct (predecible) │ 9     │ 7508        │
│ │ Plan-and-Execute (predecible) │ 2     │ 2024        │
│ └───────────────────────────────┴───────┴─────────────┘
*/
