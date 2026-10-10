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
	const tracer = createTracer("witout-tools");

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
		level: z.enum(["basic", "intermediate", "advanced"]),
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

export async function toolUseMain() {
	const resultA = await withoutTools();

	console.log("\n ======= Comparativa ========");
	console.table({
		"sin tools": resultA,
	});
}
