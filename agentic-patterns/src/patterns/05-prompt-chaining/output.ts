/*
explicación del patrón:

este patrón se basa en modificar el output del agente a través de una cadena de
distintos prompts. dependiendo de ese output, podrá entrar a la siguiente parte 
del flujo o salirse. dependiendo de qué tan bueno es el output  que el prompt
estaba pidiendo

assets: https://www.ibm.com/think/topics/prompt-chaining
*/

/*
! con un one-shot prompt, a veces el modelo lo completa o a veces no me devuelve nada
! aunuqe afirma haber completado 3 pasos (los cuales no dependen del tamaño sino de una
! función en concreto)

│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ A) SIN CADENA ═══
│ 
│ 
│   ┌─ [sin-cadena] step 1 · 2325 tokens
│   └─
│ 
│ 
│  longitud real: 0 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (0)
│      ✗ Mínimo 240 caracteres. Actual: 0. (falta: 240)
│      ✗ Título exacto
│      ✗ Precio
│      ✗ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 3/7 requisitos cumplidos
│ 
│      ⚠️ El requisito estaba en el prompt.
│       El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
│       procesa tokens. Aquí no hay prompt que valga.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Sin cadena │ 1     │ 2325        │ 0       │ 3     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘


│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ A) SIN CADENA ═══
│ 
│ 
│   ┌─ [sin-cadena] step 1 · 1686 tokens
│   │  TEXT  → Patrones de diseño agéntico: Respuestas efectivas a desafíos – curso de 18 h por $34.99 USD. Dominalas tácticas de IA con ejemplos claros y aplicable
│   └─
│ Patrones de diseño agéntico: Respuestas efectivas a desafíos – curso de 18 h por $34.99 USD. Domina las tácticasde IA con ejemplos claros y aplicables. Inscríbete ahora: https://cursos.devtalles.com/cursos/patrones-diseno-agentico ¡No esperes!
│ 
│  longitud real: 244 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (244)
│      ✓ Mínimo 240 caracteres. Actual: 244. (falta: -4)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│      ⚠️ El requisito estaba en el prompt.
│       El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
│       procesa tokens. Aquí no hay prompt que valga.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Sin cadena │ 1     │ 1686        │ 0       │ 7     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘

! aunque con un modelo frontera, pasa a la primera todas las veces. quizá esta tarea sea sencilla

│       gpt-6-luna
│       openai.responses
│ 
│ ═══ A) SIN CADENA ═══
│ 
│ 
│   ┌─ [sin-cadena] step 1 · 1171 tokens
│   │  TEXT  → Nuevo curso para desarrolladores: Patrones de diseño agéntico: Respuestas efectivas a desafíos. En 18 horas, revisa patrones para afrontar retos de di
│   └─
│ Nuevo curso para desarrolladores: Patrones de diseño agéntico: Respuestas efectivas a desafíos. En 18 horas, revisa patrones para afrontar retos de diseño de sistemas agénticos. Precio: 34.99 USD. Más información: https://cursos.devtalles.com/cursos/patrones-diseno-agentico
│ 
│  longitud real: 274 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (274)
│      ✓ Mínimo 240 caracteres. Actual: 274. (falta: -34)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│      ⚠️ El requisito estaba en el prompt.
│       El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
│       procesa tokens. Aquí no hay prompt que valga.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Sin cadena │ 1     │ 1171        │ 0       │ 7     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘
*/

