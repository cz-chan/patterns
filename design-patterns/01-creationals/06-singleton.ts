/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 *
 * Este patrón resuelve (vulnerando el principio de responsabilidad única):
 * - garantiza que una clase SOLO tiene una instancia única
 *  esto es útiul cuando quieres controlar los accesos a ciertos recursos compartidos
 * como puede ser una db o archivo concreto
 *
 * - proporcionar una punto de acceso global a la instancia -> esto lleva intrínseco
 * un problema: tienes acceso desde cualquier lugar a cualquier variable pero evita
 * qeu sea sobreescrita la instancia
 *
 * Un singleton tiene en común:
 * - constructor privado -> evitan que puedan hacer nuevas instancias -> no se puede un "new"
 * - tinee un método que emula el constructor
 */

// este es mi sigleton -> solo van a haber 7 esferas
class DragonBalls {
	/*
  los métodos estáticos permiten referenciarlos sin tener que instanciar la clase.
  en un singleton si no los haces statics, no puedes acceder ya que no puedes instanciar
  */

	private static instance: DragonBalls;
	private dragronBallCount: number;

	private constructor() {
		this.dragronBallCount = 0;
	}

	// esta es la clave del singleton. método qie llama al constructor y si no está creado, lo crea
	public static getInstance(): DragonBalls {
		if (!DragonBalls.instance) {
			DragonBalls.instance = new DragonBalls();
		}

		return DragonBalls.instance;
	}

	conllection(): void {
		if (this.dragronBallCount < 7) {
			this.dragronBallCount++;
			console.log(`The Dragon Balls are ${this.dragronBallCount}`);
			return;
		}

		console.log("ya puedes llamar a Shenlong");
	}

	summonShenlong() {
		if (this.dragronBallCount === 7) {
			console.log("shenlong ha sido invocado");
			this.dragronBallCount = 0;
			return;
		}

		console.log(`aún faltan ${7 - this.dragronBallCount} esferas del dragon`);
	}
}

function main() {
	const goku = DragonBalls.getInstance();
	goku.conllection();
	goku.conllection();
	goku.conllection();

	goku.summonShenlong();

	const vegeta = DragonBalls.getInstance();

	vegeta.conllection();
	vegeta.conllection();
	vegeta.conllection();
	vegeta.conllection();

	goku.summonShenlong();
}
main();
