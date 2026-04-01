import { Component, inject } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MOCK_AGENTS, MOCK_LINKS } from '../../mock/mock-data';
import { UpperCasePipe } from '@angular/common';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-agent-map',
  standalone: true,
  imports: [NgxGraphModule, UpperCasePipe],
  templateUrl: './agent-map.html',
  styleUrl: './agent-map.css',
})
export class AgentMap {
  ws: WorkspaceService = inject(WorkspaceService);
  chatServ: ChatService = inject(ChatService);

  nodes = MOCK_AGENTS.map((agent) => ({
    id: agent.id,
    label: agent.name,
    data: { role: agent.role, emoji: agent.emoji, status: agent.status },
  }));
  links = MOCK_LINKS;

  public layoutSettings = {
    orientation: 'TB',
    nodePadding: 60,
    rankPadding: 100,
    marginx: 90,
    marginy: 80,
  };

  onNodeClick(node: any) {
    this.ws.abrir({ agentId: node.id });
  }

  isLinkActive(link: any): boolean {
    const activo = this.chatServ.agenteActId();
    if (!activo) return false;
    return link.source === activo || link.target === activo;
  }
}
