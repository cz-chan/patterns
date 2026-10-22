/**
 * PATRÓN: CodeAct
 * ---------------
 * Origen: Wang et al., 2024 — "Executable Code Actions Elicit Better LLM Agents".
 *
 * En Tool Use (patrón 01) la acción del modelo es un JSON: un nombre de
 * herramienta y unos argumentos. Aquí la acción es CÓDIGO EJECUTABLE.
 *
 * La diferencia no es cosmética. El JSON no tiene `for`, no tiene `if`,
 * no tiene variables intermedias. Cada iteración de un bucle es un
 * round-trip completo al modelo. Con código, una sola acción hace lo que
 * en JSON exigiría treinta llamadas.
 *
//! * EL PRECIO:
//! * ==========================================================================
//! *  Sin aislamiento real,
//! *  "CodeAct no es un patrón agéntico, es una vulnerabilidad de
//! *   ejecución remota con buenas intenciones."
//! * ==========================================================================
 *
 * Este laboratorio tiene dos secciones:
 *
 *   A) Sin CodeAct   → herramientas atómicas encadenadas. NO puede terminar:
 *                      el enumerado exige ~30 pasos y el presupuesto son 10.
 *
 *   B) Con CodeAct   → el modelo escribe el algoritmo. Un paso.
 *
 */

import { generateText, tool, stepCountIs } from "ai";
import vm from "node:vm";
import { check, z } from "zod";

import { createTracer, model } from "../../helpers/index.js";
import { error } from "node:console";

// ---------------------------------------------------------------------------
// LOS DATOS — la fuga masiva
// ---------------------------------------------------------------------------

type Villain = {
	alias: string;
	/** Única especialidad capaz de neutralizarlo. */
	counteredBy: string;
	/** 1 = máxima prioridad. */
	threat: number;
};

type Hero = {
	alias: string;
	/** Puede contener varias especialidades separadas por "|". */
	specialty: string;
	/** Horas que puede operar. Cada operación consume 2. */
	availableHours: number;
};

const VILLAINS: Villain[] = [
	{ alias: "Mirror Master", counteredBy: "tecnología", threat: 1 },
	{ alias: "Killgrave", counteredBy: "tecnología", threat: 2 },
	{ alias: "Mister Freeze", counteredBy: "fuego", threat: 3 },
	{ alias: "Doctor Light", counteredBy: "luz", threat: 4 },
	{ alias: "Juggernaut", counteredBy: "telequinesis", threat: 5 },
	{ alias: "Solomon Grundy", counteredBy: "luz", threat: 6 },
	{ alias: "The Shade", counteredBy: "luz", threat: 7 },
	{ alias: "Heat Wave", counteredBy: "fuego", threat: 8 },
	{ alias: "Captain Cold", counteredBy: "fuego", threat: 9 },
	{ alias: "Brainiac", counteredBy: "tecnología", threat: 10 },
	{ alias: "Magneto", counteredBy: "telequinesis", threat: 11 },
	{ alias: "Firefly", counteredBy: "fuego", threat: 12 },
];

const HEROES: Hero[] = [
	{ alias: "Antorcha Humana", specialty: "fuego", availableHours: 6 },
	{ alias: "Green Lantern", specialty: "luz", availableHours: 4 },
	{ alias: "Iron Man", specialty: "tecnología", availableHours: 6 },
	{ alias: "Jean Grey", specialty: "telequinesis", availableHours: 4 },
	{ alias: "Superman", specialty: "fuego|luz", availableHours: 2 },
];

const HOURS_PER_OPERATION = 2;

/**
 * Capacidad total: 11 operaciones para 12 villanos.
 * Está diseñado así a propósito: SIEMPRE sobra al menos un villano.
 * El plan está obligado a contemplar la rama "nadie puede con este villano".
 */
const MISSION =
	"12 villains have escaped from the maximum-security prison.\n\n" +
	"Plan the operation:\n" +
	"  - Group the villains by the hero who will neutralize them.\n" +
	"  - A hero can neutralize a villain if the specialty that " +
	"counteracts the villain is among the hero’s specialties " +
	'(a hero can have multiple specialties, separated by "|").\n' +
	`  - Each operation consumes ${HOURS_PER_OPERATION} hours of the hero’s time.\n` +
	"  - No hero may exceed their available hours.\n" +
	"  - Handle those with the lowest threat level first (1 = most urgent).\n" +
	"  - Within each group, sort the villains by ascending threat level.\n" +
	"  - Villains that no one can handle go to a separate list.";
