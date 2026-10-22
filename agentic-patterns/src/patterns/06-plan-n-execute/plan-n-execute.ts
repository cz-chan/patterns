/**
 * PATRÓN: Planificar y ejecutar - Plan-and-Execute
 * ------------------------------------------------
 * Separa la planificación de la ejecución en dos fases distintas.
 *
 * En ReAct (patrón 04) el modelo decide UNA acción, ve el resultado,
 * decide la siguiente... una llamada al modelo por cada paso.
 *
 * En Plan-and-Execute el modelo produce el plan COMPLETO en una sola
 * llamada. Luego el código ejecuta las herramientas sin consultar al
 * modelo, y al final una única llamada redacta la respuesta.
 *
 * Diferencia con Planning (patrón 02): allí cada paso lo resolvía el
 * modelo. Aquí los pasos son llamadas a herramientas que ejecuta el código.
 *
 *   A) ReAct            → muchas llamadas, se adapta a lo que ve
 *   B) Plan-and-Execute → 2 llamadas, ciego a los resultados intermedios
 *   C) Cuando se rompe  → la tarea depende de un resultado intermedio
 */

import { generateText, Output, tool, stepCountIs } from "ai";
import { z } from "zod";

import { createTracer, model } from "../../helpers/index.js";

// ---------------------------------------------------------------------------
// LOS DATOS — la prisión de máxima seguridad tras la recaptura
// ---------------------------------------------------------------------------

type CellStatus = {
	villain: string;
	block: string;
	cell: number;
	integrity: number; // 0-100
	lastInspection: string;
};

type GuardLog = {
	villain: string;
	entries: string[];
	incidents: number;
};

const CELLS: Record<string, CellStatus> = {
	mister_freeze: {
		villain: "Mister Freeze",
		block: "C",
		cell: 12,
		integrity: 97,
		lastInspection: "2026-08-20",
	},
	killgrave: {
		villain: "Killgrave",
		block: "A",
		cell: 3,
		integrity: 88,
		lastInspection: "2026-08-21",
	},
	mirror_master: {
		villain: "Mirror Master",
		block: "D",
		cell: 1,
		integrity: 41,
		lastInspection: "2026-08-15",
	},
	juggernaut: {
		villain: "Juggernaut",
		block: "B",
		cell: 7,
		integrity: 73,
		lastInspection: "2026-08-19",
	},
};

const LOGS: Record<string, GuardLog> = {
	"mister freeze": {
		villain: "Mister Freeze",
		entries: ["Sin novedad", "Sin novedad"],
		incidents: 0,
	},
	killgrave: {
		villain: "Killgrave",
		entries: ["Intentó hablar con un guardia; protocolo de silencio aplicado"],
		incidents: 1,
	},
	"mirror master": {
		villain: "Mirror Master",
		entries: [
			"Superficie de la puerta pulida por el interno",
			"Reflejo detectado en el suelo de la celda",
		],
		incidents: 2,
	},
	juggernaut: {
		villain: "Juggernaut",
		entries: ["Sin novedad"],
		incidents: 0,
	},
};

// Capa de datos: funciones planas, compartidas por las herramientas (Tools)
// y por el ejecutor del plan (igual que en el patrón 04).
function getCellStatus(villain: string): CellStatus | { error: string } {
	const cellId = villain.toLowerCase().replaceAll(" ", "_");

	return (
		CELLS[cellId] ?? {
			error: `Sin celda registrada: ${villain}`,
		}
	);
}

function getGuardLog(villain: string): GuardLog | { error: string } {
	return (
		LOGS[villain.toLowerCase()] ?? {
			error: `Sin bitácora registrada: ${villain}`,
		}
	);
}

// ---------------------------------------------------------------------------
// LAS HERRAMIENTAS
// ---------------------------------------------------------------------------

const tools = {
	getCellStatus: tool({
		description:
			"Consulta el estado de la celda de un villano (bloque, integridad, última inspección).",
		inputSchema: z.object({ villain: z.string() }),
		execute: async ({ villain }) => getCellStatus(villain),
	}),
	getGuardLog: tool({
		description:
			"Consulta la bitácora de guardias de un villano (entradas e incidentes).",
		inputSchema: z.object({ villain: z.string() }),
		execute: async ({ villain }) => getGuardLog(villain),
	}),
};

