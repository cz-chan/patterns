import { COLORS } from "../../helpers/colors.ts";

export class LocalLogger {
	constructor(private file: string) {}

	writeLog(message: string): void {
		console.log(`[${this.file} log] ${message}`);
	}
	writeError(message: string): void {
		console.log(`[${this.file} error] ${message}`);
	}
	writeWarning(message: string): void {
		console.log(`[${this.file} warning] ${message}`);
	}
}
