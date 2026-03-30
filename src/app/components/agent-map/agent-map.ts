import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-map',
  standalone: true,
  template: `<div class="panel">Mapa de agentes</div>`,
  imports: [],
  styles: [`
    .panel {
      border-right: 0.5px solid var(--border);
      background: var(--surface2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text3);
      font-size: 13px;
    }
  `]
})
export class AgentMap {}