/*
!! con modelos frontera, aunque sean menos inteligentes hace un buen trabajo incluso a la primera
!! pero con modelos más desfasados, no consigue resolver la tarea (incluso se degrada porque empieza
!! a aceptar emojis cosa que en la condición incial se le dijo que no) 

!        gpt-6-luna
!│       openai.responses
│ 
│ ═══ B) CON CADENA ═══
│ 
│ 
│   ┌─ [con-cadena] step 1 · 907 tokens
│   │  TEXT  → Ya está disponible el curso Patrones de diseño agéntico: Respuestas efectivas a desafíos. En 18 horas, explora patrones para diseñar agentes y respond
│   └─
│ Borrador: 267 caracteres
│ Gate superada ✅ en el intento 1
│ Ya está disponible el curso Patrones de diseño agéntico: Respuestas efectivas a desafíos. En 18 horas, explora patrones para diseñar agentes y responder a problemas comunes en desarrollo. Precio: 34.99 USD. https://cursos.devtalles.com/cursos/patrones-diseno-agentico
│ 
│  longitud real: 267 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (267)
│      ✓ Mínimo 240 caracteres. Actual: 267. (falta: -27)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Con cadena │ 1     │ 907         │ 0       │ 7     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘

!        openai/gpt-oss-20b
!│       groq.chat
│ 
│ ═══ A) SIN CADENA ═══
│ 
│ 
│   ┌─ [sin-cadena] step 1 · 2325 tokens
│   └─
│ 
│ 
!│  longitud real: 0 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (0)
│      ✗ Mínimo 240 caracteres. Actual: 0. (falta: 240)
│      ✗ Título exacto
│      ✗ Precio
│      ✗ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 3/7 requisitos cumplidos
│ 
│      ⚠️ El requisito estaba en el prompt.
│       El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
│       procesa tokens. Aquí no hay prompt que valga.
│ 
!│       openai/gpt-oss-20b
!│       groq.chat
│ 
│ ═══ B) CON CADENA ═══
│ 
│ 
│   ┌─ [con-cadena] step 1 · 2325 tokens
│   └─
│ Borrador: 0 caracteres
│  🔴 El anuncio tiene 0 caracteres y se queda corto: te faltan 240 para el mínimo de 240. Amplíalo sin pasar de 280: añade un beneficio concreto del curso o menciona las 18 horas.
│ 
│   ┌─ [con-cadena] step 2 · 1912 tokens
│   │  TEXT  → 🚀 ¡Inscríbete en nuestro curso de 18 horas y domina la creación de presentaciones que convierten! Descubre técnicas profesionales para cautivar a tu 
│   └─
│ intento 1: 267 caracteres
!│ Gate superada ✅ en el intento 2
│ 🚀 ¡Inscríbete en nuestro curso de 18 horas y domina la creación de presentaciones que convierten! Descubre técnicas profesionales para cautivar a tu audiencia, aumentar tu tasa de cierre y destacar en tu sector. Reserva tu lugar hoy. ¡No pierdas esta oportunidad! 💡
│ 
│  longitud real: 267 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (267)
│      ✓ Mínimo 240 caracteres. Actual: 267. (falta: -27)
│      ✗ Título exacto
│      ✗ Precio
│      ✗ Enlace
│      ✓ Sin markdown
│      ✗ Sin emojis
│      → 3/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Sin cadena │ 1     │ 2325        │ 0       │ 3     │
│ │ Con cadena │ 2     │ 4237        │ 1       │ 3     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘
│ 
*/

/*
!! este resultado es con la salvaguarda del updatedAnnouncement que le pasa
!! el prompt original para no degaradar la respuesta del agente por culpa
!! del prompt chaining

│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ A) SIN CADENA ═══
│ 
│ 
│   ┌─ [sin-cadena] step 1 · 1948 tokens
│   │  TEXT  → Nuevo curso: Patrones de diseño agéntico: Respuestas efectivas a desafíos. 18 horas de contenido práctico para desarrolladores. Precio: 34.99 USD. Ins
│   └─
│ Nuevo curso: Patrones de diseño agéntico: Respuestas efectivas a desafíos. 18 horas de contenido práctico para desarrolladores. Precio: 34.99 USD. Inscríbete aquí: https://cursos.devtalles.com/cursos/patrones-diseno-agentico Únete y domina el futuro.
│ 
│  longitud real: 250 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (250)
│      ✓ Mínimo 240 caracteres. Actual: 250. (falta: -10)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│      ⚠️ El requisito estaba en el prompt.
│       El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
│       procesa tokens. Aquí no hay prompt que valga.
│ 
│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ B) CON CADENA ═══
│ 
│ 
│   ┌─ [con-cadena] step 1 · 2159 tokens
│   │  TEXT  → Patrones de diseño agéntico: Respuestas efectivas a desafíos. Curso de 18h para devs que buscan respuestas problemas complejos. 34.99 USD. Más info y 
│   └─
│ Borrador: 219 caracteres
│  🔴 El anuncio tiene 219 caracteres y se queda corto: te faltan 21 para el mínimo de 240. Amplíalo sin pasar de 280: añade un beneficio concreto del curso o menciona las 18 horas.
│ 
│   ┌─ [con-cadena] step 2 · 2388 tokens
│   │  TEXT  → Patrones de diseño agéntico: Respuestas efectivas a desafíos es un curso intensivo de 18h que te enseña a aplicar patrones para resolver problemas com
│   └─
│ intento 1: 280 caracteres
│ Gate superada ✅ en el intento 2
│ Patrones de diseño agéntico: Respuestas efectivas a desafíos es un curso intensivo de 18h que te enseña a aplicar patrones para resolver problemas complejos con código limpio y escalable. 34.99 USD. Más info y registro: https://cursos.devtalles.com/cursos/patrones-diseno-agentico
│ 
│  longitud real: 280 caracteres
│ 
│  auditoria
│      ✓ ≤ 280 caracteres (280)
│      ✓ Mínimo 240 caracteres. Actual: 280. (falta: -40)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────┬───────┬─────────────┬─────────┬───────┐
│ │            │ steps │ totalTokens │ retries │ score │
│ ├────────────┼───────┼─────────────┼─────────┼───────┤
│ │ Sin cadena │ 1     │ 1948        │ 0       │ 7     │
│ │ Con cadena │ 2     │ 4547        │ 1       │ 7     │
│ └────────────┴───────┴─────────────┴─────────┴───────┘

*/

