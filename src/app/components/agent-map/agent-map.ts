import { Component, computed, inject } from '@angular/core';
import { MOCK_AGENTS, MOCK_LINKS } from '../../mock/mock-data';
import { UpperCasePipe, LowerCasePipe } from '@angular/common';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';
import { NodePosition } from '../../models/conversation-interface';

@Component({
  selector: 'app-agent-map',
  standalone: true,
  imports: [UpperCasePipe, LowerCasePipe],
  templateUrl: './agent-map.html',
  styleUrl: './agent-map.css',
})
export class AgentMap {
  ws: WorkspaceService = inject(WorkspaceService);
  chatServ: ChatService = inject(ChatService);

  mensajeActivo = computed(() => this.chatServ.mensajeActivo());
  hayMensajeActivo = computed(() => this.mensajeActivo() !== null);
  enviarMsgsAll = computed(() => {
    const msg = this.mensajeActivo();
    if (!msg || msg.to !== 'all') return [];
    // Todos los nodos excepto el emisor
    return this.nodes.filter((n) => n.id !== msg.from).map((n) => n.id);
  });

  // Posiciones en el SVG
  // PM centro, resto en órbita
  readonly NODE_W = 160;
  readonly NODE_H = 56;

  nodes: NodePosition[] = MOCK_AGENTS.map((agent) => {
    const positions: Record<string, { x: number; y: number }> = {
      pm: { x: 260, y: 232 }, // centro
      di: { x: 260, y: 60 }, // arriba
      fe: { x: 60, y: 232 }, // izquierda
      be: { x: 460, y: 232 }, // derecha
      qa: { x: 260, y: 404 }, // abajo
    };
    return {
      id: agent.id,
      label: agent.name,
      x: positions[agent.id].x,
      y: positions[agent.id].y,
      data: { role: agent.role, emoji: agent.emoji, status: agent.status },
    };
  });

  links = MOCK_LINKS;

  // Centro de un nodo
  cx(node: NodePosition): number {
    return node.x + this.NODE_W / 2;
  }
  cy(node: NodePosition): number {
    return node.y + this.NODE_H / 2;
  }

  getNode(id: string): NodePosition | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  // Path curvo entre dos nodos
  getLinkPath(sourceId: string, targetId: string): string {
    const s = this.getNode(sourceId);
    const t = this.getNode(targetId);
    if (!s || !t) return '';

    const x1 = this.cx(s),
      y1 = this.cy(s);
    const x2 = this.cx(t),
      y2 = this.cy(t);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Curva suave con punto de control desplazado
    const dx = -(y2 - y1) * 0.2;
    const dy = (x2 - x1) * 0.2;

    return `M ${x1} ${y1} Q ${mx + dx} ${my + dy} ${x2} ${y2}`;
  }

  // Dirección del chevron según el mensaje activo
  getLinkDirection(sourceId: string, targetId: string): 'forward' | 'backward' | 'idle' {
    const msg = this.mensajeActivo();
    if (!msg || msg.to === 'all') return 'idle';
    if (msg.from === sourceId && msg.to === targetId) return 'forward';
    if (msg.from === targetId && msg.to === sourceId) return 'backward';
    return 'idle';
  }

  isLinkActive(sourceId: string, targetId: string): boolean {
    const msg = this.mensajeActivo();
    if (!msg) return false;
    if (msg.to === 'all') return msg.from === sourceId;
    return (
      (msg.from === sourceId && msg.to === targetId) ||
      (msg.from === targetId && msg.to === sourceId)
    );
  }

  isNodeSpeaking(nodeId: string): boolean {
    return this.mensajeActivo()?.from === nodeId;
  }

  isNodeListening(nodeId: string): boolean {
    const msg = this.mensajeActivo();
    if (!msg || msg.to === 'all') return false;
    return msg.to === nodeId;
  }

  // Targets del broadcast
  broadcastTargets = computed(() => {
    const msg = this.mensajeActivo();
    if (!msg || msg.to !== 'all') return [];
    return this.nodes.filter((n) => n.id !== msg.from);
  });

  onNodeClick(node: NodePosition): void {
    this.ws.abrir({ agentId: node.id });
  }
}
