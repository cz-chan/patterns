/**
 * ! Patrón Builder:
 * Es un patrón de diseño creacional que nos permite construir objetos complejos
 * paso a paso.
 *
 * El patrón nos permite producir distintos tipos y representaciones
 * de un objeto empleando el mismo código de construcción.
 *
 * * Es útil cuando necesitamos construir un objeto complejo con muchas partes
 * * y queremos que el proceso de construcción sea independiente de las partes
 * * que lo componen.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */

import { COLORS } from "../helpers/colors.ts";

class Computer {
	public cpu: string = `cpu - not defined`;
	public ram: string = `ram - not defined`;
	public storage: string = `storage - not defined`;
	public gpu?: string;

	displayConfig() {
		console.log(`Computer config:
        CPU: ${this.cpu}
        RAM: ${this.ram}
        Storage: ${this.storage}
        GPU: ${this.gpu}
      `);
	}
}

// el nombre es simplemente identificativo
class ComputerBuilder {
	private computer: Computer;

	// con el contructor, hacer que cada vez que se cree una instancia de ComputerBuilder todas tengan
	// las mismas propiedades
	constructor() {
		this.computer = new Computer();
	}

	// aquí es donde entra el builder pattern en acción
	setCPU(cpu: string): ComputerBuilder {
		// regresa la instancia del propio builder con la cpu que se le ha puedo
		this.computer.cpu = cpu;

		return this;
	}
	setRAN(ram: string): ComputerBuilder {
		// regresa la instancia del propio builder con la cpu que se le ha puedo
		this.computer.ram = ram;

		return this;
	}
	setStorage(storage: string): ComputerBuilder {
		// regresa la instancia del propio builder con la cpu que se le ha puedo
		this.computer.storage = storage;

		return this;
	}
	setGPU(gpu: string): ComputerBuilder {
		// regresa la instancia del propio builder con la cpu que se le ha puedo
		this.computer.gpu = gpu;

		return this;
	}

	// al ser una propiedad privada el computer, necesitas algún getter o método que devuelva la instancia
	build() {
		return this.computer; // no regresa la instancia del this como los otros, sino la compu
	}
}

function main() {
	/*
	si hace esto, simplemente devuelves una instancia del ComputerBuilder con las propertis por defecto
	const basicPC = new ComputerBuilder();
  
  la clave en este patrón reside en lso métodos regresan la propia instancia del computerbuilder
  por lo que puedes encadenar la invcaciónde los métodos ya que al ser ellos mismos los que llaman 
  a la instancia, es como si se autoconstruyera y se guardara en referencia los datos para la siguiente
  iteración de sí misma
  
  sin los 3 métodos obligatorios, no te permite crear el computer y solo cuando tienes todos los 
  datos configurados es que llamas al método build para crear la compu. sin esta, no es una compu
  sino una instancia del ComputerBuilder
  */
	const basicPC: Computer = new ComputerBuilder()
		.setCPU("Intel Core 2 Duo")
		.setRAN("4GB")
		.setStorage("256GB")
		.build(); // crea el cumputer, sin llamar a esto, es una simple instancia

	console.log(`${COLORS.blue}Basic Compu:${COLORS.reset}`);
	basicPC.displayConfig();
}

main();
