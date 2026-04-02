import { Injectable, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MOCK_MESSAGES } from '../mock/mock-data';
import { MessageInterface } from '../models/message-interface';

@Injectable({ providedIn: 'root' })
export class ChatService {

  mensajes = signal<MessageInterface[]>([]);
  public agenteActId = signal<string | null>(null);

  private indiceActual = 0;
  private subs: Subscription[] = [];

  iniciarSimulacion(): void {
    this.enviarSiguienteMensaje();
  }

  private enviarSiguienteMensaje(): void {
    if (this.indiceActual >= MOCK_MESSAGES.length) return;

    const original = MOCK_MESSAGES[this.indiceActual];
    const mensaje: MessageInterface = { ...original, text: '' };

    this.mensajes.update(msgs => [...msgs, mensaje]);
    this.indiceActual++;
    this.agenteActId.set(original.agentId);

    this.escribirMensaje(mensaje, original.text, original.agentId, () => {
      setTimeout(
        () => this.enviarSiguienteMensaje(),
        this.obtenerDelayAgente(original.agentId)
      );
    });
  }

  private escribirMensaje(
    mensaje: MessageInterface,
    textoCompleto: string,
    agentId: string,
    callback: () => void
  ): void {
    const velocidad = this.obtenerVelocidad(agentId);

    const sub = interval(velocidad)
      .pipe(
        map(i => textoCompleto.substring(0, i + 1)),
        take(textoCompleto.length)
      )
      .subscribe({
        next: (texto) => {
          this.mensajes.update(msgs =>
            msgs.map(m =>
              m.id === mensaje.id
                ? { ...m, text: texto }
                : m
            )
          );
        },
        complete: () => {
          setTimeout(() => {
            this.agenteActId.set(null);
            callback();
          }, 500);
        }
      });

    this.subs.push(sub);
  }

  reiniciar(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
    this.indiceActual = 0;
    this.mensajes.set([]);
    this.agenteActId.set(null);
    this.iniciarSimulacion();
  }

  private obtenerVelocidad(agentId: string): number {
    const velocidades: Record<string, number> = {
      pm: 40,
      fe: 25,
      be: 30,
      qa: 20
    };
    return velocidades[agentId] ?? 30;
  }

  private obtenerDelayAgente(agentId: string): number {
    const delays: Record<string, number> = {
      pm: 1200,
      fe: 700,
      be: 900,
      qa: 600
    };
    return delays[agentId] ?? 1000;
  }
}
