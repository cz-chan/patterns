/**
 * PATRÓN: Reflexión - Reflection
 * ------------------------------
 * El modelo evalúa su propia salida y la refina.
 *
 * La trampa del patrón: un modelo que se auto-evalúa SIN criterios
 * tiende a aprobarse. Este laboratorio lo demuestra en tres rondas:
 *
 *   A) Sin reflexión         → una sola pasada
 *   B) Reflexión ingenua     → "¿está bien?" → casi siempre dice que sí
 *   !C) Reflexión con rúbrica → criterios explícitos → mejora real -> con esto obligas
 * !a que la AI te de una respuesta en concreto
 *
 * El juez programático del final es la pieza clave: dice la verdad
 * aunque el modelo se haya dado el visto bueno a sí mismo.
 */

import { generateText, Output } from "ai";
import { z } from "zod";

import { createTracer, model } from "../../helpers/index.js";
import { revision } from "bun";

// ---------------------------------------------------------------------------
// LA TAREA
// ---------------------------------------------------------------------------

const VILLAIN_DOSSIER = [
	"EXPEDIENTE: Mirror Master",
	"  Nombre real: Evan McCulloch",
	"  Poder: viaja por la dimensión espejo; puede extraer a otros de sus celdas",
	"  Debilidad: los espejos requieren superficie reflectante intacta",
	"  Última ubicación: distrito industrial, almacén 7",
	"  Cómplices conocidos: Killgrave",
	"  Recompensa: 250.000 USD",
].join("\n");

/**
 * Seis requisitos, todos verificables sin criterio subjetivo.
 * Que sean comprobables por código es lo que hace honesto al lab:
 * no dependemos de que el modelo diga si mejoró.
 */
const REQUIREMENTS = [
	"Menciona el nombre real del villano",
	"Indica una contramedida concreta basada en su debilidad",
	"Especifica la última ubicación conocida",
	"Nombra a sus cómplices",
	"Incluye el monto exacto de la recompensa",
	'Termina con una línea que empiece por "RIESGO:"',
];

const TASK =
	"Redacta un briefing operativo para el equipo de captura, de máximo " +
	"120 palabras.\n\n" +
	"REQUISITOS OBLIGATORIOS:\n" +
	REQUIREMENTS.map((requirement, i) => `  ${i + 1}. ${requirement}`).join(
		"\n",
	) +
	"\n\n" +
	VILLAIN_DOSSIER;

// ---------------------------------------------------------------------------
// EL JUEZ PROGRAMÁTICO — la fuente de verdad del laboratorio
// ---------------------------------------------------------------------------

// este check indica si pasó o no la tarea
type Check = { label: string; passed: boolean };

/**
 * Verificación determinista. No usa el modelo: por eso no se deja engañar
 * cuando el modelo afirma que su propio texto "cumple todo".
 */
