# diferencias entre ReAct y Reflection loops

**ReAct (mira hacia fuera)**

- Ciclo: pensar → usar tool → observar → pensar…
- Lo que entra en cada vuelta: información nueva del mundo (el resultado de la tool).
- Sirve para lo que no sabes. En tu ejemplo de aprobación, el jefe de cada persona solo aparece al
  consultar su ficha.
- Termina cuando ya tiene el dato que buscaba (alguien con límite suficiente).
- La respuesta no existe hasta que exploras.

Ejemplos de productos que podrían usarlo (encaja cuando hay que buscar datos que no tienes al empezar):

- Agentes de código (Claude Code, Cursor, Copilot agent): leen archivos, ejecutan tests, ven el error y deciden qué tocar después.
- Buscadores con IA (Perplexity, ChatGPT con búsqueda): buscan, leen resultados y, si falta algo, buscan otra vez.
- Soporte al cliente (tipo Intercom Fin): consultan el pedido, luego el envío, luego la política de devoluciones. Cada paso depende del anterior.
- Agentes de navegador (ChatGPT agent, Claude in Chrome): hacen clic, miran la pantalla y deciden el siguiente clic.
- Observabilidad / SRE: ven una alerta, consultan logs, de ahí métricas, y van tirando del hilo hasta la causa.
- Interno: tu caso del organigrama, o rutas de aprobación de compras y escalados de tickets.

**Reflection (mira hacia dentro)**

- Ciclo: generar → criticar → reescribir…
- Lo que entra en cada vuelta: una crítica de su propia salida. No hay datos nuevos, el dossier ya está
  completo.
- Sirve para lo que ya sabes, pero está mal hecho (faltan requisitos, sobran palabras).
- Termina cuando la rúbrica pasa o se agotan las MAX_ITERATION.
- La respuesta ya es posible en la primera pasada, solo hay que pulirla.

Ejemplos de productos que podrían usarlo (encaja cuando tienes todos los datos y el reto es la calidad con criterios claros):

- Copywriting y marketing (tipo Jasper): un borrador revisado contra la guía de marca, el tono y los límites de caracteres.
- Textos regulados (legal, salud, finanzas): un contrato o informe revisado contra una checklist de cláusulas obligatorias.
- Generación de SQL o código: genera la query, la revisa contra el esquema y las reglas, y corrige.
- Traducción y localización: traduce y después revisa terminología, glosario y longitud.
- Fichas de producto en e-commerce: cada descripción tiene que incluir talla, material y cuidados, como tus 6 requisitos.
- Briefings y resúmenes ejecutivos: igual que tu lab del villano.

Prueba rápida: si quitas las tools, ReAct se rompe (withoutReAct se queda en EMP-2). Reflection sigue
funcionando igual, porque no las usa.

En el código:

- ReAct (04-reAct/reAct-loop.ts:178): una sola llamada a generateText con tools y stopWhen. El bucle lo
  hace el SDK.
- Reflection (03-reflection/reflection.ts:238): tu propio while, con dos llamadas separadas (crítico y
  reescritor).

Se pueden combinar: un agente ReAct que reúne los datos y después Reflection para revisar la respuesta
final.

Ejemplos de casos combinados (lo común en producción):

- Deep research: ReAct para investigar y Reflection para revisar el informe final.
- Agentes de código: ReAct para implementar y Reflection para la auto-revisión antes del PR (Reflection con rúbrica: tests, lint, requisitos).