("answer always in spanish");

// ---------------------------------------------------------------------------
// EL JUEZ PROGRAMÁTICO — regex y aritmética, cero criterio del modelo
// ---------------------------------------------------------------------------

// Recuerden que esto no es parte del patrón, simplemente es para verificar que el plan es válido.
type Plan = {
	// sería numbre del herore y array de todos los villanos que puede atrapar ese heroe
	assignments: Record<string, string[]>;
	unhandled: string[];
};

type Check = { label: string; passed: boolean };

function auditPlan(plan: Plan | null): Check[] {
	const assignments =
		plan && typeof plan === "object" ? (plan.assignments ?? {}) : {};
	const unhandled =
		plan && typeof plan === "object" ? (plan.unhandled ?? []) : [];

	const assigned = Object.values(assignments).flat();
	const all = [...assigned, ...unhandled];
	const aliases = VILLAINS.map((v) => v.alias);

	/**
	 * SIN ESTA GUARDA EL JUEZ MIENTE.
	 * Un plan vacío cumple "nadie excede sus horas" y "los grupos están
	 * ordenados" por vacuidad: no hay nada que violar. Toda verificación
	 * estructural exige que haya trabajo real que verificar.
	 */
	const hasWork = assigned.length > 0;

	// 1. Cobertura exacta: los 12 villanos, ninguno repetido, ninguno inventado.
	const coverage =
		all.length === VILLAINS.length &&
		new Set(all).size === VILLAINS.length &&
		all.every((alias) => aliases.includes(alias));

	// 2. Cada asignación respeta la especialidad del héroe.
	const specialtyOk =
		hasWork &&
		Object.entries(assignments).every(([heroAlias, group]) => {
			const hero = HEROES.find((h) => h.alias === heroAlias);
			if (!hero) return false;

			const specialties = hero.specialty.split("|");
			return group.every((villainAlias) => {
				const villain = VILLAINS.find((v) => v.alias === villainAlias);
				return !!villain && specialties.includes(villain.counteredBy);
			});
		});

	// 3. Presupuesto de horas: nadie se pasa.
	const budgetOk =
		hasWork &&
		Object.entries(assignments).every(([heroAlias, group]) => {
			const hero = HEROES.find((h) => h.alias === heroAlias);
			return (
				!!hero && group.length * HOURS_PER_OPERATION <= hero.availableHours
			);
		});

	// 4. Cada grupo ordenado por amenaza ascendente.
	const sortedOk =
		hasWork &&
		Object.values(assignments).every((group) => {
			const threats = group.map(
				(alias) => VILLAINS.find((v) => v.alias === alias)?.threat ?? 999,
			);
			return threats.every((threat, i) => i === 0 || threats[i - 1]! <= threat);
		});

	/**
	 * 5. Los tres más urgentes deben estar ASIGNADOS.
	 *    Ojo: "no estar en unhandled" no basta — un plan vacío también cumple
	 *    eso. Hay que exigir presencia, no ausencia.
	 */
	const urgentOk = [1, 2, 3].every((threat) => {
		const villain = VILLAINS.find((v) => v.threat === threat)!;
		return assigned.includes(villain.alias);
	});

	return [
		{
			label: "Cobertura: los 12 villanos, sin repetir ni inventar",
			passed: coverage,
		},
		{
			label: "Especialidad: cada héroe contrarresta de verdad",
			passed: specialtyOk,
		},
		{ label: "Presupuesto: nadie excede sus horas", passed: budgetOk },
		{ label: "Orden: grupos ordenados por amenaza", passed: sortedOk },
		{ label: "Urgencia: amenazas 1-3 cubiertas", passed: urgentOk },
	];
}

function printAudit(checks: Check[]) {
	const passed = checks.filter((check) => check.passed).length;

	for (const check of checks) {
		console.log(`     ${check.passed ? "✓".green : "✗".red} ${check.label}`);
	}
	console.log(
		`     → ${passed}/${checks.length} verificaciones superadas`.blue,
	);

	return passed;
}

