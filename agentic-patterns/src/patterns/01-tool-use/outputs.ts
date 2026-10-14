/*
Explicación del patron:

Es proveer a la AI de herramientas(tool) que pueda usar para 
hacer una mejor tarea o poder completarla porque habrá casos en 
los que necesite de manera obligatoria para completar la tarea
de una tool. Si no la tiene, podría no completar la tarea o 
alucinar e inventarse un resultado.

asstes: https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
*/

/*
* output de gemini dejando que calcule por el mismo las cosas:
│   ┌─ [without-tools] step 1 · 226 tokens
│   │  TEXT  → ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas a qué cursos te refieres específicamente** (por ejemplo, de qué 
│   └─
│ 
│  Respuesta:  ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas a qué cursos te refieres específicamente** (por ejemplo, de qué plataforma son: Udemy, Platzi, Coursera, etc., o cuáles son sus precios y duración base), ya que los costos varían mucho de una plataforma a otra.
│ 
│ Sin embargo, si me das los datos o los nombres de los cursos, con mucho gusto hago el cálculo matemático por ti:
│ 
│ 1. **Samo los precios** de ambos cursos para obtener el total sin descuento.
│ 2. **Le aplico el 20% de descuento** ($Total \times 0.80$) para darte el precio final.
│ 3. **Sumo las horas** de duración de ambos para darte el total de tiempo.
│ 
│ ¡Quedo a la espera de los detalles de los cursos para hacer las cuentas!
│ 
│ 
│   ┌─ [with-tools] step 1 · 192 tokens
│   │  TOOL  → findCourses({"text":"TypeScript"})
│   │  RESULT← {"found":2,"courses":[{"id":"ts-01","title":"TypeScript desde cero","hours":22,"priceUSD":19.99,"level":"basic","students":48120},{"id":"agt-04","titl
│   └─
│ 
│   ┌─ [with-tools] step 2 · 322 tokens
│   │  TOOL  → findCourses({"text":"Docker"})
│   │  RESULT← {"found":1,"courses":[{"id":"dkr-05","title":"Docker para desarrolladores","hours":14,"priceUSD":17.99,"level":"basic","students":35770}]}
│   └─
│ 
│   ┌─ [with-tools] step 3 · 537 tokens
│   │  TEXT  → Para calcular el costo y las horas totales, tomaremos los cursos principales de cada tecnología:
│ 
│ 1. **TypeScript desde cero**
│    - **Precio:** $19.99
│   └─
│ 
│  Respuesta:  Para calcular el costo y las horas totales, tomaremos los cursos principales de cada tecnología:
│ 
│ 1. **TypeScript desde cero**
│    - **Precio:** $19.99 USD
│    - **Duración:** 22 horas
│ 
│ 2. **Docker para desarrolladores**
│    - **Precio:** $17.99 USD
│    - **Duración:** 14 horas
│ 
│ ### Totales:
│ * **Horas totales:** 36 horas
│ * **Precio regular total:** $37.98 USD
│ * **Con el 20% de descuento:** **$30.38 USD** (te ahorras $7.60 USD).
│ 
│ 
│  ======= Comparativa ========
│ ┌───────────┬───────┬─────────────┐
│ │           │ steps │ totalTokens │
│ ├───────────┼───────┼─────────────┤
│ │ sin tools │ 1     │ 226         │
│ │ con tools │ 3     │ 1051        │
│ └───────────┴───────┴─────────────┘
! ojo: con tools el coste se hace exponencial pero a veces es necesario
*/

/*
* output haciendo que calcule los descuentos a través de una función propia

 ┌─ [without-tools] step 1 · 215 tokens
│   │  TEXT  → ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas a qué cursos te refieres específicamente** (por ejemplo, de qué 
│   └─
│ 
│  Respuesta:  ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas aagentic-patterns dev $ bun src/main.ts
│ [8 lines elided]
│ 
│ 1. **Samo el precio del Curso de TypeScript + Curso de Docker.**
│ 2. **Aplico el 20% de descuento** al total ($ \text{Total} \times 0.80 $).
agentic-patterns dev $ bun src/main.ts
│ [14 lines elided]
│ 
│ 
│   ┌─ [with-tools] step 1 · 207 tokens
agentic-patterns dev $ bun src/main.ts
│ 
│   ┌─ [without-tools] step 1 · 215 tokens
│   │  TEXT  → ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas a qué cursos te refieres específicamente** (por ejemplo, de qué 
│   └─
│ 
│  Respuesta:  ¡Hola! Para poder darte el precio exacto y las horas totales, **necesito que me digas a qué cursos te refieres específicamente** (por ejemplo, de qué plataforma son: Udemy, Platzi, Coursera, etc., o cuáles son sus precios y duración base), ya que los costos varían mucho de una plataforma a otra.
│ 
│ Sin embargo, si me das los datos o los nombres de los cursos, con mucho gusto hago el cálculo matemático por ti:
│ 
│ 1. **Samo el precio del Curso de TypeScript + Curso de Docker.**
│ 2. **Aplico el 20% de descuento** al total ($ \text{Total} \times 0.80 $).
│ 3. ** Sumo las horas** de ambos cursos para darte la duración total.
│ 
│ ¡Quedo a la espera de esa información para ayudarte!
│ 
│ 
│   ┌─ [with-tools] step 1 · 207 tokens
│   │  TOOL  → findCourses({"text":"TypeScript"})
│   │  TOOL  → findCourses({"text":"Docker"})
│   │  RESULT← {"found":2,"courses":[{"id":"ts-01","title":"TypeScript desde cero","hours":22,"priceUSD":19.99,"level":"basic","students":48120},{"id":"agt-04","titl
│   │  RESULT← {"found":1,"courses":[{"id":"dkr-05","title":"Docker para desarrolladores","hours":14,"priceUSD":17.99,"level":"basic","students":35770}]}
│   └─
│ 
│   ┌─ [with-tools] step 2 · 619 tokens
│   │  TEXT  → Para responder a tu pregunta, tomé en cuenta los siguientes cursos principales de nuestro catálogo:
│ 
│ 1. **TypeScript desde cero** (22 horas) – Precio:
│   └─
│ 
│  Respuesta:  Para responder a tu pregunta, tomé en cuenta los siguientes cursos principales de nuestro catálogo:
│ 
│ 1. **TypeScript desde cero** (22 horas) – Precio: $19.99 USD
│ 2. **Docker para desarrolladores** (14 horas) – Precio: $17.99 USD
│ 
│ *(Nota: En TypeScript también tenemos "Agentes de IA con TypeScript", pero el curso fundamental y más directo para aprender el lenguaje es "TypeScript desde cero").*
│ 
│ ### Cálculos:
│ * **Precio total sin descuento:** $19.99 + $17.99 = **$37.98 USD**
│ * **Descuento (20%):** $37.98 × 0.20 = **$7.60 USD**
│ * **Precio final con el 20% de descuento:** $37.98 - $7.60 = **$30.38 USD**
│ * **Duración total:** 22 horas + 14 horas = **36 horas** en total.
│ 
│ 
│  ======= Comparativa ========
│ ┌───────────┬───────┬─────────────┐
│ │           │ steps │ totalTokens │
│ ├───────────┼───────┼─────────────┤
│ │ sin tools │ 1     │ 215         │
│ │ con tools │ 2     │ 826         │
│ └───────────┴───────┴─────────────┘

!hay una pequeña diferencia entre usar tools que le damos para que haga algunos cálculos o que el modelo haga los cálculos por el mismo. todo lo que sea ahorrar coste, bienvenido sea
*/