function auditBriefing(text: string): Check[] {
	// esta función es la que le dice a la AI que evalue todo y que lo compare con requirements
	// la AI trabaja muy bien con objetos estructurados porque pasa de adivinar a saber qué hacer
	// y en qué tarea centrarse. Digamos que le estás poniendo un harness
	const lower = text.toLowerCase();

	return [
		{ label: "Nombre real", passed: lower.includes("mcculloch") },
		{
			label: "Contramedida",
			passed: /espejo|reflectante|superficie/.test(lower),
		},
		{
			label: "Ubicación",
			passed: /almac[eé]n\s*7|distrito industrial/.test(lower),
		},
		{ label: "Cómplices", passed: lower.includes("killgrave") },
		{ label: "Recompensa", passed: /250[.,]?000/.test(text) },
		{ label: "Línea RIESGO:", passed: /^RIESGO:/m.test(text) },
		{ label: "≤ 120 palabras", passed: text.trim().split(/\s+/).length <= 120 },
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
// A) SIN REFLEXIÓN — una sola pasada
// ---------------------------------------------------------------------------
/*
! NECESITO COMENTAR LOS INSTRUCTIONS SI QUIERO EJECUTAR CLAUDE PORQEU AI-SDK 
! PARA CLAUDE LO TRANSFORMA EN EL PROMPT
*/

async function withoutReflection() {
	console.log(
		`\n MODEL: ${JSON.stringify(model.modelId)}, \n PROVIDER: ${JSON.stringify(model.provider)} \n`,
	);
	console.log("\n═══ A) SIN REFLEXIÓN ═══\n".blue);
	const tracer = createTracer("sin-reflexión");

	const { text } = await generateText({
		model,
		prompt: TASK,
		// instructions: ``,
		onStepEnd: tracer.onStepFinish,
	});

	console.log(text.green);
	console.log(`\n AUDIT \n`);
	const score = printAudit(auditBriefing(text));

	return { ...tracer.summary(), score };
}

// ---------------------------------------------------------------------------
// B) REFLEXIÓN INGENUA — el modelo se pregunta "¿está bien?"
// ---------------------------------------------------------------------------

// formato para la salida del draft y así la ai lo entienda mejor y consuma menos
const naiveVerdictSchema = z.object({
	isGoodEnough: z.boolean().describe("Is the text ready to publish?"),
	comment: z.string().describe("a quick note on the quality of the output"),
});

async function naiveReflection() {
	console.log(
		`\n MODEL: ${JSON.stringify(model.modelId)}, \n PROVIDER: ${JSON.stringify(model.provider)} \n`,
	);
	console.log("\n═══ B) REFLEXIÓN INGENUA (sin criterios) ═══\n".blue);
	const tracer = createTracer("naive-reflection");

	const { text: draft } = await generateText({
		// lo obtenido aquí es el input para la autoeval
		model,
		prompt: TASK,
		// instructions: ``,
		onStepEnd: tracer.onStepFinish,
	});

	// aquí autoeval y aquí es donde el patrón toma sentido: sin rúbrica y sin criterios
	const { text, output: verdict } = await generateText({
		model,
		// aquí es donde le dices el formato de la salida
		output: Output.object({
			schema: naiveVerdictSchema,
		}),
		prompt: `TEXT: \n ${draft}`,
		// instructions: ``,
		onStepEnd: tracer.onStepFinish,
	});

	console.log("Informe: ".blue);
	console.log(`Veredicto del modelo: ${verdict.isGoodEnough ? "✅" : "❌"}`);
	console.log(`Comentario: ${verdict.comment}`);

	console.log("REALIDAD (auditoría programática)".blue);
	const score = printAudit(auditBriefing(draft));

	console.log(
		"\n ⚠️ compara el veredicto del modelo con la auditoría".yellow +
			"\n esta brecha es la razón de ser de la rúbrica",
	);

	return { ...tracer.summary(), score }; // score
}

// ---------------------------------------------------------------------------
// C) REFLEXIÓN CON RÚBRICA — criterios explícitos e iteración
// ---------------------------------------------------------------------------

const criticSchema = z.object({
	missing: z
		.array(
			// con un único z.string como array podría ser un poco vaga la respuesta del agente
			// y ambigua para poder volver a evaluarla por eso le pasamos un object.
			// cuanto más acotada y específica sea la instrucción, menos posibilidad de alucinar y malentender
			z.object({
				requirementNumber: z.number(),
				evidence: z.string().describe("LIERAL quote in the text or 'ANY'"),
				passed: z.boolean(),
			}),
		)
		.describe(
			"no completed checks. you must to quote each one and their description.",
		),
	isComplete: z
		.boolean()
		.describe("This will only be true once all of them have been completed"),
});

const MAX_ITERATION = 3; // esto es para el CIRCUIT BREAKER, sino la iteración puede ser infinita

async function reflectionWithRubric() {
	console.log(
		`\n MODEL: ${JSON.stringify(model.modelId)}, \n PROVIDER: ${JSON.stringify(model.provider)} \n`,
	);
	console.log("\n═══ C) REFLEXIÓN CON RÚBRICA ═══\n".blue);
	const tracer = createTracer("con-rúbrica-reflexión");

	let draft = "";
	let iteration = 0;

	const { text: firstDraft } = await generateText({
		model,
		prompt: TASK,
		onStepEnd: tracer.onStepFinish,
	});

	draft = firstDraft;

	// aquí es donde entran las iteraciones
	while (iteration < MAX_ITERATION) {
		iteration++;
		console.log(`--------- ITERATION ${iteration}`.blue);

		const { output: critique } = await generateText({
			model,
			output: Output.object({ schema: criticSchema }),
			prompt:
				`REQUIREMENTS: \n` +
				REQUIREMENTS.map(
					(requirement, index) => `${index + 1}. ${requirement}`,
				).join("\n") +
				`TEXT TO REVIEW: \n ${draft}`,
			instructions:
				"You are a strategic reviewer." +
				"Review each text vs the requirements list" +
				"not assume that something is complete" +
				"check literally in the text.",
			onStepEnd: tracer.onStepFinish,
		});

		if (critique.isComplete) {
			console.log("el revisor no encontra faltantes");
			break;
		}

		console.log("aún faltan algunos: ".yellow);
		critique.missing.forEach((item) =>
			console.log(`    - ${JSON.stringify(item)}`),
		);

		// queremos reescribir en caso de encontrar problemas
		const { text: revised } = await generateText({
			model,
			prompt:
				`Actual briefing: \n ${draft} \n\n` +
				`Fix this points: \n ${critique.missing
					.map((miss) => `  - ${JSON.stringify(miss)}`)
					.join("\n")} \n\n` +
				`Context: \n${VILLAIN_DOSSIER}`,
			instructions:
				"rewrite the briefing ONLY with the checking points" +
				"keeps what was already working" +
				"keep the 120 word limit",
			onStepEnd: tracer.onStepFinish,
		});
		draft = revised;
	}
	console.log(`final version with ${iteration} iterations`.blue);
	console.log(draft.green);
	console.log(`Audit: `.blue);
	const score = printAudit(auditBriefing(draft));

	return { ...tracer.summary(), score, iteration }; // score e iteraciones
}

// ---------------------------------------------------------------------------
// EJECUCIÓN DEL PROGRAMA
// ---------------------------------------------------------------------------

export async function reflectionMain() {
	const a = await withoutReflection();
	const b = await naiveReflection();
	const c = await reflectionWithRubric();

	console.log("\n═══ COMPARATIVA ═══\n".blue);
	console.table({
		"Sin reflexión": a,
		"Reflexión ingenua": b,
		"Reflexión con rúbrica": c,
	});

	console.log(
		"\n  La reflexión ingenua cuesta tokens extra y casi no mejora nada:\n" +
			"  el modelo se aprueba a sí mismo.\n\n" +
			"  Reflexionar no sirve por reflexionar. Sirve cuando hay criterios\n" +
			"  concretos contra los que comparar.\n\n" +
			"  Y aun así, el revisor sigue siendo el mismo modelo que escribió.\n" +
			"  Separar los roles en dos agentes es el patrón Evaluator-Optimizer.\n",
	);
}