/*
!! este es el último paso que se hizo donde el promopt chaining entra en acción
!! sin este, el modelo habría fallado estrepitosamente pero al proporcionarle una forma de evaluar
!! su desempeño a través de prompts y siempre recordarle qué es lo que debe hacer
!! nos cubrimos las espaldas y "siempre" debería salir bien aun sin tener un modelo thinking
!! y si no sale bien, para eso creas el circuit breaker

│       openai/gpt-oss-20b
│       groq.chat
│ 
│ ═══ C) RIESGO: BUCLE SIN TOPE ═══
│ 
│ 
│   ┌─ [sin-tope] step 1 · 2325 tokens
│   └─
│ {
│   feddback: "\u001B[35mProblemas: \n Mínimo 240 caracteres. Actual: 0. (falta: 240)\nTítulo exacto\nPrecio\nEnlace\u001B[0m",
│ }
│ 
│   ┌─ [sin-tope] step 2 · 2365 tokens
│   └─
│ Intento 1 
│   ---
│ {
│   feddback: "\u001B[35mProblemas: \n Mínimo 240 caracteres. Actual: 0. (falta: 240)\nTítulo exacto\nPrecio\nEnlace\u001B[0m",
│ }
│ 
│   ┌─ [sin-tope] step 3 · 2365 tokens
│   └─
│ Intento 2 
│   ---
│ {
│   feddback: "\u001B[35mProblemas: \n Mínimo 240 caracteres. Actual: 0. (falta: 240)\nTítulo exacto\nPrecio\nEnlace\u001B[0m",
│ }
│ 
│   ┌─ [sin-tope] step 4 · 2365 tokens
│   └─
│ Intento 3 
│   ---
│ {
│   feddback: "\u001B[35mProblemas: \n Mínimo 240 caracteres. Actual: 0. (falta: 240)\nTítulo exacto\nPrecio\nEnlace\u001B[0m",
│ }
│ 
│   ┌─ [sin-tope] step 5 · 1768 tokens
│   │  TEXT  → Patrones de diseño agéntico: Respuestas efectivas a desafíos. Aprende los patrones que optimizan latoma de decisiones en sistemas complejos. Curso de
│   └─
│ Intento 4 
│  Patrones de diseño agéntico: Respuestas efectivas a desafíos. Aprende los patrones que optimizan la toma de decisiones en sistemas complejos. Curso de 18 horas, precio 34.99 USD. Regístrate aquí: https://cursos.devtalles.com/cursos/patrones-diseno-agentico ---
! │ trayectoria: 4->4->4->4
│ auditoria
│      ✓ ≤ 280 caracteres (256)
│      ✓ Mínimo 240 caracteres. Actual: 256. (falta: -16)
│      ✓ Título exacto
│      ✓ Precio
│      ✓ Enlace
│      ✓ Sin markdown
│      ✓ Sin emojis
│      → 7/7 requisitos cumplidos
│ 
│ 
│ 
│   ⚠️  Mira la trayectoria. El modelo se acerca a la solución y se queda
│       rondando: 4 → 3 → 2 → 1 → 1 → 1 → 2 → 1... 
│       Cada iteración cuesta tokens.
│       Sin tope, esto puede no terminar.
│       Todo bucle necesita un techo Y una salida determinista.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────┬───────┬─────────────┬───────┬─────────┐
│ │                │ steps │ totalTokens │ score │ retries │
│ ├────────────────┼───────┼─────────────┼───────┼─────────┤
│ │ Bucle sin tope │ 5     │ 11188       │ 7     │ 4       │
│ └────────────────┴───────┴─────────────┴───────┴─────────┘
│ 
│   El gate son unas pocas líneas de TypeScript y decide algo que el
│   modelo no puede decidir. Esa es toda la idea del patrón.
│ 
│   La cadena no mejora el anuncio: garantiza que cabe y es correcto.
│   "Mejor a veces" y "correcto siempre" no son lo mismo.
│ 
│   Y el eslabón que cierra el caso no es un prompt: es el slice.
*/
