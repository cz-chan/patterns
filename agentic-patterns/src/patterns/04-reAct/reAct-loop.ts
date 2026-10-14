/**
 * PATRÓN: ReAct (Reasoning + Acting)
 * ---------------------------------------------------
 * Bucle que intercala razonamiento y acción:
 *   pensar → actuar → observar → pensar → ...
 *
 * El escenario esencial, puede ser más complejo: UNA herramienta y una cadena
 * de longitud desconocida.
 *
 * Ejemplo:
 * Un gasto necesita aprobación. Se sube por la jerarquía hasta encontrar
 * a alguien con límite suficiente. Nadie sabe cuántos escalones hay que
 * subir hasta subirlos: el jefe de cada persona solo aparece DENTRO de
 * su propia ficha.
 *
 * Por eso no se puede planificar por adelantado. No es que el plan fijo
 * se equivoque: es que no se puede ni escribir.
 */

import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";

import { createTracer, model } from "../../helpers/index.js";

// ---------------------------------------------------------------------------
// LOS DATOS — el organigrama
// ---------------------------------------------------------------------------

type Employee = {
	id: string;
	name: string;
	role: string;
	/** Máximo que puede aprobar por sí solo, en USD. */
	approvalLimitUSD: number;
	/** Su jefe directo. null = cima del organigrama. */
	managerId: string | null;
};

const EMPLOYEES: Employee[] = [
	{
		id: "EMP-1",
		name: "Ana Ruiz",
		role: "desarrolladora",
		approvalLimitUSD: 0,
		managerId: "EMP-2",
	},
	{
		id: "EMP-2",
		name: "Luis Prado",
		role: "líder de equipo",
		approvalLimitUSD: 1_000,
		managerId: "EMP-3",
	},
	{
		id: "EMP-3",
		name: "Carmen Vidal",
		role: "directora de área",
		approvalLimitUSD: 5_000,
		managerId: "EMP-4",
	},
	{
		id: "EMP-4",
		name: "Óscar Peña",
		role: "director financiero",
		approvalLimitUSD: 50_000,
		managerId: "EMP-5",
	},
	{
		id: "EMP-5",
		name: "Pedro García",
		role: "director de finanzas",
		approvalLimitUSD: 100_000,
		managerId: "EMP-6",
	},
	{
		id: "EMP-6",
		name: "María López",
		role: "CEO",
		approvalLimitUSD: 1_000_000,
		managerId: null,
	},
];

// ---------------------------------------------------------------------------
// LA ÚNICA HERRAMIENTA
// ---------------------------------------------------------------------------

const getEmployee = tool({
	description:
		"Returns an employee's record: their position and the amount they are authorized to approve " +
		"on his own and his immediate supervisor's ID.",
	inputSchema: z.object({
		employeeId: z.string().describe('Employee ID. eg: "EMP-1"'),
	}),
	execute: async ({ employeeId }) => {
		const employee = EMPLOYEES.find((e) => e.id === employeeId);
		// lanzar una excepción (throw new ERROR()) puede acabar con el bucle de manera abrupta y no
		// acabar el trabajo como queires. de esta manera, un objeto, el agente sabrá leerlo
		// y podrá manejarlo para iterar sobre él
		if (!employee) return { error: `There is no such employee ${employeeId}` };
		return employee;
	},
});

// ---------------------------------------------------------------------------
// EL PROBLEMA
// ---------------------------------------------------------------------------

// const AMOUNT_USD = 8_500;
const AMOUNT_USD = 900_000;

const REQUEST =
	`Ana Ruiz (EMP-1) needs approval for an expense of ` +
	`${AMOUNT_USD.toLocaleString("es")} USD.\n\n` +
	"Find out WHO must approve it: the first person in their " +
	"chain of command whose approval limit covers the amount.\n\n" +
	"Reply with their name, title, and approval limit.";

/**
 * La cadena real: Ana (0) → Luis (1.000) → Carmen (5.000) → Óscar (50.000).
 * Los tres primeros se quedan cortos. La respuesta es Óscar Peña.
 * Cuatro consultas, y ninguna se puede anticipar desde el enunciado.
 */

// ---------------------------------------------------------------------------
// A) SIN ReAct — una sola consulta, hecha por nosotros
// ---------------------------------------------------------------------------
// Le damos la ficha de Ana ya resuelta y le pedimos la respuesta.
// El modelo ve que su jefe es EMP-2, pero no puede consultarlo.
// Sin bucle, la cadena se corta en el primer eslabón.

