import { Component, computed, inject, input, OnInit } from '@angular/core';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';
import { TareaService } from '../../services/tarea-service';
import { TareaInterface } from '../../models/tarea-interface';
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
  ws = inject(WorkspaceService);

  agente = computed(() => MOCK_AGENTS.find((a) => a.id === this.agentId()));
  agentesRelacionados = computed(() => this.chatServ.getAgentesRelacionados(this.agentId()));

  tareas: TareaInterface[] = [];

  ngOnInit(): void {
    // Nos suscribimos al Observable del servicio
    this.tareaServ.getTareasByAgente(this.agentId()).subscribe(t => {
      this.tareas = t;
    });
  }

  // Helpers para el template
  getColorEstado(estado: TareaInterface['estado']): string {
    const colores: Record<TareaInterface['estado'], string> = {
      'pendiente':   '#976013',
      'en_progreso': '#4A8A47',
      'acabada':     '#1a6eb3',
      'descartada':  '#58574f',
    };
    return colores[estado];
  }

  cerrar(): void {
    this.ws.cerrarPanel();
  }
}
