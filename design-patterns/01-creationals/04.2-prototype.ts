/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

class Pokemon {
	// name: string;
	// type: string;
	// level: number;
	// attacks: string[];

	// constructor(name: string, type: string, level: number, attacks: string[]) {
	// 	this.name = name;
	// 	this.type = type;
	// 	this.level = level;
	// 	this.attacks = attacks;
	// }

	// esto ⬇️ es lo mismo que esto ⬆️
	constructor(
		public name: string,
		public type: string,
		public level: number,
		public attacks: string[],
	) {}

	// Método para clonar el Pokémon
	clone(): Pokemon {
		// Los ataques deben de evitar pasarse por referencia, es decir, no deben de ser el mismo arreglo.
		// Completar: Debe devolver un nuevo Pokémon con los mismos atributos
		const newName = this.name;
		const newType = this.type;
		const newLevel = this.level;
		const newAttacks = [...this.attacks];

		// que un array pase por referencia significa que la variable guarda la dirección del array en
		// memoria, no los elementos que contiene
		// Si fuera un array de objetos ({name, power}[]), esos objetos internos seguirían
		// compartidos entre los dos Pokémon. Para eso necesitas una copia profunda (deep copy):
		// structuredClone(this.attacks) o hacer .map(a => ({...a}))

		// return new Pokemon(this.name, this.type, this.level, [...this.attacks]); // hace lo mismo ⬇️
		return new Pokemon(newName, newType, newLevel, newAttacks);
	}

	displayInfo(): void {
		console.log(
			`Nombre: ${this.name}\nTipo: ${this.type}\nNivel: ${
				this.level
			}\nAtaques: ${this.attacks.join(", ")}`,
		);
	}
}

function main() {
	const basePokemon = new Pokemon("Charmander", "Fuego", 1, [
		"Llamarada",
		"Arañazo",
	]);
	const clone1 = basePokemon.clone();
	clone1.name = "Charmeleon";
	clone1.level = 16;
	clone1.type = "volador";
	clone1.attacks.push("Lanzallamas");
	clone1.attacks.push("Pisotón");

	basePokemon.displayInfo(); // Aquí no debe de aparecer "Lanzallamas"
	clone1.displayInfo();
}
main();

// Tarea:
// 1. Crear un Pokémon base.
// 2. Clonar el Pokémon base y modificar algunos atributos en los clones.
// 3. Llamar a displayInfo en cada Pokémon para mostrar sus detalles.

// Ejemplo:
