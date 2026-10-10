/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { configManager } from "./singleton/config-manager.ts";

//estás importando la instancia que se creo en el propio archivo del singleton.
// como solo es un único lugar, en vez de exportar la clase, exportas al propia instancia inicializada

configManager.setConfig("apiURL", "http://localhost:3000");
configManager.setConfig("random", "0_0");

console.log(configManager.getAllConfig());
