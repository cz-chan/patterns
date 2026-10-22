/*
  este patrón permite al agente crear y ejecutar su propio código.

  este patrón tienes que cogerlo con pinzas y cuidado proque 
  permitir a un agente que genera código y lo ejecuten en tu máquina
  puede crear vulnerabilidades 
*/

/*
  ! en este caso es imposible que acabe la tarea porque le estoy poniendo una
  ! barrera de 10 pasos

  │ ═══ A) SIN CODEACT — acciones en JSON ═══
│ 
│ 
│   ┌─ [sin-codeact] step 1 · 771 tokens
│   │  TOOL  → getNextVillain({"cursor":"start"})
│   │  RESULT← {"villain":{"alias":"Mirror Master","counteredBy":"tecnología","threat":1},"nextCursor":"vln-1"}
│   └─
│ 
│   ┌─ [sin-codeact] step 2 · 835 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-1"})
│   │  RESULT← {"villain":{"alias":"Killgrave","counteredBy":"tecnología","threat":2},"nextCursor":"vln-2"}
│   └─
│ 
│   ┌─ [sin-codeact] step 3 · 904 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-2"})
│   │  RESULT← {"villain":{"alias":"Mister Freeze","counteredBy":"fuego","threat":3},"nextCursor":"vln-3"}
│   └─
│ 
│   ┌─ [sin-codeact] step 4 · 973 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-3"})
│   │  RESULT← {"villain":{"alias":"Doctor Light","counteredBy":"luz","threat":4},"nextCursor":"vln-4"}
│   └─
│ 
│   ┌─ [sin-codeact] step 5 · 1041 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-4"})
│   │  RESULT← {"villain":{"alias":"Juggernaut","counteredBy":"telequinesis","threat":5},"nextCursor":"vln-5"}
│   └─
│ 
│   ┌─ [sin-codeact] step 6 · 1112 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-5"})
│   │  RESULT← {"villain":{"alias":"Solomon Grundy","counteredBy":"luz","threat":6},"nextCursor":"vln-6"}
│   └─
│ 
│   ┌─ [sin-codeact] step 7 · 1182 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-6"})
│   │  RESULT← {"villain":{"alias":"The Shade","counteredBy":"luz","threat":7},"nextCursor":"vln-7"}
│   └─
│ 
│   ┌─ [sin-codeact] step 8 · 1250 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-7"})
│   │  RESULT← {"villain":{"alias":"Heat Wave","counteredBy":"fuego","threat":8},"nextCursor":"vln-8"}
│   └─
│ 
│   ┌─ [sin-codeact] step 9 · 1318 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-8"})
│   │  RESULT← {"villain":{"alias":"Captain Cold","counteredBy":"fuego","threat":9},"nextCursor":"vln-9"}
│   └─
│ 
│   ┌─ [sin-codeact] step 10 · 1386 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-9"})
│   │  RESULT← {"villain":{"alias":"Brainiac","counteredBy":"tecnología","threat":10},"nextCursor":"vln-10"}
│   └─
│ 
│  Auditoría:
│      ✗ Cobertura: los 12 villanos, sin repetir ni inventar
│      ✗ Especialidad: cada héroe contrarresta de verdad
│      ✗ Presupuesto: nadie excede sus horas
│      ✗ Orden: grupos ordenados por amenaza
│      ✗ Urgencia: amenazas 1-3 cubiertas
│      → 0/5 verificaciones superadas
│ 
│   ⚠️  Presupuesto: 10 pasos.
│       Solo enumerar los 12 villanos con cursor ya consume 12.
│       El JSON no sabe iterar: cada elemento es un viaje al modelo.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────────┬───────┬─────────────┬───────┐
│ │                    │ steps │ totalTokens │ score │
│ ├────────────────────┼───────┼─────────────┼───────┤
│ │ Sin CodeAct (JSON) │ 10    │ 10772       │ 0     │
│ └────────────────────┴───────┴─────────────┴───────┘

│       claude-haiku-5-5
│       anthropic.messages
│ 
│ ═══ A) SIN CODEACT — acciones en JSON ═══
│ 
│ 
│   ┌─ [sin-codeact] step 1 · 1195 tokens
│   │  TOOL  → getNextVillain({"cursor":"start"})
│   │  TOOL  → getNextHero({"cursor":"start"})
│   │  RESULT← {"villain":{"alias":"Mirror Master","counteredBy":"tecnología","threat":1},"nextCursor":"vln-1"}
│   │  RESULT← {"hero":{"alias":"Antorcha Humana","specialty":"fuego","availableHours":6},"nextCursor":"hro-1"}
│   │  TEXT  → Voy a explorar primero a los villanos y a los héroes disponibles.
│   └─
│ 
│   ┌─ [sin-codeact] step 2 · 1461 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-1"})
│   │  TOOL  → getNextHero({"cursor":"hro-1"})
│   │  RESULT← {"villain":{"alias":"Killgrave","counteredBy":"tecnología","threat":2},"nextCursor":"vln-2"}
│   │  RESULT← {"hero":{"alias":"Green Lantern","specialty":"luz","availableHours":4},"nextCursor":"hro-2"}
│   └─
│ 
│   ┌─ [sin-codeact] step 3 · 1723 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-2"})
│   │  TOOL  → getNextHero({"cursor":"hro-2"})
│   │  RESULT← {"villain":{"alias":"Mister Freeze","counteredBy":"fuego","threat":3},"nextCursor":"vln-3"}
│   │  RESULT← {"hero":{"alias":"Iron Man","specialty":"tecnología","availableHours":6},"nextCursor":"hro-3"}
│   └─
│ 
│   ┌─ [sin-codeact] step 4 · 1987 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-3"})
│   │  TOOL  → getNextHero({"cursor":"hro-3"})
│   │  RESULT← {"villain":{"alias":"Doctor Light","counteredBy":"luz","threat":4},"nextCursor":"vln-4"}
│   │  RESULT← {"hero":{"alias":"Jean Grey","specialty":"telequinesis","availableHours":4},"nextCursor":"hro-4"}
│   └─
│ 
│   ┌─ [sin-codeact] step 5 · 2251 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-4"})
│   │  TOOL  → getNextHero({"cursor":"hro-4"})
│   │  RESULT← {"villain":{"alias":"Juggernaut","counteredBy":"telequinesis","threat":5},"nextCursor":"vln-5"}
│   │  RESULT← {"hero":{"alias":"Superman","specialty":"fuego|luz","availableHours":2},"nextCursor":null}
│   └─
│ 
│   ┌─ [sin-codeact] step 6 · 2482 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-5"})
│   │  RESULT← {"villain":{"alias":"Solomon Grundy","counteredBy":"luz","threat":6},"nextCursor":"vln-6"}
│   └─
│ 
│   ┌─ [sin-codeact] step 7 · 2591 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-6"})
│   │  RESULT← {"villain":{"alias":"The Shade","counteredBy":"luz","threat":7},"nextCursor":"vln-7"}
│   └─
│ 
│   ┌─ [sin-codeact] step 8 · 2696 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-7"})
│   │  RESULT← {"villain":{"alias":"Heat Wave","counteredBy":"fuego","threat":8},"nextCursor":"vln-8"}
│   └─
│ 
│   ┌─ [sin-codeact] step 9 · 2804 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-8"})
│   │  RESULT← {"villain":{"alias":"Captain Cold","counteredBy":"fuego","threat":9},"nextCursor":"vln-9"}
│   └─
│ 
│   ┌─ [sin-codeact] step 10 · 2912 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-9"})
│   │  RESULT← {"villain":{"alias":"Brainiac","counteredBy":"tecnología","threat":10},"nextCursor":"vln-10"}
│   └─
│ 
│  Auditoría:
│      ✗ Cobertura: los 12 villanos, sin repetir ni inventar
│      ✗ Especialidad: cada héroe contrarresta de verdad
│      ✗ Presupuesto: nadie excede sus horas
│      ✗ Orden: grupos ordenados por amenaza
│      ✗ Urgencia: amenazas 1-3 cubiertas
│      → 0/5 verificaciones superadas
│ 
│   ⚠️  Presupuesto: 10 pasos.
│       Solo enumerar los 12 villanos con cursor ya consume 12.
│       El JSON no sabe iterar: cada elemento es un viaje al modelo.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────────┬───────┬─────────────┬───────┐
│ │                    │ steps │ totalTokens │ score │
│ ├────────────────────┼───────┼─────────────┼───────┤
│ │ Sin CodeAct (JSON) │ 10    │ 22102       │ 0     │
│ └────────────────────┴───────┴─────────────┴───────┘
*/

