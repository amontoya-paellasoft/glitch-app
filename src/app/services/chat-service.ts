import { computed, inject, Injectable, NgZone, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_REACCIONES_PUBLICAS,
  MOCK_USER_REACCIONES,
} from '../mock/mock-data';
import { MessageInterface } from '../models/message-interface';
import { ConversationInterface } from '../models/conversation-interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private ngZone: NgZone = inject(NgZone);

  // Estado interno

  private simulacionPausada = false;
  private contadorInsistencia: Record<string, number> = {};
  private conversacionesSubject = new BehaviorSubject<ConversationInterface[]>(
    MOCK_CONVERSATIONS.map((conv) => ({ ...conv, messages: [] })),
  );
  conversaciones$ = this.conversacionesSubject.asObservable();

  public mensajeActivo = signal<{ from: string; to: string } | null>(null);
  public agenteActId = computed(() => this.mensajeActivo()?.from ?? null);

  // Índice del próximo mensaje mock a enviar
  private indiceActual = 0;

  private mensajesOrdenados = [...MOCK_MESSAGES].sort(
    (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime(),
  );

  private readonly USER_ID = 'us';

  // MÉTODOS

  enviarMensajeUsuario(text: string, contexto: string): void {
    this.simulacionPausada = true;

    const esPrivado = contexto !== 'general';

    const convId = esPrivado ? this.resolverConvId(contexto) : 'general';

    const msgUsuario: MessageInterface = {
      id: Date.now(),
      from: this.USER_ID,
      to: esPrivado ? contexto : 'all',
      visibility: esPrivado ? 'private' : 'public',
      text,
      timeStamp: new Date(),
    };
    this.mensajeActivo.set({ from: this.USER_ID, to: esPrivado ? contexto : 'all' });
    this.agregarMensajeAConversacion(msgUsuario);

    if (esPrivado) {
      this.reaccionarEnPrivado(convId);
      setTimeout(() => {
        this.mensajeActivo.set(null);
        this.simulacionPausada = false;
        this.enviarSiguienteMensaje();
      }, 4000);
    } else {
      this.reaccionarEnPublico();
      setTimeout(() => {
        this.mensajeActivo.set(null);
        this.simulacionPausada = false;
        this.enviarSiguienteMensaje();
      }, 3500);
    }
  }

  // Dado un agentId, encuentra la conversación privada donde participa

  private resolverConvId(agentId: string): string {
    const conv = this.conversacionesSubject.value.find(
      (c) => c.type === 'private' && c.participants.includes(agentId),
    );
    return conv?.id ?? 'general';
  }

  // Reacción cuando el usuario irrumpe en un canal privado
  private reaccionarEnPrivado(convId: string): void {
    const reacciones = MOCK_USER_REACCIONES[convId];
    if (!reacciones) return;

    const conv = this.getConversacion(convId);
    if (!conv) return;

    const [agente1, agente2] = conv.participants;
    const veces = this.contadorInsistencia[convId] ?? 0;

    if (veces === 0) {
      const txt1 = reacciones.agente1[0];
      const txt2 = reacciones.agente2[0];
      // Agente1 reacciona a los 800ms
      setTimeout(() => this.inyectarMensaje(agente1, agente2, txt1, 'private', convId), 800);
      // Agente2 responde a los 2400ms  da tiempo al teletipo de agente1
      setTimeout(() => this.inyectarMensaje(agente2, agente1, txt2, 'private', convId), 2400);
    } else {
      // Insistencia  coge el mensaje según cuántas veces lleva el usuario
      // Si se acaba el pool, repite el último
      const pool = reacciones.insistencia;
      const idx = Math.min(veces - 1, pool.length - 1);
      setTimeout(() => this.inyectarMensaje(agente1, agente2, pool[idx], 'private', convId), 800);
    }

    this.contadorInsistencia[convId] = veces + 1;
  }

  // Reacción cuando el usuario escribe en el canal general
  private reaccionarEnPublico(): void {
    const agentes = Object.keys(MOCK_REACCIONES_PUBLICAS);
    const agente = agentes[Math.floor(Math.random() * agentes.length)];
    const pool = MOCK_REACCIONES_PUBLICAS[agente];
    const txt = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => this.inyectarMensaje(agente, 'all', txt, 'public', 'general'), 800);
  }

  // Crea un mensaje vacío, lo añade al stream, y lo rellena
  private inyectarMensaje(
    from: string,
    to: string,
    text: string,
    visibility: 'public' | 'private',
    convId: string,
  ): void {
    const mensaje: MessageInterface = {
      id: Date.now() + Math.random(),
      from,
      to,
      visibility,
      text: '',
      timeStamp: new Date(),
    };

    this.agregarMensajeAConversacion(mensaje);
    this.mensajeActivo.set({ from, to });
    this.ngZone.run(() => {
      interval(35)
        .pipe(
          map((i) => text.substring(0, i + 1)),
          take(text.length),
        )
        .subscribe({
          next: (t) => {
            mensaje.text = t;
            this.conversacionesSubject.next([...this.conversacionesSubject.value]);
          },
          complete: () => {
            setTimeout(() => this.mensajeActivo.set(null), 500);
          },
        });
    });
  }

  // Métodos públicos
  getConversacion(id: string): ConversationInterface | undefined {
    return this.conversacionesSubject.value.find((c) => c.id === id);
  }

  getConversacionesDeAgente(agentId: string): ConversationInterface[] {
    return this.conversacionesSubject.value.filter((c) => c.participants.includes(agentId));
  }

  getMensajesPublicos(): MessageInterface[] {
    return this.getConversacion('general')?.messages ?? [];
  }

  getMensajesPrivados(agentId: string): MessageInterface[] {
    return this.conversacionesSubject.value
      .filter((c) => c.type === 'private' && c.participants.includes(agentId))
      .flatMap((c) => c.messages);
  }

  // Simulación automática

  iniciarSimulacion(): void {
    this.enviarSiguienteMensaje();
  }

  // Se detiene si la simulación está pausada o si se acabaron los mensajes
  private enviarSiguienteMensaje(): void {
    if (this.simulacionPausada) return;
    if (this.indiceActual >= this.mensajesOrdenados.length) return;

    const original = this.mensajesOrdenados[this.indiceActual];
    const mensaje: MessageInterface = { ...original, text: '' };

    this.agregarMensajeAConversacion(mensaje);
    this.indiceActual++;
    this.mensajeActivo.set({ from: original.from, to: original.to });
    this.escribirMensaje(mensaje, original.text, original.from, () => {
      // Cuando termina el teletipo, esperamos el delay del agente y enviamos el siguiente
      setTimeout(() => this.enviarSiguienteMensaje(), this.obtenerDelay(original.from));
    });
  }

  // Añade un mensaje a la conversación correcta
  private agregarMensajeAConversacion(mensaje: MessageInterface): void {
    const convs = this.conversacionesSubject.value;

    // Para mensajes privados del usuario, encontramos la conv exacta
    const convIdUsuario =
      mensaje.from === this.USER_ID && mensaje.visibility === 'private'
        ? this.resolverConvId(mensaje.to)
        : null;

    const actualizadas = convs.map((conv) => {
      let pertenece: boolean;

      if (conv.type === 'public') {
        // Mensajes públicos
        pertenece = mensaje.visibility === 'public';
      } else if (convIdUsuario !== null) {
        // Mensaje privado del usuario
        pertenece = conv.id === convIdUsuario;
      } else {
        // Mensaje privado entre agentes
        pertenece =
          mensaje.visibility === 'private' &&
          conv.participants.includes(mensaje.from) &&
          conv.participants.includes(mensaje.to);
      }

      if (!pertenece) return conv;

      const yaExiste = conv.messages.some((m) => m.id === mensaje.id);
      if (yaExiste) return conv;

      return { ...conv, messages: [...conv.messages, mensaje] };
    });

    this.conversacionesSubject.next(actualizadas);
  }

  // Teletipo: escribe char a char
  private escribirMensaje(
    mensaje: MessageInterface,
    textoCompleto: string,
    agentId: string,
    callback: () => void,
  ): void {
    this.ngZone.run(() => {
      interval(this.obtenerVelocidad(agentId))
        .pipe(
          map((i) => textoCompleto.substring(0, i + 1)),
          take(textoCompleto.length),
        )
        .subscribe({
          next: (texto) => {
            mensaje.text = texto;
            this.conversacionesSubject.next([...this.conversacionesSubject.value]);
          },
          complete: () => {
            setTimeout(() => {
              this.mensajeActivo.set(null);
              callback();
            }, 500);
          },
        });
    });
  }

  reiniciar(): void {
    this.indiceActual = 0;
    this.mensajeActivo.set(null);
    this.contadorInsistencia = {};
    this.simulacionPausada = false;
    this.conversacionesSubject.next(MOCK_CONVERSATIONS.map((c) => ({ ...c, messages: [] })));
    this.iniciarSimulacion();
  }

  private obtenerVelocidad(agentId: string): number {
    const v: Record<string, number> = { pm: 40, fe: 25, be: 30, qa: 20, di: 35 };
    return v[agentId] ?? 30;
  }

  private obtenerDelay(agentId: string): number {
    const d: Record<string, number> = { pm: 1200, fe: 700, be: 900, qa: 600, di: 800 };
    return d[agentId] ?? 1000;
  }
}
