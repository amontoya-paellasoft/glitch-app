import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MOCK_AGENTS, MOCK_CONVERSATIONS } from '../mock/mock-data';
import { AgentMockInterface } from '../models/agent-interface';
import { MessageInterface } from '../models/message-interface';
import { ConversationInterface } from '../models/conversation-interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly USER_ID = 'us';

  private conversacionesSubject = new BehaviorSubject<ConversationInterface[]>(
    MOCK_CONVERSATIONS.map((conv) => ({ ...conv, messages: [] })),
  );
  conversaciones$ = this.conversacionesSubject.asObservable();

  public mensajeActivo = signal<{ from: string; to: string } | null>(null);
  public agenteActId = computed(() => this.mensajeActivo()?.from ?? null);

  // MÉTODOS PARA SIMULATIONSERVICE

  setMensajeActivo(value: { from: string; to: string } | null): void {
    this.mensajeActivo.set(value);
  }

  emitirCambio(): void {
    this.conversacionesSubject.next([...this.conversacionesSubject.value]);
  }

  agregarMensajeAConversacion(mensaje: MessageInterface): void {
    const convs = this.conversacionesSubject.value;

    const convIdUsuario =
      mensaje.from === this.USER_ID && mensaje.visibility === 'private'
        ? this.resolverConvId(mensaje.to)
        : null;

    const actualizadas = convs.map((conv) => {
      let pertenece: boolean;

      if (conv.type === 'public') {
        pertenece = mensaje.visibility === 'public';
      } else if (convIdUsuario !== null) {
        pertenece = conv.id === convIdUsuario;
      } else {
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

  resolverConvId(agentId: string): string {
    const conv = this.conversacionesSubject.value.find(
      (c) => c.type === 'private' && c.participants.includes(agentId),
    );
    return conv?.id ?? 'general';
  }

  reiniciarEstado(): void {
    this.mensajeActivo.set(null);
    this.conversacionesSubject.next(MOCK_CONVERSATIONS.map((c) => ({ ...c, messages: [] })));
  }

  // GETTERS

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

  getMensajesDeAgente(agentId: string): MessageInterface[] {
    return this.conversacionesSubject.value
      .flatMap((c) => c.messages)
      .filter((m) => m.from === agentId)
      .sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
  }

  getAgentesRelacionados(agentId: string): { id: string; count: number; agente: AgentMockInterface | undefined }[] {
    const msgs = this.getMensajesPrivados(agentId);
    const contador: Record<string, number> = {};

    msgs.forEach((m) => {
      const otro = m.from === agentId ? m.to : m.from;
      if (otro && otro !== 'us') {
        contador[otro] = (contador[otro] ?? 0) + 1;
      }
    });

    return Object.entries(contador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => ({ id, count, agente: MOCK_AGENTS.find((a) => a.id === id) }));
  }
}
