import { inject, Injectable, NgZone, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MOCK_MESSAGES } from '../mock/mock-data';
import { MessageInterface } from '../models/message-interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private ngZone: NgZone = inject(NgZone);

  // Mensajes BehaviorSubject
  private mensajesSubject = new BehaviorSubject<MessageInterface[]>([]);
  mensajes$ = this.mensajesSubject.asObservable();

  // Para conectar con el mapa de agentes
  public agenteActId = signal<string | null>(null);

  private indiceActual = 0;

  iniciarSimulacion() {
    this.enviarSiguienteMensaje();
  }

  private enviarSiguienteMensaje() {
    if (this.indiceActual >= MOCK_MESSAGES.length) return;

    const original = MOCK_MESSAGES[this.indiceActual];

    const mensaje: any = {
      ...original,
      text: '',
    };

    const mensajesActuales = this.mensajesSubject.value;

    this.mensajesSubject.next([...mensajesActuales, mensaje]);

    this.indiceActual++;

    this.escribirMensaje(mensaje, original.text, original.agentId, () => {
      const delay = this.obtenerDelayAgente(original.agentId);
      setTimeout(() => this.enviarSiguienteMensaje(), delay);
    });
  }

  private escribirMensaje(
    mensaje: MessageInterface,
    textoCompleto: string,
    agentId: string,
    callback: () => void,
  ) {
    let i = 0;
    const velocidad = this.obtenerVelocidad(agentId);

    // FLUJO DATOS: Encendemos el brillo del nodo al empezar
    this.agenteActId.set(agentId);

    const escribir = () => {
      // Ejecutamos el intervalo FUERA de Angular
      this.ngZone.runOutsideAngular(() => {
        const intervalo = setInterval(() => {
          mensaje.text += textoCompleto[i];
          i++;

          // Solo entramos en Angular para actualizar la UI
          this.ngZone.run(() => {
            this.mensajesSubject.next([...this.mensajesSubject.value]);
          });

          // simulamos pausas
          if (['.', ',', ':'].includes(textoCompleto[i])) {
            clearInterval(intervalo);

            setTimeout(() => {
              escribir();
            }, 200);

            return;
          }

          if (i >= textoCompleto.length) {
            clearInterval(intervalo);
            setTimeout(() => {
              this.ngZone.run(() => this.agenteActId.set(null));
            }, 500);
            callback();
          }
        }, velocidad);
      });
    };

    escribir();
  }

  private obtenerVelocidad(agentId: string) {
    switch (agentId) {
      case 'pm':
        return 40;
      case 'fe':
        return 25;
      case 'be':
        return 30;
      case 'qa':
        return 20;
      default:
        return 30;
    }
  }

  private obtenerDelayAgente(agentId: string) {
    switch (agentId) {
      case 'pm':
        return 1200;
      case 'fe':
        return 700;
      case 'be':
        return 900;
      case 'qa':
        return 600;
      default:
        return 1000;
    }
  }

  reiniciar(): void {
  this.indiceActual = 0;
  this.mensajesSubject.next([]);
  this.agenteActId.set(null);
  this.iniciarSimulacion();
}
}
