import { Component, inject, OnInit } from '@angular/core';
import { AgentMap } from '../agent-map/agent-map';
import { ControlPanel } from '../control-panel/control-panel';
import { FloatingWindow } from '../floating-window/floating-window';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgentMap, ControlPanel, FloatingWindow],
  template: `
    <div class="main-content">
      <app-agent-map />
    </div>
    <app-control-panel />

    @for (agentId of ws.ventanasAbiertas(); track agentId) {
      <app-floating-window [agentId]="agentId" />
    }
  `,
  styles: [`
    .main-content {
      overflow: hidden;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  `]
})
export class DashboardComponent implements OnInit {
  public ws: WorkspaceService = inject(WorkspaceService);
  public chatServ: ChatService = inject(ChatService);

  ngOnInit() {
    this.chatServ.iniciarSimulacion();
    this.ws.abrir({ agentId: '' });
  }
}
