/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 */

class DatabaseConnection {
	private static instance: DatabaseConnection;
	private connected: boolean = false; // por defecto es false por lo que en el constructor no va nada

	// Constructor privado para evitar instancias directas
	private constructor() {}

	// Método estático para obtener la instancia única
	public static getInstance(): DatabaseConnection {
		// sila instacia no existe, la creo
		if (!DatabaseConnection.instance) {
			/*
      no podría hacer un this.instance porque al ser estático
      tienes que hacer referencia a la propia propety estática
      */
			DatabaseConnection.instance = new DatabaseConnection();
		}

		// si existe, la devuelvo
		return DatabaseConnection.instance;
	}

	// Método para conectar a la base de datos
	public connect(): void {
		// Completar: si no está conectado, mostrar mensaje de conexión
		if (!this.connected) {
			this.connected = true;
		}
		this.connected;
		console.log("connection is open");
	}

	// Método para desconectar de la base de datos
	public disconnect(): void {
		// Completar: desconectar y mostrar mensaje de desconexión
		if (this.connected) {
			this.connected = false;
		}
		this.connected;
		console.log("connection is close");
	}

	public connectionState(): string {
		if (this.connected === true) {
			return "connection is open";
		} else {
			return "connection is close";
		}
	}
}

// Pruebas
function main() {
	const db1 = DatabaseConnection.getInstance();
	db1.connect(); // Debería conectar a la base de datos

	const db2 = DatabaseConnection.getInstance();
	db2.connect(); // Debería mostrar que ya existe una conexión activa
	console.log("state:", db2.connectionState());

	console.log("Son iguales:", db1 === db2); // Debería mostrar true porque es la misma instancia, son el mismo objeto en la misma posición en momoria

	db1.disconnect(); // Debería cerrar la conexión

	db2.connect(); // Ahora debería conectar de nuevo, ya que se cerró la anterior
	console.log("state:", db2.connectionState());
}

main();
