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
 * !Instrucciones:
 	1.Completen las Clases de Productos:
    •	ElectricCar debe implementar Vehicle y mostrar el mensaje "Ensamblando un auto eléctrico".
    •	GasCar debe implementar Vehicle y mostrar el mensaje "Ensamblando un auto de combustión".
    •	ElectricEngine debe implementar Engine y mostrar el mensaje "Arrancando motor eléctrico".
    •	GasEngine debe implementar Engine y mostrar el mensaje "Arrancando motor de combustión".

	2.	Completen las Clases de Fábricas:
    •	ElectricVehicleFactory debe crear un ElectricCar y un ElectricEngine.
    •	GasVehicleFactory debe crear un GasCar y un GasEngine.

	3. Prueben el Código:
	  •	Ejecuten el código para asegurarse de que cada fábrica produce el tipo 
    correcto de vehículo y motor.

 */
// 1. Interfaces de Vehicle y Engine
//* los casos de uso (el usuario quiere un coche)
interface Vehicle {
	assemble(): void;
}

interface Engine {
	start(): void;
}

// 2. Clases Concretas de Productos
//* laas features que resuelven el caso de uso (un coche puede ser de X tipo y tener Y   motor)
class ElectricCar implements Vehicle {
	assemble(): void {
		console.log("assembling a elictric car");
	}
}

class GasCar implements Vehicle {
	assemble(): void {
		console.log("assembling a fuel car");
	}
}

class ElectricEngine implements Engine {
	start(): void {
		console.log("starting an elentric engine");
	}
}

class GasEngine implements Engine {
	start(): void {
		console.log("starting an fuel engine");
	}
}

// 3. Interfaz de la Fábrica Abstracta
//* la parte de producto que me dice cómo debería verse dicha feature cuando un usuario la consume
//* que dependiendo del tipo de vehículo que quiera, llevará consigo un motor u otro
interface VehicleFactory {
	createVehicle(): Vehicle;
	createEngine(): Engine;
}

// 4. Clases Concretas de Fábricas
//* creo el producto en sí
class ElectricVehicleFactory implements VehicleFactory {
	createVehicle(): Vehicle {
		return new ElectricCar();
	}
	createEngine(): Engine {
		return new ElectricEngine();
	}
}

class GasVehicleFactory implements VehicleFactory {
	createVehicle(): Vehicle {
		return new GasCar();
	}
	createEngine(): Engine {
		return new GasEngine();
	}
}

// 5. Código Cliente
//* momento en el que el cliente pide el vehículo y se lo das
function main(factory: VehicleFactory) {
	const vehicle = factory.createVehicle();
	const engine = factory.createEngine();

	vehicle.assemble();
	engine.start();
}

// Pruebas
console.log("Creando vehículo eléctrico:");
main(new ElectricVehicleFactory());

console.log("\nCreando vehículo de combustión:");
main(new GasVehicleFactory());