// Tarea predecible: se sabe de antemano qué hay que consultar.
const PREDICTABLE_TASK =
	"Generate a status report on Mister Freeze, Killgrave, and Mirror Master " +
	// ', The Shocker ' + // este villano no ha sido capturado
	"and Juggernaut. For each one, I need: a block and a cell, and the integrity of the " +
	"cell, and how many incidents are logged in the log." +
	"Answer always in Spanish";

// ---------------------------------------------------------------------------
// A) REACT — una llamada al modelo por cada acción
// ---------------------------------------------------------------------------

async function withReAct(task: string) {
	console.log(`
      ${model.modelId}
      ${model.provider}`);

	console.log("\n═══ A) REACT ═══\n".blue);
	const tracer = createTracer("react");

	const { text: results } = await generateText({
		model,
		prompt: task,
		tools, // le pasamos las tools
		stopWhen: stepCountIs(10),
		instructions:
			"Your are a prison police. Use always the tools. Never make up data.",
		onStepEnd: tracer.onStepFinish,
	});

	console.log("\n Informe:".blue, results.green);
	return { ...tracer.summary(), results }; // text
}

// ---------------------------------------------------------------------------
// B) PLAN-AND-EXECUTE — plan completo en una llamada, ejecución sin modelo
// ---------------------------------------------------------------------------

/**
 * El plan es una lista de llamadas a herramientas con sus argumentos.
 * Zod garantiza que solo aparezcan herramientas que existen.
 */
const planSchema = z.object({
	steps: z
		.array(
			z.object({
				tool: z.enum(["getCellStatus", "getGuardLog"]), // solo puede coger estas tools
				villain: z.string(), // id del villano (en este caso su nombre)
				why: z.string().describe("what does this step mean?"), // justificación del porqué el paso
			}),
		)
		.min(1) // mínimo un paso
		.max(10), // máximo 8 para que no se vaya de las manos
});

// Ejecutor: puro código, el modelo no participa.
// La idea es tener las funciones de las herramientas disponibles para ejecutarlas.
const executors = {
	getCellStatus: getCellStatus,
	getGuardLog: getGuardLog,
} as const;

async function withPlanAndExecute(task: string) {
	console.log(`
      ${model.modelId}
      ${model.provider}`);

	console.log("\n═══ B) PLAN-AND-EXECUTE ═══\n".blue);
	const tracer = createTracer("plan-and-execute");

	// Fase 1: PLANIFICAR — una sola llamada, sin herramientas
	const { output: plan } = await generateText({
		model,
		/*
			no le estamos pasando tools y le estamos dando un output, es decir, le estamos diciendo
			cual es la forma que esperamos que tenga el plan que nos va a dar por eso hemos creado
			el planSchema para que lo siga y no se salga de ahí y así en un futuro, poder usar
			código predecible que nos ayude a ejecutar el plan
		*/
		output: Output.object({ schema: planSchema }),
		prompt: task,
		instructions:
			"You are a prison officer. You do not resolve the task" +
			"List all necessary queries, sorted, to solve the task" +
			"Your abailable tools are: getCellStatus(villain), getGuardLog(villain)",
		onStepEnd: tracer.onStepFinish,
	});

	// este log no es necesario, solo era para obtener la vista de qué traeas hay que ejecutar y con
	// qué parámetros (id de villanos)
	// console.log(`\n Plan (${plan.steps.length} pasos):`.blue);
	// plan.steps.forEach((step, i) =>
	// 	console.log(`   ${i + 1}. ${step.tool}(${step.villain}) — ${step.why}`),
	// );

	// Fase 2: EJECUTAR — el código recorre el plan. Cero llamadas al modelo.
	const results = plan.steps.map((step) => ({
		step: `${step.tool}(${step.villain})`,
		result: executors[step.tool](step.villain),
		// puedo pasar en el executor las tools porque tienen el mismo nombre que las tools que existen
		// los parámetros son los villanos y como solo hay un parámetro, conun único arg está
		// si fuera más de un param, es mejro enviar un arreglo con la posición EN ORDEN de cada
		// uno de los parámetros que recibe. ej: ([step.villain, step.hero, ...])
	}));

	// console.log({ results });

	console.log("\n Ejecución completada sin consultar al modelo.".yellow);

	// Fase 3: SINTETIZAR — una sola llamada con todos los resultados
	// esta parte 3 ya no es el patrón (solo es la 1 y 2) pero esto sintetiza todo
	//  en un bloque más fácil de ver
	const { text } = await generateText({
		model,
		prompt:
			`TASK: \n${task}\n` + `RESULTS: \n${JSON.stringify(results, null, 2)}`,
		instructions:
			"Write a brief using ONLY the results that i give you" +
			"if some data is missing, write note about it. do not make up the data.",
		onStepEnd: tracer.onStepFinish,
	});

	console.log("informe:\n", text.green);

	return { ...tracer.summary(), text }; // text
}

