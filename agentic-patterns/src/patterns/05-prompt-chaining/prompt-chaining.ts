/**
 * PATRÓN: Encadenamiento de prompts
 * --------------------------------------------------
 * Dos eslabones y un bucle. Nada más.
 *
 *   Eslabón 1 (modelo) → escribe el anuncio borrador
 *   Gate      (código) → ¿cabe en 280 caracteres?
 *   Eslabón 2 (modelo) → recorta, sabiendo cuánto le sobra
 *
 *
 * Por qué este ejemplo: el modelo NO SABE contar caracteres.
 * No es un problema de prompt. Es que ve tokens, no letras. Puedes
 * escribirle "MÁXIMO 280 CARACTERES" en mayúsculas
 * y puede devolver 340 con total confianza como 100 caracteres más.
 *
 * Y `text.length` nunca se equivoca.
 *
 * Esa asimetría es el patrón entero: el modelo es incapaz de verificar
 * algo que una línea de código verifica siempre. La cadena no MEJORA el
 * resultado, lo GARANTIZA.
 *
 *   A) Sin cadena  → una llamada y a rezar (esperar lo mejor)
 *   B) Con cadena  → gate + reintentos + fallback determinista
 *   C) Riesgo      → el mismo bucle, pero sin tope de reintentos (peligroso, puede no terminar)
 */

import { generateText } from "ai";

import { createTracer, model } from "../../helpers/index.js";

// ---------------------------------------------------------------------------
// EL ENCARGO
// ---------------------------------------------------------------------------

const MAX_CHARS = 280;
const MAX_RETRIES = 3;

const COURSE = {
	title: "Patrones de diseño agéntico: Respuestas efectivas a desafíos",
	hours: 18,
	priceUSD: 34.99,
	url: "https://cursos.devtalles.com/cursos/patrones-diseno-agentico",
};

const BRIEF =
	`Escribe el anuncio de lanzamiento de un curso para publicarlo en X.\n\n` +
	`CURSO: ${COURSE.title}\n` +
	`DURACIÓN: ${COURSE.hours} horas\n` +
	`PRECIO: ${COURSE.priceUSD} USD\n` +
	`ENLACE: ${COURSE.url}\n\n` +
	`REQUISITOS:\n` +
	`  - Máximo ${MAX_CHARS} caracteres, contando espacios y el enlace.\n` +
	// `  - Trata de usar todo el espacio disponible.\n` +
	`  - Usar al menos ${MAX_CHARS - 40} caracteres.\n` +
	`  - Incluye el título exacto, el precio y el enlace.\n` +
	`  - Tono directo, para desarrolladores. Sin markdown.\n` +
	`  - No emojis.\n` +
	`  - No sobre vendas, se honesto con lo que ofreces.\n` +
	`  - Devuelve ÚNICAMENTE el anuncio, sin comillas ni explicaciones.`;

// ---------------------------------------------------------------------------
// EL GATE — Líneas que el modelo no puede replicar
// ---------------------------------------------------------------------------

/**
 * Fíjate en lo que devuelve: no un "hazlo más corto", "hazlo más largo",
 * sino el excedente o el faltante exacto.
 * EXACTO. Un buen gate no dice solo que no. Dice cuánto.
 */
const MIN_CHARS = MAX_CHARS - 40;

// esta es esa puerta que obligamos al agente a cruzar. si no la cruza bien, retorna el
// string que leerá y podrá interactuar
function lengthGate(text: string): string | undefined {
	if (text.length > MAX_CHARS) {
		return (
			`El anuncio tiene ${text.length} caracteres. Te sobran ` +
			`${text.length - MAX_CHARS}. Recórtalo a ${MAX_CHARS} o menos SIN ` +
			`eliminar el título exacto, el precio ni el enlace.`
		);
	}

	if (text.length < MIN_CHARS) {
		return (
			`El anuncio tiene ${text.length} caracteres y se queda corto: ` +
			`te faltan ${MIN_CHARS - text.length} para el mínimo de ${MIN_CHARS}. ` +
			`Amplíalo sin pasar de ${MAX_CHARS}: añade un beneficio concreto ` +
			`del curso o menciona las ${COURSE.hours} horas.`
		);
	}

	return undefined;
}

// ---------------------------------------------------------------------------
// EL JUEZ PROGRAMÁTICO
// ---------------------------------------------------------------------------

type Check = { label: string; passed: boolean };

