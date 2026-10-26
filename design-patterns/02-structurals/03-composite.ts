/**
 * ! Patrón Composite
 * Es un patrón de diseño estructural que permite componer objetos
 * en estructuras de árbol para representar jerarquías. <- esta es la clave: JERARQUÍA
 *
 * El patrón permite a los clientes tratar de manera uniforme a los objetos
 * individuales y a sus composiciones.
 *
 * * Es útil cuando necesitas tratar a los objetos individuales
 * * y a sus composiciones de manera uniforme, y la estructura
 * * de los objetos forma una jerarquía en árbol.
 *
 * https://refactoring.guru/es/design-patterns/composite
 *
 * este pratón SÓLO es útil en la aplicación que se puede representar en
 * forma de árbol. Es decir, exite una jerarquía y composición de
 * elementos.
 */

// un ejemplo de ejercicio podría llegar a ser un file system donde hay folders
// files pero dentro de los folder pueden haber subcarpetas y así...

interface FileSystemComponent {
	showDetails(indent?: string): void;
}

class File implements FileSystemComponent {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	showDetails(indent?: string): void {
		console.log(`${indent}- File: ${this.name}`);
	}
}

class Folder implements FileSystemComponent {
	private name: string;
	private contents: FileSystemComponent[] = [];

	constructor(name: string) {
		this.name = name;
	}

	add(component: FileSystemComponent | FileSystemComponent[]) {
		const items = Array.isArray(component) ? component : [component];
		items.forEach((content) => this.contents.push(content));
	}

	/*
		hay más formas de hacer la sobrecarga de operadores (poder enviarle 1 o más elementos a la vez)
		más corta:
		add(component: FileSystemComponent | FileSystemComponent[]) {
      this.contents.push(...[component].flat());
		}

		hacer el rest de los params:
		add(...components: FileSystemComponent[]) {
      this.contents.push(...components);
		}
	*/

	// esto sería similar a cómo se muestran los contenidos en VSCode, uno dentro de otro pero indentados
	showDetails(indent: string = ""): void {
		console.log(`${indent}+ Folder: ${this.name}`);
		this.contents.forEach((content) => content.showDetails(indent + " "));
	}
}

function main() {
	const file1 = new File("archivo1.txt");
	const file2 = new File("archivo2.txt");
	const file3 = new File("archivo3.txt");
	const file4 = new File("archivo4.txt");

	const folder1 = new Folder("dir1");
	const folder2 = new Folder("dir2");
	const folder3 = new Folder("dir3");

	folder1.add([file1, file2]);
	// folder1.showDetails();

	folder2.add([file3, folder3]);

	folder3.add(file4);

	const root = new Folder("root");
	root.add([folder1, folder2]);

	root.showDetails();
}
main();