// ---------------------------------------------------------------------------
// C) CUANDO SE ROMPE — la tarea depende de un resultado intermedio
// ---------------------------------------------------------------------------
// resultado intermedio o que el modelo tenga que ejecutar algo en algún punto del tiempo

/**
 * Aquí el segundo paso depende de lo que devuelva el primero:
 * no se puede saber QUÉ celdas revisar sin leer antes las bitácoras.
 * ReAct lo resuelve; Plan-and-Execute no puede, porque planifica a ciegas.
 */
const ADAPTIVE_TASK =
	"Check the log for Mister Freeze, Killgrave, Mirror Master, and " +
	"Juggernaut. ONLY for villains with 2 or more incidents; check " +
	"the condition of their cell and indicate if its integrity is less than 50.";

// Juez determinista: la respuesta correcta es Mirror Master (2 incidentes,
// integridad 41) y nadie más.
function auditReport(text: string) {
	console.log(`
      ${model.modelId}
      ${model.provider}`);

	const lower = text.toLowerCase();
	const checks = [
		{
			label: "Señala a Mirror Master con integridad 41",
			passed: lower.includes("mirror master") && /\b41\b/.test(text),
		},
		{
			label: "No reporta integridad de los demás",
			passed: !/\b(97|88|73)\b/.test(text),
		},
	];
	for (const check of checks) {
		console.log(`     ${check.passed ? "✓".green : "✗".red} ${check.label}`);
	}
	return checks.filter((c) => c.passed).length;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

export async function planAndExecuteMain() {
	// console.log("\n##### TAREA PREDECIBLE #####".blue);
	// const a = await withReAct(PREDICTABLE_TASK);
	// const b = await withPlanAndExecute(PREDICTABLE_TASK);

	console.log("\n##### TAREA ADAPTATIVA #####".blue);
	const c = await withReAct(ADAPTIVE_TASK);
	console.log("\n Auditoría ReAct:".blue);
	const scoreC = auditReport(c.results);

	const d = await withPlanAndExecute(ADAPTIVE_TASK);
	console.log("\n Auditoría Plan-and-Execute:".blue);
	const scoreD = auditReport(d.text);

	console.log("\n═══ COMPARATIVA ═══\n".blue);
	console.table({
		// "ReAct (predecible)": { steps: a.steps, totalTokens: a.totalTokens },
		// "Plan-and-Execute (predecible)": {
		// 	steps: b.steps,
		// 	totalTokens: b.totalTokens,
		// },
		"ReAct (adaptativa)": {
			steps: c.steps,
			totalTokens: c.totalTokens,
			score: scoreC,
		},
		"Plan-and-Execute (adaptativa)": {
			steps: d.steps,
			totalTokens: d.totalTokens,
			score: scoreD,
		},
	});

	console.log(
		"\n  Plan-and-Execute compra coste: menos llamadas, menos tokens.\n" +
			"  Lo paga con adaptabilidad: el plan se decide antes de ver ningún dato.\n" +
			"  Si un paso depende del resultado de otro, vuelve a ReAct.\n",
	);
}
