// este va a ser el singleton

// no estoy exportando el singlenton sino la inicialización del mismo
class ConfigManager {
	private config: Record<string, string> = {};

	// con esta función vas creando el config
	public setConfig(key: string, value: string): void {
		this.config[key] = value;
	}

	public getConfig(key: string): string | null {
		if (this.config[key] === undefined) return null;

		return this.config[key];
	}

	public getAllConfig(): Record<string, string> {
		return { ...this.config };
		// devolvemos un clon así evitamos que se pueda modificar el config original
	}
}

export const configManager = new ConfigManager();

// el problema de esta forma de crear singletons es que a la hora de hacer tests, resulta complicado
// hacerlos ante un objeto que no está siendo exportado y se hacen test sobre aquello la instancia
