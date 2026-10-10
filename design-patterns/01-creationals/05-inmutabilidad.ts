/**
 * ! Inmutabilidad con copia
 * Aunque la inmutabilidad es una buena práctica, no siempre es posible.
 * En estos casos, se puede hacer una copia del objeto y modificar la copia.
 *
 *  * Es útil para mantener un historial de estados en aplicaciones interactivas.
 *
 * Este es una variante del prototype
 */

/*
  el ejemplo que queremos hacer es un vscode y su manejo del estado en un proyecto.

  si yo estoy haciendo cambios y guardo, este cambio sería el codeEditorState y se mandaría
  al codeEditorHistory. cada vez que haya un cambio y un guardado, este se envia y se va 
  llenando el codeEditorState.

  lo que quireo poder hacer es además de guardar, cuando hagas command+z puedas volver 
  al estado anterior. es decir, moverte una posición hacia atrás en el estado del 
  codeEditorState y que ela posición en la que estabas antes, se borre porque esa es 
  tu nuava posición actual. deja de existir un futuro posible. tu presente = futuro
*/
class CodeEditorState {
	public readonly content: string;
	public readonly cursorPosition: number;
	public readonly unsavedChanges: boolean;

	constructor(
		content: string,
		cursorPosition: number,
		unsavedChanges: boolean,
	) {
		this.content = content;
		this.cursorPosition = cursorPosition;
		this.unsavedChanges = unsavedChanges;
	}

	copyWith({
		content,
		cursorPosition,
		unsavedChanges,
		// Partial dice que cualquier propiedad que venga en el codeEditorState puede ser opcional
	}: Partial<CodeEditorState>): CodeEditorState {
		return new CodeEditorState(
			content ?? this.content,
			cursorPosition ?? this.cursorPosition,
			unsavedChanges ?? this.unsavedChanges,
		);
	}

	displayState() {
		console.log(`editor state:
      content: ${this.content}
      cursor pos: ${this.cursorPosition}
      unsaved changes: ${this.unsavedChanges}  
      `);
	}
}

class CodeEditorHistory {
	private history: CodeEditorState[] = []; // parte de vacio mientras no guarde
	private currentIndex: number = -1; // es -1 porque el 0 es la posición 1, por lo que habría estado

	save(state: CodeEditorState): void {
		/*
    el if es para validar si estás o no en la última posición del index porque si 
    ha hecho un command+Z y está en una posición anterior y al guardar, esa versión
    última guardada se convierte en la fuente ultima de la verdad lo que lleva a 
    eliminar todo lo que haya después de la posición en la que está el index
    (es +1 porque array posición 1 es 0) por tanto, quieres quedarte con lo que hay
    desde la posición 0(inicio) hasta lo que hay en la posición dn la uqe te encuentras.
    */
		if (this.currentIndex < this.history.length - 1) {
			this.history = this.history.splice(0, this.currentIndex + 1);
		}
		this.history.push(state);
		this.currentIndex++;
	}

	// volver a hacer
	redo(): CodeEditorState | undefined {
		/*
      rehacer significa moverte hacia el futuro, es decir, moverte hacia la derecha en el hsitory
      por lo que si puedes hacerlo, es que hay un elemento como mínimo más.
      por eso esto es verdad: currenIndex < history.length - 1, al serlo, 
      incrementas el index en 1 y tu history pasa a ese este history en la posición index++

      en el caso de que no sea <, es que son iguales (no puede ser mayor) por lo que 
      no devuelve nada
    */
		if (this.currentIndex < this.history.length - 1) {
			this.currentIndex++;
			return this.history[this.currentIndex];
		}

		return undefined;
	}

	undo(): CodeEditorState | undefined {
		if (this.currentIndex <= 0) {
			return undefined;
		}
		this.currentIndex--;
		return this.history[this.currentIndex];
	}
}

function main() {
	const history = new CodeEditorHistory();
	let editorState = new CodeEditorState("console.log('hello world')", 2, false);
	history.save(editorState);
	console.log("initial state");
	editorState.displayState();

	editorState = editorState.copyWith({
		content: '\n const new = "hola mundo" \n console.log(new)',
		cursorPosition: 3,
		unsavedChanges: true,
	});
	history.save(editorState);
	editorState.displayState();

	editorState = editorState.copyWith({
		cursorPosition: 4,
	});
	history.save(editorState);
	editorState.displayState();

	console.log("post undo");
	editorState = history.undo()!;
	history.save(editorState);
	editorState.displayState();
}
main();