// ---------------------------------------------------------------------------
// A) SIN CODEACT — herramientas atómicas, una acción JSON por dato
// ---------------------------------------------------------------------------
/**
 * El detalle clave: `getNextVillain`
 * solo permite avanzar elemento por elemento usando el cursor que entrega cada llamada.
 *
 * ¿Qué implica esto? El agente únicamente puede avanzar paso a paso usando el cursor proporcionado,
 * sin saber cuántos elementos hay por adelantado ni acceder directamente a cualquier elemento de la lista.
 * No puede, por ejemplo:
 *     - Pedir el villano #7 sin antes haber pasado por los seis anteriores; siempre debe usar el valor devuelto por la llamada previa.
 *     - No es posible pedir el villano #7 sin haber solicitado antes el #6.
 *
 * Esto elimina la posibilidad de llamadas en paralelo. El modelo está
 * obligado a gastar un paso por villano. 12 villanos + 5 héroes +
 * 12 asignaciones ≈ 30 pasos mínimos, y el presupuesto son 10.
 *
 * No falla "a veces". No puede terminar ya que es matemáticamente imposible.
 */
const STEP_BUDGET = 10;

/**
 * * buildAtomicTools es necesaria para obligar al modelo a recorrer los datos uno por uno.
 *
 * Provee:
 *   - Las tres "herramientas" mínimas que el modelo puede invocar (con restricciones de acceso/economía de pasos).
 *   - Un mecanismo (toPlan) para reconstruir a posteriori el plan generado, en base a las asignaciones realizadas.
 *
 * Esto es clave para ilustrar las limitaciones del JSON puro frente al enfoque code-act.
 */
function buildAtomicTools() {
	// Lista de asignaciones realizadas por el modelo, usada para reconstruir el plan.
	const collected: Array<{ hero: string; villain: string }> = [];
	// [
	//   { hero: "Iron Man", villain: "Thanos" },
	//   { hero: "Spider-Man", villain: "Mysterio" },
	//   { hero: "Captain America", villain: "Red Skull" },
	// ]

	// Herramienta para obtener villanos de a uno, sólo avanzando con el cursor previo.
	const getNextVillain = tool({
		description:
			"Returns ONE villain and the cursor to request the next one." +
			'Starts with the "start" cursor. When nextCursor is null, you are done.',
		inputSchema: z.object({
			cursor: z
				.string()
				.describe('"start" or the nextCursor from the previous call'),
		}),
		execute: async ({ cursor }) => {
			const index = cursor === "start" ? 0 : Number(cursor.replace("vln-", ""));
			const villain = VILLAINS[index];

			if (!villain) return { villain: null, nextCursor: null };

			return {
				villain,
				nextCursor: index + 1 < VILLAINS.length ? `vln-${index + 1}` : null,
			};
		},
	});

	// Herramienta para obtener héroes de a uno, sólo avanzando con el cursor previo.
	const getNextHero = tool({
		description:
			"Returns ONE hero and the cursor to select the next one." +
			'Starts with the "start" cursor.',
		inputSchema: z.object({ cursor: z.string() }),
		execute: async ({ cursor }) => {
			const index = cursor === "start" ? 0 : Number(cursor.replace("hro-", ""));
			const hero = HEROES[index];

			if (!hero) return { hero: null, nextCursor: null };

			return {
				hero,
				nextCursor: index + 1 < HEROES.length ? `hro-${index + 1}` : null,
			};
		},
	});

	// Herramienta para registrar la asignación de un héroe a un villano.
	const assignHero = tool({
		description: "Records the pairing of ONE villain with ONE hero.",
		inputSchema: z.object({
			heroAlias: z.string(),
			villainAlias: z.string(),
		}),
		execute: async ({ heroAlias, villainAlias }) => {
			collected.push({ hero: heroAlias, villain: villainAlias });
			return { registered: true, total: collected.length };
		},
	});

	// Expone las herramientas para el agente y el método para reconstruir el plan final.
	return {
		tools: { getNextVillain, getNextHero, assignHero },
		// El objetivo de este método toPlan es reconstruir el "plan" final a partir
		// de las asignaciones registradas en el arreglo `collected`.
		// Recorre todas las entradas de asignaciones y agrupa los villanos asignados
		// a cada héroe en un objeto.
		// Devuelve un objeto con dicha agrupación y un array vacío para "unhandled".
		toPlan(): Plan {
			const assignments: Record<string, string[]> = {};

			for (const entry of collected) {
				(assignments[entry.hero] ??= []).push(entry.villain);
			}

			return { assignments, unhandled: [] };
		},
	};
}

// ---------------------------------------------------------------------------
// A) SIN CODEACT — herramientas atómicas, una acción JSON por dato
// ---------------------------------------------------------------------------

