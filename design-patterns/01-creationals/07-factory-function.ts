/**
 * ! Factory Function
 * Es un patrón de diseño que nos permite crear objetos o funciones de manera dinámica que serán
 * usados posteriormente en el código. Y es útil sobre todo en JS gracias a que no hay un tipado
 * estricto
 *
 * * Es útil cuando necesitamos crear objetos o funciones de manera dinámica,
 * * es decir, en tiempo de ejecución y no en tiempo de compilación.
 *
 */

type Language = "es" | "en" | "fr";

// esto podrñia ser algún tipo de i18n
function createGreeter(lang: Language) {
	return function (name: string) {
		const messages = {
			es: `Hola, ${name}`,
			en: `Hello, ${name}`,
			fr: `Bonjour, ${name}`,
		};

		return console.log(messages[lang]);
	};
}

function main() {
	const spanishGreeter = createGreeter("es");
	const englishGreeter = createGreeter("en");
	const frenchGreeter = createGreeter("fr");

	spanishGreeter("chema");
	englishGreeter("alice");
	frenchGreeter("pierre");
}
main();
