/**
 * ! Abstract Factory:
 * Es un patrón de diseño que permite crear familias de objetos relacionados
 * sin especificar sus clases concretas.
 *
 * En lugar de crear objetos individuales directamente,
 * creamos fábricas que producen un conjunto de objetos relacionados.
 *
 * * Es útil cuando necesitas crear objetos que son parte de una familia
 * * y quieres asegurarte de que estos objetos se complementen entre sí.
 *
 * https://refactoring.guru/es/design-patterns/abstract-factory
 */

/**
 *  El propósito del Abstract Factory es crear familias de objetos relacionados
 *  (en este caso, hamburguesas y bebidas) sin especificar las clases concretas
 *  de cada uno de esos objetos en el código principal.
 */

//* productos que quiero crear: Burger y Drink
interface Hamburger {
	prapare(): void;
}

interface Drink {
	pour(): void;
}

//* productos customizados: tipo de hamburguesa y bebida
class ChickenHamburger implements Hamburger {
	prapare(): void {
		console.log("preparing chicken burger");
	}
}

class BeefHamburger implements Hamburger {
	prapare(): void {
		console.log("preparing Beef burger");
	}
}

class Water implements Drink {
	pour(): void {
		console.log("pouring glass of water");
	}
}

class Soda implements Drink {
	pour(): void {
		console.log("pouring glass of soda");
	}
}

//* cración de las fábricas de burger y drinks
interface RestaurantFactory {
	createHamburger(): Hamburger;
	createDrink(): Drink;
}

class FastFoodRestaurantFactory implements RestaurantFactory {
	createHamburger(): Hamburger {
		return new BeefHamburger();
	}
	createDrink(): Drink {
		return new Soda();
	}
}

class HealthyFoodRestaurantFactory implements RestaurantFactory {
	createHamburger(): Hamburger {
		return new ChickenHamburger();
	}
	createDrink(): Drink {
		return new Water();
	}
}

function main(factory: RestaurantFactory) {
	/*
  no estás especificando que tipo de restaurante quires devolver, eso se lo dejas al cliente
  tu simplemente te has centrado a crear las distintas features del producto a través de lo
  que has visto que un cliente espera

  pero es el cliente cuando te llame que te va a pedir X o Y y acorde a eso, le devuelves una 
  u otra cosa
  */
	const hamburger = factory.createHamburger();
	const drink = factory.createDrink();

	// "sirves" los métodos de los distintos productos que un usuario pide
	hamburger.prapare();
	drink.pour();
}

// aquí es donde le dices qué es lo que quieres
main(new FastFoodRestaurantFactory());