/*
! la ejecución con código y sandbox, es más barato que la iteración de ~30 qeu tendría uqe hacer si lo
! quiero resolver sin crear código p un sandbox pero... es más peligroso porque está ejecutando código
! en tu máquina con los mismos permisos

│       gpt-6-luna
│       openai.responses
│ 
│ ═══ A) SIN CODEACT — acciones en JSON ═══
│ 
│ 
│   ┌─ [sin-codeact] step 1 · 406 tokens
│   │  TOOL  → getNextVillain({"cursor":"start"})
│   │  TOOL  → getNextHero({"cursor":"start"})
│   │  RESULT← {"villain":{"alias":"Mirror Master","counteredBy":"tecnología","threat":1},"nextCursor":"vln-1"}
│   │  RESULT← {"hero":{"alias":"Antorcha Humana","specialty":"fuego","availableHours":6},"nextCursor":"hro-1"}
│   └─
│ 
│   ┌─ [sin-codeact] step 2 · 577 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-1"})
│   │  TOOL  → getNextHero({"cursor":"hro-1"})
│   │  RESULT← {"villain":{"alias":"Killgrave","counteredBy":"tecnología","threat":2},"nextCursor":"vln-2"}
│   │  RESULT← {"hero":{"alias":"Green Lantern","specialty":"luz","availableHours":4},"nextCursor":"hro-2"}
│   └─
│ 
│   ┌─ [sin-codeact] step 3 · 714 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-2"})
│   │  TOOL  → getNextHero({"cursor":"hro-2"})
│   │  RESULT← {"villain":{"alias":"Mister Freeze","counteredBy":"fuego","threat":3},"nextCursor":"vln-3"}
│   │  RESULT← {"hero":{"alias":"Iron Man","specialty":"tecnología","availableHours":6},"nextCursor":"hro-3"}
│   └─
│ 
│   ┌─ [sin-codeact] step 4 · 852 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-3"})
│   │  TOOL  → getNextHero({"cursor":"hro-3"})
│   │  RESULT← {"villain":{"alias":"Doctor Light","counteredBy":"luz","threat":4},"nextCursor":"vln-4"}
│   │  RESULT← {"hero":{"alias":"Jean Grey","specialty":"telequinesis","availableHours":4},"nextCursor":"hro-4"}
│   └─
│ 
│   ┌─ [sin-codeact] step 5 · 989 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-4"})
│   │  TOOL  → getNextHero({"cursor":"hro-4"})
│   │  RESULT← {"villain":{"alias":"Juggernaut","counteredBy":"telequinesis","threat":5},"nextCursor":"vln-5"}
│   │  RESULT← {"hero":{"alias":"Superman","specialty":"fuego|luz","availableHours":2},"nextCursor":null}
│   └─
│ 
│   ┌─ [sin-codeact] step 6 · 1108 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-5"})
│   │  RESULT← {"villain":{"alias":"Solomon Grundy","counteredBy":"luz","threat":6},"nextCursor":"vln-6"}
│   └─
│ 
│   ┌─ [sin-codeact] step 7 · 1175 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-6"})
│   │  RESULT← {"villain":{"alias":"The Shade","counteredBy":"luz","threat":7},"nextCursor":"vln-7"}
│   └─
│ 
│   ┌─ [sin-codeact] step 8 · 1240 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-7"})
│   │  RESULT← {"villain":{"alias":"Heat Wave","counteredBy":"fuego","threat":8},"nextCursor":"vln-8"}
│   └─
│ 
│   ┌─ [sin-codeact] step 9 · 1305 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-8"})
│   │  RESULT← {"villain":{"alias":"Captain Cold","counteredBy":"fuego","threat":9},"nextCursor":"vln-9"}
│   └─
│ 
│   ┌─ [sin-codeact] step 10 · 1370 tokens
│   │  TOOL  → getNextVillain({"cursor":"vln-9"})
│   │  RESULT← {"villain":{"alias":"Brainiac","counteredBy":"tecnología","threat":10},"nextCursor":"vln-10"}
│   └─
│ 
│  Auditoría:
│      ✗ Cobertura: los 12 villanos, sin repetir ni inventar
│      ✗ Especialidad: cada héroe contrarresta de verdad
│      ✗ Presupuesto: nadie excede sus horas
│      ✗ Orden: grupos ordenados por amenaza
│      ✗ Urgencia: amenazas 1-3 cubiertas
│      → 0/5 verificaciones superadas
│ 
│   ⚠️  Presupuesto: 10 pasos.
│       Solo enumerar los 12 villanos con cursor ya consume 12.
│       El JSON no sabe iterar: cada elemento es un viaje al modelo.
│ 
│ ═══ B) CON CODEACT — la acción es código ═══
│ 
│ 
│   ┌─ [con-codeact] step 1 · 497 tokens
│   │  TOOL  → runCode({"code":"return { villains: db.villains, heroes: db.heroes, hoursPerOperation: db.hoursPerOperation };"})
│   │  RESULT← {"ok":false,"logs":[],"value":{"villains":[{"alias":"Mirror Master","counteredBy":"tecnología","threat":1},{"alias":"Killgrave","counteredBy":"tecnolo
│   └─
│ 
│   ┌─ [con-codeact] step 2 · 2149 tokens
│   │  TOOL  → runCode({"code":"const villains = [...db.villains].sort((a, b) => a.threat - b.threat);\nconst heroes = db.heroes.map(hero => ({\n  ...hero,\n  specialties: hero.specialty.split('|').map(s => s.trim()),\n  remaining: Math.floor(hero.availableHours / db.hoursPerOperation)\n}));\nconst assignments = {};\nconst unhandled = [];\nfor (const villain of villains) {\n  const candidates = heroes\n    .filter(hero => hero.remaining > 0 && hero.specialties.includes(villain.counteredBy))\n    .sort((a, b) => a.specialties.length - b.specialties.length);\n  if (candidates.length === 0) {\n    unhandled.push(villain.alias);\n    continue;\n  }\n  const hero = candidates[0];\n  if (!assignments[hero.alias]) assignments[hero.alias] = [];\n  assignments[hero.alias].push(villain.alias);\n  hero.remaining--;\n}\nreturn { assignments, unhandled };"})
│   │  RESULT← {"ok":true,"logs":[],"value":{"assignments":{"Iron Man":["Mirror Master","Killgrave","Brainiac"],"Antorcha Humana":["Mister Freeze","Heat Wave","Capta
│   └─
│ 
│   ┌─ [con-codeact] step 3 · 2341 tokens
│   │  TEXT  → { assignments: { "Iron Man": ["Mirror Master", "Killgrave", "Brainiac"], "Antorcha Humana": ["Mister Freeze", "Heat Wave", "Captain Cold"], "Green Lan
│   └─
│ 
│  Plan devuelto por el sandbox:
│ {
│   "assignments": {
│     "Iron Man": [
│       "Mirror Master",
│       "Killgrave",
│       "Brainiac"
│     ],
│     "Antorcha Humana": [
│       "Mister Freeze",
│       "Heat Wave",
│       "Captain Cold"
│     ],
│     "Green Lantern": [
│       "Doctor Light",
│       "Solomon Grundy"
│     ],
│     "Jean Grey": [
│       "Juggernaut",
│       "Magneto"
│     ],
│     "Superman": [
│       "The Shade"
│     ]
│   },
│   "unhandled": [
│     "Firefly"
│   ]
│ }
│ 
│  Auditoría:
│      ✓ Cobertura: los 12 villanos, sin repetir ni inventar
│      ✓ Especialidad: cada héroe contrarresta de verdad
│      ✓ Presupuesto: nadie excede sus horas
│      ✓ Orden: grupos ordenados por amenaza
│      ✓ Urgencia: amenazas 1-3 cubiertas
│      → 5/5 verificaciones superadas
│ 
│   ✅ El bucle, el descuento de horas y el orden viven en el
│      intérprete, no en la cabeza del modelo. El intérprete no
│      olvida ni se equivoca al restar.
│ 
│ ═══ COMPARATIVA ═══
│ 
│ ┌────────────────────┬───────┬─────────────┬───────┐
│ │                    │ steps │ totalTokens │ score │
│ ├────────────────────┼───────┼─────────────┼───────┤
│ │ Sin CodeAct (JSON) │ 10    │ 9736        │ 0     │
│ │        Con CodeAct │ 3     │ 4987        │ 5     │
│ └────────────────────┴───────┴─────────────┴───────┘
*/
