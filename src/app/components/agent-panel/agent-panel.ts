import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';
import { TareaService } from '../../services/tarea-service';
import { TaskInterface } from '../../models/task-dummy-interface';
import { User } from '../../models/agent-interface';
import { MOCK_AGENTS } from '../../mock/mock-data';
import { UpperCasePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Chat } from '../chat/chat';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

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
  ws = inject(WorkspaceService);

  agente = computed(() => MOCK_AGENTS.find((a) => a.id === this.agentId()));
  agentesRelacionados = computed(() => this.chatServ.getAgentesRelacionados(this.agentId()));

  usuarioDummy = signal<User | null>(null);
  tareas = signal<TaskInterface[]>([]);

  ngOnInit(): void {
    const agente = this.agente();
    if (!agente) return;

    forkJoin([
      this.tareaServ.getAgenteAPIPorId(agente.dummyUserId),
      this.tareaServ.getTareasApiByAgente(agente.dummyUserId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([usuario, tareas]) => {
        this.usuarioDummy.set(usuario);
        this.tareas.set(tareas);
      });
  }

  getColorEstado(estado: TaskInterface['estado']): string {
    const colores: Record<TaskInterface['estado'], string> = {
      'pendiente':   '#976013',
      'completada':  '#1a6eb3',
    };
    return colores[estado];
  }

  cerrar(): void {
    this.ws.cerrarPanel();
  }

  getSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }
}
