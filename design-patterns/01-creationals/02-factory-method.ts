/**
 * ! Factory Method:
 * El patrón Factory Method permite crear objetos sin especificar
 * la clase exacta del objeto que se creará. Es un patrón de diseño
 * creacional que proporciona una interfaz para crear objetos en una
 * superclase, mientras permite a las subclases alterar el tipo de
 * objetos que se crearán
 *
 * En lugar de eso, delegamos la creación de objetos a subclases o métodos
 * que encapsulan esta lógica.
 *
 * * Es útil cuando una clase no puede anticipar la clase
 * * de objetos que debe crear.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 *
 */

interface Hamburger {
	prepare(): void;
}

// es implements porque quieres usar la interfaz con aquello que trae para customizarla
class ChickenHamburger implements Hamburger {
	prepare(): void {
		console.log("preparing chicken hamburger");
	}
}
class BeefHamburger implements Hamburger {
	prepare(): void {
		console.log("preparing beef hamburger");
	}
}
class VeggieHamburger implements Hamburger {
	prepare(): void {
		console.log("preparing veggie hamburger");
	}
}

// esta es la factory
// las clases abstractas no permiten crear nuesvas instancias de la clase
// sirven para CONSTRUIR el esqueleto de otras clases
abstract class Restaurant {
	protected abstract createHamburger(): Hamburger;

	order(): void {
		const hamburger = this.createHamburger();
		hamburger.prepare();
	}
}

/* 
es extends y no implements porque quieres expandir la clase restaurant con lo que ya tiene
no quieres clonar el restaurante.

Clonarlo requeriría que en este nuevo restaurante tengas que volver a crear
el método order. Con extends, ya lo tienes y puedes añadir los nuevos
*/
class ChickenRestaurant extends Restaurant {
	// el override significa que quieres sobreescribir el método padre con forma quieras
	// el padre solo crea hamburguesas pero quizá quieras crear hamburguesas custom
	override createHamburger(): Hamburger {
		return new ChickenHamburger();
	}
}

class BeefRestaurant extends Restaurant {
	override createHamburger(): Hamburger {
		return new BeefHamburger();
	}
}

class VeggieRestaurant extends Restaurant {
	override createHamburger(): Hamburger {
		return new VeggieHamburger();
	}
}

function main() {
	let restaurant: Restaurant;

	const burgerType = prompt(
		"What type of burger do you want? (chicken/beef/veggie)",
	);

	switch (burgerType) {
		case "checken":
			{
				restaurant = new ChickenRestaurant();
			}
			break;
		case "beef":
			{
				restaurant = new BeefRestaurant();
			}
			break;
		case "veggie":
			{
				restaurant = new VeggieRestaurant();
			}
			break;
		default:
			throw new Error("invalid option");
	}

	restaurant.order();
}
main();