async function withoutReAct() {
	console.log(`
      ${model.modelId}
      ${model.provider}`);
	console.log("\n═══ A) SIN ReAct — una sola pasada ═══\n".blue);
	const tracer = createTracer("sin-react");

	const anaRecord = EMPLOYEES.find((e) => e.id === "EMP-1")!;

	// este patrón tb podría ser el tool use
	// esto es un "agente" rudimentario: teine prompt, instrucciones y acceso a tools
	const { text } = await generateText({
		model,
		tools: { getEmployee },
		prompt:
			`${REQUEST}\n\n` +
			`Available data: ${JSON.stringify(anaRecord, null, 2)}`,
		instructions:
			"Always reply in Spanish" +
			"You are a financial assistant. Answer ONLY with available data." +
			"If you can't find the person authorized to approve it, reply: 'I cannot approve that expense.'",
		onStepEnd: tracer.onStepFinish,
	});

	console.log("Respuesta:\n".blue, text.green);

	console.log(
		(
			"\n  ⚠️  Solo conoce a Ana y el ID de su jefe. Sin poder consultarlo," +
			"\n      o inventa un aprobador o se detiene en EMP-2."
		).yellow,
	);

	return tracer.summary();
}

// ---------------------------------------------------------------------------
// B) CON ReAct — el bucle sube solo
// ---------------------------------------------------------------------------

async function withReAct() {
	console.log(`
    ${model.modelId}
    ${model.provider}`);

	console.log("\n═══ B) CON ReAct — bucle adaptativo ═══\n".blue);
	const tracer = createTracer("con-reAct");

	const anaRecord = EMPLOYEES.find((e) => e.id === "EMP-1")!;

	const { text } = await generateText({
		model,
		tools: { getEmployee },
		stopWhen: stepCountIs(10), //! esto es el circuit breaker, sin esto puede irse infinito
		/*
    imagina que pones menos steps y no ha completado el resultado. este resultado sin 
    completar (draft) podrías pasárselo a otro agente que lo revisara y sólo en el caso
    de no tener respuesta, lo evaluara y devolviera alguna respuesta útil.

    también se puede crear a través de código un elemento que evalue ese texto, donde 
    si es vacio ("" o undefined), se pase al agente y sino, se mantenga con esa
    respuesta que dio
    */
		prompt:
			`${REQUEST}\n\n` +
			`Available data: ${JSON.stringify(anaRecord, null, 2)}`,
		instructions:
			"Always reply in Spanish" +
			"You are a finance assistant. Work in cycles: check a " +
			"record, compare the limit to the amount, and decide if you need to " +
			"go up one more level.\n" +
			"CLOSING CONDITION: You're only done when you find someone " +
			"whose limit COVERS the amount. If it does not cover it, go up to the boss.\n" +
			"If you reach someone without a boss (managerId null) and it still does not cover it, " +
			"stop and state that the expense cannot be approved internally.\n" +
			"Do not invent IDs: retrieve them from the managerId field in the previous result.\n" +
			"Your final message must be the definitive answer, not a loose explanation " +
			"Cite the name, title, and limit.",
		onStepEnd: tracer.onStepFinish,
	});

	console.log("Respuesta:\n".blue, text.green);

	console.log(
		(
			"\n  ✅ Cuenta las consultas: Ese número es un DATO del" +
			"\n     organigrama, no del enunciado. Por eso no se podía planificar."
		).yellow,
	);

	return tracer.summary();
}

// ---------------------------------------------------------------------------
// EJECUCIÓN DEL PROGRAMA
// ---------------------------------------------------------------------------

export async function reActSimpleMain() {
	// const a = await withoutReAct();
	const b = await withReAct();

	console.log("\n═══ COMPARATIVA ═══\n".blue);
	console.table({
		// "Sin ReAct": a,
		"Con ReAct": b,
	});

	console.log(
		"\n  La cadena tiene varios eslabones, pero eso solo se sabe al\n" +
			"  recorrerla. Un plan trazado por adelantado tendría que adivinar\n" +
			"  cuántas veces subir.\n\n" +
			"  ReAct compra exactamente eso: decidir la siguiente acción DESPUÉS\n" +
			"  de observar la anterior. Se paga en llamadas y en latencia.\n\n" +
			"  Y el precio de adaptarse es no saber cuándo parar.\n",
	);
}
