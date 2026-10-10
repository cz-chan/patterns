/**
 * PATRÓN: Uso de herramientas - Tool use
 * ---------------------------
 * El catálogo de cursos NO está en el entrenamiento
 * del modelo. Sin herramientas, el modelo inventa precios y cursos con
 * total confianza o en su defecto, no hace nada.
 * Con herramientas, consulta el dato real.
 */

import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { createTracer, model } from "../../helpers/index.js";

// ---------------------------------------------------------------------------
//  LA "BASE DE DATOS" — datos que el modelo no puede conocer
// ---------------------------------------------------------------------------

type Course = {
	id: string;
	title: string;
	hours: number;
	priceUSD: number;
	level: "basic" | "intermediate" | "advanced";
	students: number;
};

const COURSE_CATALOG: Course[] = [
	{
		id: "ts-01",
		title: "TypeScript desde cero",
		hours: 22,
		priceUSD: 19.99,
		level: "basic",
		students: 48_120,
	},
	{
		id: "nest-02",
		title: "NestJS: API REST modular",
		hours: 31,
		priceUSD: 24.99,
		level: "intermediate",
		students: 22_450,
	},
	{
		id: "flu-03",
		title: "Flutter: apps multiplataforma",
		hours: 46,
		priceUSD: 29.99,
		level: "intermediate",
		students: 61_300,
	},
	{
		id: "agt-04",
		title: "Agentes de IA con TypeScript",
		hours: 18,
		priceUSD: 34.99,
		level: "advanced",
		students: 1_890,
	},
	{
		id: "dkr-05",
		title: "Docker para desarrolladores",
		hours: 14,
		priceUSD: 17.99,
		level: "basic",
		students: 35_770,
	},
];

const QUESTION =
	"¿cuánto costaría juntos el curso de TypeScript y el de Docker con un 20% de descuento? Dame también las horas totales que duran entre los dos.";

async function withoutTools() {
	// para ver la cadena de pensamiento
	const tracer = createTracer("without-tools");

	const { text } = await generateText({
		model: model,
		prompt: QUESTION,
		onStepEnd: tracer.onStepFinish,
	});

	console.log("\n Respuesta: ", text.green);
	console.log();
	return tracer.summary();
}

//* implementación del patron TOOL USE ⬇️

// first tool
const findCourses = tool({
	description:
		"necesito que busques cursos en el catálogo de DevTalles" +
		" por texto, por título o por nivel, utilízala siempre antes de " +
		"responder cualquier pregunta sobre cursos, precios y cantidad de alumnos",
	inputSchema: z.object({
		// se recomienda que sean objetos porque es más fácil de expandir
		text: z
			.string()
			.optional()
			.describe("texto a buscar en el título del curso"),
		level: z.enum(["basic", "intermediate", "advanced"]).optional(),
	}),
	execute: async ({ level, text }) => {
		// level y text es lo que has puesto como el obj inputSchema, si pones más, se mostrarán
		const filteredCourses = COURSE_CATALOG.filter((course) => {
			// la realidad aquí es que se tendría que hacer un query a la db para hacer los selects
			// pero a fines académicos, se hace así
			const matchText =
				!text || course.title.toLowerCase().includes(text.toLowerCase());

			const matchesLevel = !level || course.level === level;

			return matchText && matchesLevel;
		});

		return {
			found: filteredCourses.length,
			courses: filteredCourses,
		};
	},
});

const calculateTotal = tool({
	description:
		"calcula el precio total de una lista de cursos, aplicando un descuento porcentual," +
		" utiliza siempre para cualquier operación aritmética, no calcules mentalmente",
	inputSchema: z.object({
		courseIDs: z
			.array(z.string())
			.describe("Courses id. ej ['ts-01', 'dkr-02']"), // es bueno poner un describe
		discuontPercent: z.number().min(0).max(100).default(0),
	}),
	execute: async ({ courseIDs, discuontPercent }) => {
		// buscar los datops en la db (o en nuestro caso en la const)
		const foundCourses = COURSE_CATALOG.filter((course) =>
			courseIDs.includes(course.id),
		);
		const notFound = courseIDs.filter(
			(findedID) => !COURSE_CATALOG.some((course) => course.id === findedID),
		);

		if (notFound) {
			throw new Error("Course not found");
		}

		const subTotal = foundCourses.reduce(
			(acc, course) => acc + course.priceUSD,
			0,
		);

		const discount = subTotal * (discuontPercent / 100);

		return {
			subtotal: Number(subTotal.toFixed(2)),
			discount: Number(discount.toFixed(2)),
			total: Number(subTotal - discount).toFixed(2),
			notFound: notFound,
		};
	},
});

async function withTools() {
	// para ver la cadena de pensamiento
	const tracer = createTracer("with-tools");

	const { text } = await generateText({
		model: model,
		tools: {
			findCourses, // esto es la herramienta
		},
		prompt: QUESTION,
		// las instructions antes eran system y sin el "system prompt" que le dice al agente qué es y qué
		// hace mientras que el prompt es aquella consulta que un usuario puede hacerle
		instructions:
			"eres un asistente de catálogo de cursos de detalles no inventes," +
			" precios duraciones ni nombres de cursos. Consúltalo siempre " +
			"con las herramientas disponibles.",
		onStepEnd: tracer.onStepFinish,
		// ⬇️ esto último sería un "patron" circuit breaker donde si algo está mal hecho y no hay
		// ningún tope, va a seguir ejecutándose y gastanco. de esta forma le pones un límite de pasos
		stopWhen: stepCountIs(6),
	});

	console.log("\n Respuesta: ", text.green);
	console.log();
	return tracer.summary();
}

export async function toolUseMain() {
	const resultA = await withoutTools();
	const resultB = await withTools();

	console.log("\n ======= Comparativa ========");
	console.table({
		"sin tools": resultA,
		"con tools": resultB,
	});
}