async function withoutCodeAct() {
	console.log(`
      ${model.modelId}
      ${model.provider}`);

	console.log("\n═══ A) SIN CODEACT — acciones en JSON ═══\n".blue);
	const tracer = createTracer("sin-codeact");
	const atomic = buildAtomicTools();

	// loop para intentar responder todo lo que queremos
	// no sebería ser capaz de resolver nada proqeu son ~30 pasos y solo le permutimos 10
	await generateText({
		model,
		prompt: MISSION,
		tools: atomic.tools,
		stopWhen: stepCountIs(STEP_BUDGET),
		instructions:
			"you are an operator manager" +
			"Explore all the villains and heroes using the tools" +
			"before assign. do not make up data that you do not review it" +
			"register each assign with assignHero" +
			"answer always in spanish",
		onStepEnd: tracer.onStepFinish,
	});

	const plan = atomic.toPlan();

	console.log("\n Auditoría:".blue);
	const score = printAudit(auditPlan(plan));

	console.log(
		(
			`\n  ⚠️  Presupuesto: ${STEP_BUDGET} pasos.` +
			"\n      Solo enumerar los 12 villanos con cursor ya consume 12." +
			"\n      El JSON no sabe iterar: cada elemento es un viaje al modelo."
		).yellow,
	);

	return { ...tracer.summary(), score }; // score
}

// ---------------------------------------------------------------------------
// EL SANDBOX — la parte que NO es opcional
// ---------------------------------------------------------------------------
/**
 * `node:vm` aísla el ÁMBITO, no el PROCESO.
 * La documentación de Node lo dice: no es un mecanismo de seguridad.
 * Referencia:
 *  https://safeguard.sh/resources/blog/security-concerns-of-using-the-nodejs-vm-module-as-a-sandbox
 * Lo usamos aquí porque es cero dependencias y suficiente para el laboratorio.
 * En producción: worker aislado, contenedor efímero sin red, o un runtime
 * como isolated-vm / Deno con permisos denegados por defecto.
 *
 */
type SandboxResult = {
	ok: boolean;
	logs: string[];
	value?: unknown;
	error?: string;
};

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object") {
		Object.values(value).forEach(deepFreeze);
		Object.freeze(value);
	}
	return value;
}

//! siempre es bueno colocar algún breaker para que se salga cuando haya algún error
function runInSandbox(code: string, timeoutMs = 1_000): SandboxResult {
	const logs: string[] = [];

	const sandbox = {
		db: deepFreeze({
			villains: structuredClone(VILLAINS),
			heroes: structuredClone(HEROES),
			hoursPerOperation: HOURS_PER_OPERATION,
		}),
		console: {
			log: (...args: unknown[]) =>
				logs.push(args.map((a) => String(a)).join(" ")),
		},
	};

	try {
		const context = vm.createContext(sandbox);

		// El wrapper permite que el código del modelo use `return`.
		// vm.Script crea un objeto script compilado a partir del código fuente proporcionado.
		// Permite luego ejecutar ese código en un contexto seguro (sandbox) con runInContext.
		// Aquí, envolvemos el código del usuario/modelo en una función autoinvocada para permitir "return".
		const script = new vm.Script(`(function () {\n${code}\n})()`);
		const value = script.runInContext(context, { timeout: timeoutMs });

		return { ok: true, value, logs };
	} catch (error) {
		return { ok: false, logs, error: (error as Error).message };
	}
}

/** Los modelos a veces envuelven el código en ```js ... ```. */
function extractCode(raw: string): string {
	const fenced = raw.match(
		/```(?:js|javascript|ts|typescript)?\n([\s\S]*?)```/,
	);
	return (fenced?.[1] ?? raw).trim();
}

// ---------------------------------------------------------------------------
// B) CON CODEACT — la acción es un programa
// ---------------------------------------------------------------------------