function auditAnnouncement(text: string): Check[] {
	return [
		{
			label: `≤ ${MAX_CHARS} caracteres (${text.length})`,
			passed: text.length <= MAX_CHARS,
		},
		{
			label: `Mínimo ${MAX_CHARS - 40} caracteres. Actual: ${text.length}. (falta: ${MAX_CHARS - 40 - text.length})`,
			passed: text.length >= MAX_CHARS - 40,
		},
		{ label: "Título exacto", passed: text.includes(COURSE.title) },
		{ label: "Precio", passed: /34[.,]99/.test(text) },
		{ label: "Enlace", passed: text.includes(COURSE.url) },
		{ label: "Sin markdown", passed: !/[#*_`]/.test(text) },
		{
			label: "Sin emojis",
			passed:
				!/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
					text,
				),
		},
	];
}

function printAudit(checks: Check[]) {
	const passed = checks.filter((check) => check.passed).length;

	for (const check of checks) {
		const mark = check.passed ? "✓".green : "✗".red;
		console.log(`     ${mark} ${check.label}`);
	}
	console.log(`     → ${passed}/${checks.length} requisitos cumplidos`.blue);

	return passed;
}

// ---------------------------------------------------------------------------
// LOS ESLABONES
// ---------------------------------------------------------------------------

const WRITER_INSTRUCTIONS =
	"Escribes anuncios cortos para redes sociales. Responde en español. " +
	"Devuelves solo el texto del anuncio, sin comillas, sin markdown, " +
	"sin explicar lo que hiciste.";

/** Eslabón 1 — el borrador. */
async function writeAnnouncement(tracer: ReturnType<typeof createTracer>) {
	const { text } = await generateText({
		model,
		prompt: BRIEF,
		instructions: WRITER_INSTRUCTIONS,
		onStepEnd: tracer.onStepFinish,
	});

	return text.trim();
}

/** Eslabón 2 — el recorte. Recibe el veredicto del gate, no algo vago. */
// Eventualmente lo puliremos para que sea más robusto y eficiente.
async function updateAnnouncement(
	// esta función es lo que hace al patron ser prompt chaining ya que le dice qué volver a
	// hacer con un prompt y no con feedback ajeno o suyo propio
	text: string, // anuncio actual
	feedback: string, // feedback del gate
	tracer: ReturnType<typeof createTracer>,
) {
	const { text: newText } = await generateText({
		model,
		prompt:
			`Actual announcement: \n---${text}---` +
			`\n promblem: \n${feedback}` +
			`\n\n Original prompt: ${BRIEF}`, // este es el prompt chaining
		// esta técnica de añadir el original prompt en conctreo evita el
		// degradado del output que podría llegar a tener el agente
		// a través de darle una cantidad excesiva de prompts
		instructions: WRITER_INSTRUCTIONS, // misma instrucción
		onStepEnd: tracer.onStepFinish,
	});

	return newText.trim();
}

// ---------------------------------------------------------------------------
// A) SIN CADENA — una llamada y a rezar
// ---------------------------------------------------------------------------

async function withoutChaining() {
	console.log(`
      ${model.modelId}
      ${model.provider}`);
	console.log("\n═══ A) SIN CADENA ═══\n".blue);
	const tracer = createTracer("sin-cadena");

	const announcement = await writeAnnouncement(tracer);
	console.log(announcement.green);

	console.log(`\n longitud real: ${announcement.length} caracteres`);

	console.log(`\n auditoria`.blue);
	const score = printAudit(auditAnnouncement(announcement));

	console.log(
		`\n     ⚠️ El requisito estaba en el prompt.
      El modelo no puede cumplirlo de forma fiable porque no cuenta caracteres
      procesa tokens. Aquí no hay prompt que valga.`.yellow,
	);

	return { ...tracer.summary(), retries: 0, score };
}

// ---------------------------------------------------------------------------
// B) CON CADENA — gate, reintentos acotados y fallback determinista
// ---------------------------------------------------------------------------

async function withChaining() {
	console.log(`
      ${model.modelId}
      ${model.provider}`);
	console.log("\n═══ B) CON CADENA ═══\n".blue);
	const tracer = createTracer("con-cadena");

	let announcement = await writeAnnouncement(tracer);
	let retries = 0;

	console.log(`Borrador: ${announcement.length} caracteres`.purple);

	for (let attemp = 1; attemp <= MAX_RETRIES; attemp++) {
		// búcle para forzar la cantidad de intento que se va a hacer con el prompt concreto
		const feedback = lengthGate(announcement);

		// como legthGate da undefined si todo está correcto
		if (!feedback) {
			console.log(`Gate superada ✅ en el intento ${attemp}`);
			break;
		}

		console.log(` 🔴 ${feedback}`.red);

		announcement = await updateAnnouncement(announcement, feedback, tracer);
		retries++;
		console.log(`intento ${attemp}: ${announcement.length} caracteres`);
	}

	// fallback determinista que evita qeu se rompa el programa si el agente no puede completar la tarea
	// si el announcement !== undefined, sería condición false por loq eu no entra al bucle
	if (lengthGate(announcement)) {
		if (announcement.length > MAX_CHARS) {
			announcement = `${announcement.slice(0, MAX_CHARS - 3)}...`;

			// el problema de esta fallback es puede cortar información sensible o necesaria
			// que es imprescindible para el resultado como el precio o la url pero lo ponemos
			// para evitar que no se suba nada pero a su vez, el fallback podría ser más
			// restrictivo y evitar que corte URL o price. través de leer ese announcement
			// con código sin necesidad de pedirle a la ia que lo haga
		}
	}

	console.log(announcement.green);

	console.log(`\n longitud real: ${announcement.length} caracteres`);

	console.log(`\n auditoria`.blue);
	const score = printAudit(auditAnnouncement(announcement));

	return { ...tracer.summary(), retries, score }; // score, retries
}

// ---------------------------------------------------------------------------
// C) RIESGO — el mismo bucle, sin tope de reintentos
// ---------------------------------------------------------------------------

/** Tope de seguridad para el laboratorio. En el bucle "sin tope" real, no lo habría. */
const SAFETY_LIMIT = 8;

async function chainWithoutRetryLimit() {
	console.log(`
      ${model.modelId}
      ${model.provider}`);
	console.log("\n═══ C) RIESGO: BUCLE SIN TOPE ═══\n".blue);
	const tracer = createTracer("sin-tope");

	let announcement = await writeAnnouncement(tracer);
	let retries = 0;
	const history: number[] = [];

	// el auditAnouncement sirve para filtrar aquellas partes que no hayan pasado y así
	// mejorar el prompt con el agente para que sea más directo sobre qué tareas falla
	let pendingChecks = auditAnnouncement(announcement).filter(
		(check) => !check.passed,
	);

	//! si al ciclo while no le pones un límite de vueltas, podría llevar a un loop infinito
	while (pendingChecks.length > 0 && retries < SAFETY_LIMIT) {
		// el feedback es el conjunto de strings que le dice al modelo qué está mal
		const feedback = pendingChecks.map((check) => check.label).join("\n");
		history.push(pendingChecks.length);

		console.log({ feddback: `Problemas: \n ${feedback}`.purple });

		announcement = await updateAnnouncement(announcement, feedback, tracer);
		retries++;
		console.log(`Intento ${retries} \n ${announcement} ---`);

		// volves a regresar los pending pero después de haber aplicado el filter
		// del !check para uqeno devuelva lo mismo
		pendingChecks = auditAnnouncement(announcement).filter(
			(check) => !check.passed,
		);
	}

	console.log(`trayectoria: ${history.join("->")}`.yellow);
	console.log(`auditoria`.blue);

	const score = printAudit(auditAnnouncement(announcement));

	console.log(
		`\n\n
  ⚠️  Mira la trayectoria. El modelo se acerca a la solución y se queda
      rondando: 4 → 3 → 2 → 1 → 1 → 1 → 2 → 1... 
      Cada iteración cuesta tokens.
      Sin tope, esto puede no terminar.
      Todo bucle necesita un techo Y una salida determinista.`.yellow,
	);

	return { ...tracer.summary(), score, retries }; // score, retries,
}

// ---------------------------------------------------------------------------
// EJECUCIÓN DEL PROGRAMA
// ---------------------------------------------------------------------------

export async function promptChainingMain() {
	// const a = await withoutChaining();
	// const b = await withChaining();
	const c = await chainWithoutRetryLimit();

	console.log("\n═══ COMPARATIVA ═══\n".blue);
	console.table({
		// "Sin cadena": a,
		// "Con cadena": b,
		"Bucle sin tope": c,
	});

	console.log(
		"\n  El gate son unas pocas líneas de TypeScript y decide algo que el\n" +
			"  modelo no puede decidir. Esa es toda la idea del patrón.\n\n" +
			"  La cadena no mejora el anuncio: garantiza que cabe y es correcto.\n" +
			'  "Mejor a veces" y "correcto siempre" no son lo mismo.\n\n' +
			"  Y el eslabón que cierra el caso no es un prompt: es el slice.\n",
	);
}
