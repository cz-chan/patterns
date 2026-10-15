import { Logger } from "jsr:@deno-library/logger"; // da error siempre porque no está implementado

// const logger = new Logger();

// logger.info();
// logger.warn();
// logger.error();

/*
este logger de deno (no está intalado pero imagínatelo) tiene interfaces distintas
a las que tu has construido en local-loger.ts aquí usa info, warn y error y en el
otro writeLog, writeError, writeWarning.

Por lo que ambas son incompatibles, no son la misma dirección.

Para solventarlo y usar en nuestra app los que tenemos de (writeLog...) 
está el patron adapter porque creamos el adaptador que "traduce" de una libreria
a tu código para que el día de mañada, si deno desaparece (sí, desaparece al comprarlo
Cloudflare) tendrías que usar otra librería de log y sólo tendrías que modificar 
el archivo de traducción de deno a tu código y no tu código completo
*/

/*
creo una interfaz (puede ser una clase abstracta) que satisdace aquello que me 
hace falta en mi app. Es decir, satisface mi función/clase de crear logs
*/

interface ILoggerAdapter {
	file: string;

	writeLog: (message: string) => void;
	writeError: (message: string) => void;
	writeWarning: (message: string) => void;
}

export class DenoLoggerAdapter implements ILoggerAdapter {
	public file: string;
	private logger = new Logger(); // esto es lo que viene de deno o la librería x

	constructor(file: string) {
		this.file = file;
	}

	writeLog(message: string) {
		this.logger.info(`[${this.file} log] ${message}`);
	}

	writeWarning(message: string) {
		this.logger.warn(`[${this.file} warning] ${message}`);
	}

	writeError(message: string) {
		this.logger.error(`[${this.file} error] ${message}`);
	}
}