async function withCodeAct() {
	console.log("\n═══ B) CON CODEACT — la acción es código ═══\n".blue);
	const tracer = createTracer("con-codeact");

	let lastPlan: Plan | null = null;

	// esta es la tool que el modelo va a llamar
	const runCode = tool({
		description:
			"Execute JavaScript code in a sandbox and return whatever you get." +
			"Inside, you have:\n" +
			"  db.villains → [{ alias, counteredBy, threat }]\n" +
			"  db.heroes   → [{ alias, specialty, availableHours }]\n" +
			"  db.hoursPerOperation → number\n" +
			"Use `return` to return the result. No `await`, no `require`, " +
			"no network or file access." +
			"answare always in spanish",
		inputSchema: z.object({
			code: z.string().describe("JavaScript Code. They will end with a return"),
		}),
		// las herramientas deben implementar SIEMPRE algúntipo de ejecución
		execute: async ({ code }) => {
			const result = runInSandbox(extractCode(code));

			if (!result.ok) {
				return {
					ok: false,
					error: result.error,
					logs: result.logs,
					hint: "the code throw an exception. fix it and rerun the code",
				};
			}

			// le pasas al auditplan aquellos values que hayan fallado passed != true
			const failed = auditPlan(result.value as Plan)
				.filter((check) => !check.passed)
				.map((check) => check.label);

			// el último plan dejará el length a cero
			if (failed.length === 0) {
				lastPlan = result.value as Plan;
			}

			return {
				ok: failed.length === 0,
				logs: result.logs,
				value: result.value,
				failChecks: failed,
				hint: failed.length
					? `the plan is not valid. failed: ${failed.join(",")}` +
						"check all real data before answer:" +
						'run a "db.villains[0]" and chech what fields does it have' +
						"you do not do own test data: the db is already laoded"
					: "valid plan",
			};
		},
	});

	await generateText({
		model,
		prompt:
			MISSION +
			"\n\nWrite a single program that handles the entire operation and " +
			"returns exactly this object:\n" +
			'{ assignments: { "<hero´s alias>": ["<villain´s alias>", ...] }, ' +
			'unhandled: ["<villains alias>", ...] }',
		tools: { runCode },
		stopWhen: stepCountIs(6), // esta es la válvula de escape
		instructions:
			"You are the operation coordinator. Respond in Spanish." +
			"Don't try to figure out the villain-to-villain mapping: write the algorithm and" +
			"let the sandbox run it." +
			"The REAL data is already in `db` inside the sandbox: never" +
			"declare test villains or heroes, and if you're unsure about the format of " +
			"a record, check it with a `return`." +
			"If the tool reports `failedChecks`, your code has a bug: " +
			"fix it and run it again. Don't try to justify the result.",
		onStepEnd: tracer.onStepFinish,
	});

	console.log("\n Plan devuelto por el sandbox:".blue);
	console.log(JSON.stringify(lastPlan, null, 2));

	console.log("\n Auditoría:".blue);
	const score = printAudit(auditPlan(lastPlan));

	console.log(
		(
			"\n  ✅ El bucle, el descuento de horas y el orden viven en el" +
			"\n     intérprete, no en la cabeza del modelo. El intérprete no" +
			"\n     olvida ni se equivoca al restar."
		).green,
	);

	return { ...tracer.summary(), score };
}

// ---------------------------------------------------------------------------
// C) EL PRECIO DEL PATRÓN — por qué `node:vm` no basta
// ---------------------------------------------------------------------------
/**
 * Estas cuatro sondas son defensivas que se pueden implementar:
 * sirven para comprobar qué contiene tu supuesto sandbox ANTES de dejar que un modelo escriba en él.
 *
 * Las tres primeras se contienen. La cuarta no. Y no es un fallo de Node:
 * `vm` nunca prometió lo contrario.
 */
const SANDBOX_PROBES = [
	{
		label: "Bucle infinito",
		code: "while (true) {}",
		expectation: "debe cortar por timeout",
	},
	{
		label: "Acceso a require",
		code: "return typeof require;",
		expectation: 'debe ser "undefined"',
	},
	{
		label: "Acceso a process",
		code: "return typeof process;",
		expectation: 'debe ser "undefined"',
	},
	{
		label: "Salto de realm vía globalThis.constructor",
		code: "return typeof globalThis.constructor.constructor('return process')();",
		expectation: 'DEBERÍA ser "undefined"… compruébalo',
	},
];

// ---------------------------------------------------------------------------
// EJECUCIÓN DEL PROGRAMA
// ---------------------------------------------------------------------------

export async function codeActMain() {
	const a = await withoutCodeAct();
	const b = await withCodeAct();

	console.log("\n═══ COMPARATIVA ═══\n".blue);
	console.table({
		"Sin CodeAct (JSON)": a,
		"Con CodeAct": b,
	});

	console.log(
		"\n  CodeAct no ahorra tokens por ser más listo: los ahorra porque\n" +
			"  mueve el bucle del modelo al intérprete. Doce elementos o mil,\n" +
			"  el coste del razonamiento es el mismo",
	);
}
