/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 * https://refactoring.guru/es/design-patterns/bridge
 *
 * este patrón intenta "quitar" la herencia a través de la composición.
 *
 * la composición signidica EXTRAER cierta lógica de la clase, a otra
 * clase separada para no tener todo el estado junto y así poder hacer
 * cambios y actualizaciones a estas clases de forma más atómica
 */

interface Ability {
	use(): void;
}

class SwordAttack implements Ability {
	use(): void {
		console.log("atacar con una espada");
	}
}
class AxeAttack implements Ability {
	use(): void {
		console.log("atacar con un hacha");
	}
}

class MagicSpell implements Ability {
	use(): void {
		console.log("atacar con un hechizo");
	}
}

class MagicFireballSpell implements Ability {
	use(): void {
		console.log("atacar con una bola de fuego mágica");
	}
}

abstract class Character {
	/*
  si coloco la ability private SOLO se podrá acceder a estar DENTRO
  de la clase que la crea, nunca en sus instancias
	private ability: Ability;

  pero si la coloco protected, SÍ voy a poder usar DENTRO ese método en 
  aquellas instancias que EXTIENDAN mi clase padre
  */
	protected ability: Ability;

	constructor(ability: Ability) {
		this.ability = ability;
	}

	setAbility(ability: Ability): void {
		this.ability = ability;
	}

	abstract performAbility(): void;
}

class Warrior extends Character {
	override performAbility(): void {
		console.log("el guerrero está listo para luchar");
		// this.ability.use(); // no podría usarlo así si la propiedad fuera privada
		this.ability.use();
	}
}

class Mage extends Character {
	override performAbility(): void {
		console.log("el mago tiene lista la barita");
		// this.ability.use(); // no podría usarlo así si la propiedad fuera privada
		this.ability.use(); // puedo usar ability porque es protected
	}
}

function main() {
	const warrior = new Warrior(new SwordAttack());
	warrior.performAbility();
	warrior.setAbility(new AxeAttack());

	warrior.performAbility();

	const mage = new Mage(new MagicSpell());
	mage.setAbility(new MagicFireballSpell());

	mage.performAbility();
}
main();
