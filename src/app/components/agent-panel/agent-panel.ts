import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';
import { TareaService } from '../../services/tarea-service';
import { TareaInterface } from '../../models/tarea-interface';
import { MOCK_AGENTS, MOCK_USERS } from '../../mock/mock-data';
import { UpperCasePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Chat } from '../chat/chat';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agent-panel',
  standalone: true,
  imports: [UpperCasePipe, DragDropModule, Chat, TranslatePipe, RouterLink],
  templateUrl: './agent-panel.html',
  styleUrl: './agent-panel.css',
})
export class AgentPanel implements OnInit {
  agentId = input.required<string>();

  private chatServ = inject(ChatService);
  private tareaServ = inject(TareaService);
  private destroyRef = inject(DestroyRef);
  ws: WorkspaceService = inject(WorkspaceService);

  agente        = computed(() => MOCK_AGENTS.find((a) => a.id === this.agentId()));
  usuarioReal   = computed(() => MOCK_USERS.find((u) => u.userId === this.agente()?.userId) ?? null);
  agentesRelacionados = computed(() => this.chatServ.getAgentesRelacionados(this.agentId()));

  tareas = signal<TareaInterface[]>([]);

  ngOnInit(): void {
    const agente = this.agente();
    if (!agente) return;

    this.tareaServ.getTareasByAgenteMock(agente.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tareas => this.tareas.set(tareas));
  }

  getColorEstado(estado: TareaInterface['estado']): string {
    const colores: Record<TareaInterface['estado'], string> = {
      'pendiente':   '#976013',
      'en_progreso': '#1a6eb3',
      'acabada':     '#1a9b4b',
      'descartada':  '#888888',
    };
    return colores[estado];
  }

  cerrar(): void {
    this.ws.cerrarPanel();
  }

  getSlugAgente(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }
}
