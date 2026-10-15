/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 */

import { COLORS } from "../helpers/colors.ts";

// 1. Interfaz NotificationChannel
// Define el método `send`, que cada canal de comunicación implementará.
interface NotificationChannel {
	send(message: string): void;
}

// 2. Implementaciones de Canales de Comunicación

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

// 3. Clase Abstracta Notification
// Define la propiedad `channel` y el método `notify`

abstract class Notification {
	/*
  esta clase permite usar las distintas push por lo que necesito crear
  un canal que será del tipo NotificationChannel porque es el tipo de 
  canal que implementan todos los tipos de notificaciones.

  símil: esta sería la casa (clase padre) donde todos los hijos han vivido
  en algún momento pero se han ido cada uno a un país distinto. Cada uno ha
  hecho su vida, tiene unos cargos y un trabajo concreto pero todos tienen
  sus habitaciones disponibles para cuando vuelvan a casa aunque sean entre
  ellos distintos
  */

	// creo una propiedad channnel de tipo protected que es de tipo NotificationChannel
	// sería como la estructura general de una habitación
	protected channel: NotificationChannel;

	// defines el constructor
	// cuando es navidad, todos los hijos necesitan tener la casa para quedarse ahí
	constructor(channel: NotificationChannel) {
		this.channel = channel;
	}

	// creas 2 métodos abstractos: notify y setChannel
	// serían como las estanterías y cajones: para que se queden, necesitas algo para que dejen sus cosas
	// y cada elemento tiene a su vez, X elementos en ellos.
	abstract notify(message: string): void;
	abstract setChannel(channel: NotificationChannel): void;
}

// 4. Clases Concretas de Notificaciones

class AlertNotification extends Notification {
	override notify(message: string): void {
		console.log("\n%cNotificación de Alerta:", COLORS.blue);
		this.channel.send(message);
	}
	override setChannel(channel: NotificationChannel): void {
		//! este es el error que he tenido, había hecho this.setChannel(channel)
		//! esto me lleva a tener un bucle infinito porque llamo dentro de un setChannel
		//! a this.setChannel(channel) que llama otra vez al setChannel() que llama al this.setChennel...
		this.channel = channel; // seteas el channel que manda
	}
}

class ReminderNotification extends Notification {
	// override proque cada uno modifica las estanterias y cajones como quieren para ajustarse a sus cosas
	override notify(message: string): void {
		console.log("\n%cNotificación de Recordatorio:", COLORS.blue);
		this.channel.send(message); // mandamos el mensaje
	}

	override setChannel(channel: NotificationChannel): void {
		this.channel = channel; // seteas el channel que manda
	}
}

class PushNotification extends Notification {
	override notify(message: string): void {
		console.log("\n%cNotificación de Push:", COLORS.green);
		this.channel.send(message);
	}

	override setChannel(channel: NotificationChannel): void {
		this.channel = channel; // seteas el channel que manda
	}
}

// 5. Código Cliente para Probar el Bridge

// Deben de implementar todo lo que haga falta en las clases anteriores
function main() {
	// Crear una notificación de alerta usando el canal de correo electrónico
	const alert = new AlertNotification(new EmailChannel());

	alert.notify("Alerta de seguridad: Se ha detectado un acceso no autorizado.");

	// Cambiar el canal a SMS y volver a enviar la alerta
	alert.setChannel(new SMSChannel());
	alert.notify("Alerta de seguridad: Se ha detectado un acceso no autorizado.");

	// Crear una notificación de recordatorio usando el canal de SMS
	const reminder = new ReminderNotification(new SMSChannel());
	reminder.notify(
		"Recordatorio: Tu cita con el médico es mañana a las 10:00 a.m.",
	);

	// Cambiar el canal de recordatorio a correo electrónico y enviar nuevamente
	reminder.setChannel(new PushNotificationChannel());
	reminder.notify(
		"Recordatorio: Tu cita con el médico es mañana a las 10:00 a.m.",
	);

	// Crear una notificación de push usando el canal de notificación push
	const push = new PushNotification(new PushNotificationChannel());
	push.notify("Nueva actualización disponible. Haz clic para instalar.");
}

main();
