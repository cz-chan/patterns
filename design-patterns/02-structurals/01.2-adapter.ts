/**
 * ! Patrón Adapter
 *  Permite que objetos con interfaces incompatibles trabajen juntos, también es muy
 *  util para utilizar librerías de terceros en nuestra aplicación sin depender
 *  directamente de ellas.
 *
 * * Es útil cuando se quiere reutilizar una clase que no tiene la interfaz que
 * * necesitamos o cuando queremos crear una capa de abstracción para una librería
 * * de terceros.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { COLORS } from "../helpers/colors.ts";

// 1. Interfaz PaymentProcessor
interface PaymentProcessor {
	processPayment(amount: number): void;
}

// 2. Clases de Servicios de Pago Externos
// Estas clases simulan los servicios externos de PayPal, Stripe y MercadoPago

class PayPalService {
	sendPayment(amount: number): void {
		console.log(`Procesando pago de $${amount} con %cPayPal`, COLORS.blue);
	}
}

class StripeService {
	makeCharge(amount: number): void {
		console.log(`Procesando pago de $${amount} con %cStripe`, COLORS.purple);
	}
}

class MercadoPagoService {
	pay(amount: number): void {
		console.log(
			`Procesando pago de $${amount} con %cMercadoPago`,
			COLORS.yellow,
		);
	}
}

// 3. Clases Adaptadoras

// Adaptador para PayPal
class PayPalAdapter implements PaymentProcessor {
	// inicializo la clase paypal para usar su método correspondiente lo que yo quiero hacer pero
	// adaptándolo para mi app
	private paypal = new PayPalService();

	/*
  !de esta forma de arriba crearíamos la propia instancia dentro del adapter
  !teniendo problemas luego a la hora de querer hacer pruebas ya que tendrías
  !dependencias ocultas. Para evitarlo, puedes crearlo y llamarlo pero inicializarlo
  !solo cunado se vaya a usar.

  !así es como lo hago en los otros dos métodos
  */

	processPayment(amount: number): void {
		this.paypal.sendPayment(amount);
	}
}

// Adaptador para Stripe
class StripeAdapter implements PaymentProcessor {
	private stripe: StripeService; // no inicializo, solo nombro

	constructor(stripe: StripeService) {
		this.stripe = stripe;
	}

	processPayment(amount: number): void {
		this.stripe.makeCharge(amount);
	}
}

// Adaptador para MercadoPago
class MercadoPagoAdapter implements PaymentProcessor {
	private mercadoPago: MercadoPagoService;

	constructor(mercadoPago: MercadoPagoService) {
		this.mercadoPago = mercadoPago;
	}

	processPayment(amount: number): void {
		this.mercadoPago.pay(amount);
	}
}

// 4. Código Cliente para probar el Adapter

function main() {
	const paymentAmount = 100;

	// TODO: Agregar los adaptadores para los servicios de pago
	const paypalProcessor: PaymentProcessor = new PayPalAdapter();

	/*
  !por culpa de no inicializar necesito pasarle a los adaptadores que no 
  !tienen la dependencia oculta el propio servicio que les hace falta.

  !así, toda persona que venga desde fuera y llame a los adapters sabrá
  !que les hace falta dicha dependencia. de la otra manera, se queda oculta
  */
	const stripeProcessor: PaymentProcessor = new StripeAdapter(
		new StripeService(),
	);
	const mercadoPagoProcessor: PaymentProcessor = new MercadoPagoAdapter(
		new MercadoPagoService(),
	);

	// Procesar pagos con los diferentes servicios
	// Los 3 procesadores de pago trabajan exactamente igual después de adaptaros
	console.log("Usando PayPal:");
	paypalProcessor.processPayment(paymentAmount);

	console.log("\nUsando Stripe:");
	stripeProcessor.processPayment(paymentAmount);

	console.log("\nUsando MercadoPago:");
	mercadoPagoProcessor.processPayment(paymentAmount);
}

main();
