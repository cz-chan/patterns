/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 * https://refactoring.guru/es/design-patterns/bridge
 */

import { COLORS } from "../helpers/colors.ts";

/*
este ejemplo es una extensión del .2 para tener un mayor poder a la hora de tener channels
ya que puedo recibir un array de channels y así no tener que duplicar código
*/

interface NotificationChannel {
	send(message: string): void;
}

class EmailChannel implements NotificationChannel {
	send(message: string): void {
		console.log(`Enviando correo electrónico: ${message}`);
	}
}

class SMSChannel implements NotificationChannel {
	send(message: string): void {
		console.log(`Enviando SMS: ${message}`);
	}
}

class PushNotificationChannel implements NotificationChannel {
	send(message: string): void {
		console.log(`Enviando Push: ${message}`);
	}
}

abstract class Notification {
	protected channels: NotificationChannel[];

	constructor(channels: NotificationChannel[]) {
		this.channels = channels;
	}

	abstract notify(message: string): void;
	abstract addChannel(channel: NotificationChannel): void;
}

class AlertNotify extends Notification {
	override notify(message: string): void {
		console.log("notificación de alerta");

		// notificas a toods los canales que tengas dentro del channels
		this.channels.forEach((channel) => channel.send(message));
	}
	override addChannel(channel: NotificationChannel): void {
		this.channels.push(channel);
	}
}

function main() {
	const channels = [new EmailChannel(), new SMSChannel()];

	const alert = new AlertNotify(channels);

	alert.notify("alguien ha entrado en la casa");
}
main();
