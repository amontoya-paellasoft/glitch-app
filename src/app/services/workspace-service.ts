import { inject, Injectable, signal } from '@angular/core';
import { ChatService } from './chat-service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  public chatServ: ChatService = inject(ChatService);
  public ventanasAbiertas = signal<string[]>([]);

  abrir({ agentId }: { agentId: string }) {
    if (!this.ventanasAbiertas().includes(agentId)) {
      this.ventanasAbiertas.update((ids) => [...ids, agentId]);
    }
  }

  cerrar(agentId: string) {
    this.ventanasAbiertas.update((ids) => ids.filter((id) => id !== agentId));
  }

  focus(agentId: string) {
    this.ventanasAbiertas.update((ids) => {
      // 1. Quitamos el ID de donde esté
      const filtrados = ids.filter((id) => id !== agentId);
      // 2. Lo volvemos a meter al final
      return [...filtrados, agentId];
    });
  }

  cerrarTodas() {
    this.ventanasAbiertas.set([]);
  }

  reiniciar(): void {
    this.chatServ.reiniciar();
    this.abrir({agentId: ''});
  }
}
