/**
 * ! Factory Method:
 * El patrón Factory Method permite crear objetos sin especificar
 * la clase exacta del objeto que se creará.
 *
 * En lugar de eso, delegamos la creación de objetos a subclases o métodos
 * que encapsulan esta lógica.
 *
 * * Es útil cuando una clase no puede anticipar la clase
 * * de objetos que debe crear.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 */

/**
 * 	!Descripción:
  1.	Completen las clases SalesReport e InventoryReport para implementar 
      la interfaz Report, generando el contenido de cada reporte en el método generate.
	  
  2.	Implementen las clases SalesReportFactory e InventoryReportFactory 
      para crear instancias de SalesReport y InventoryReport, respectivamente.

	3.	Prueben el programa generando diferentes tipos de reportes usando
      el prompt para seleccionar el tipo de reporte.
 */

import { COLORS } from "../helpers/colors.ts";

// 1. Definir la interfaz Report <- este es el producto que yo quiero como cliente, un reporte,
// de qué? no lo sé, dependerá del momento pero sé que quiero ese algo
interface Report {
	generate(): void;
}

// 2. Clases concretas de Reportes
// Implementar SalesReport e InventoryReport -> estos son los reportes que quiero como cliente,
// son los casos de uso que el cliente necesita
class SalesReport implements Report {
	// TODO: implementar el método e imprimir en consola:
	// 'Generando reporte de ventas...'
	generate(): void {
		console.log("generating sales report...");
	}
}

class InventoryReport implements Report {
	// TODO: implementar el método e imprimir en consola:
	// 'Generando reporte de inventario...'
	generate(): void {
		console.log("generating inventory report");
	}
}

// 3. Clase Base ReportFactory con el Método Factory

// esta es la superclase, es el cómo se crea cada reporte. da igual el reporte que sea, así se
// tienen que crear
abstract class ReportFactory {
	// abstract createReport(): Report;
	protected abstract createReport(): Report;
	/*
    tiene que ser protected abstrac el método para no poder acceder a este desde
    lugares que no sean la propia clase que lo crear (ReportFactory) o las clasas
    que extienden a la clase padre

    no se debería poder hacer un customReport.createReport() sino que sea la propia
    clase que extiende el ReportFactory la que haga el custom.generateReport() y sea este
    el método que llama al createReport

    si lo permite estarías creando reportes que no tienen un caso de uso para existir
  */

	generateReport(): void {
		const report = this.createReport();
		report.generate();
	}
}

// 4. Clases Concretas de Fábricas de Reportes
// estas fábricas son las features que resuelven los casos de uso del cliente
class SalesReportFactory extends ReportFactory {
	createReport(): Report {
		return new SalesReport();
	}
}

class InventoryReportFactory extends ReportFactory {
	createReport(): Report {
		return new InventoryReport();
	}
}

// 5. Código Cliente para Probar

function main() {
	let reportFactory: ReportFactory;

	const reportType = prompt(
		`¿Qué tipo de reporte deseas? ${COLORS.red}(sales/inventory)${COLORS.reset}`,
	);

	if (reportType === "sales") {
		reportFactory = new SalesReportFactory();
	} else {
		reportFactory = new InventoryReportFactory();
	}

	reportFactory.generateReport();
}

main();
