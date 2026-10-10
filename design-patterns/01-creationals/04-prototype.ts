/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar/clonar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

/*
este patron evita que sea el usuario el que intuye cómo es el objeto, ya que
pueden haber métodos o propiedades ocultas que no sean visibles a simple
vista. Sino que es la propia clase que se copia a si misma con todo lo necesario
para que funcione la instancia como la clase ya que ella misma siempre va a saber
qué es lo que necesita para funcionar.
*/

class Document {
	public title: string;
	private author: string;
	public content: string;

	// tb podría crear y asignar en el constructor ahorrándome la propia creación y después asignación
	// evitas tanto la parte de arriba como lo de dentro del constuctor que está entre {}
	// constructor(public title: string, public author: string, private content: string) {
	constructor(title: string, author: string, content: string) {
		this.author = author;
		this.content = content;
		this.title = title;
	}

	// esto es la parte del clone que tiene que devolver el mismo documento asignando los mismos
	// argumentos indistintamente de si son private o protected
	clone(): Document {
		return new Document(this.title, this.author, this.content);
	}

	displayInfo() {
		console.log(`
      Title: ${this.title}
      Author: ${this.author}
      Content: ${this.content}
    `);
	}
}

function main() {
	const doc1 = new Document("pc", "Apple", "New Macbook Pro M5 Pro");

	console.log({ doc1 });
	doc1.displayInfo();

	// formas de clonar
	const doc2 = { ...doc1 };
	const doc3 = structuredClone(doc1);
	// esta última forma es más útil cuando hay elementos anidados ya que no los "rompe"

	doc2.title = "macbook mini";

	console.log({ doc2 });
	doc1.displayInfo();
}

main();
