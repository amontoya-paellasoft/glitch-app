import { Component, inject, Input } from '@angular/core';
import { Chat } from '../chat/chat';
import { WorkspaceService } from '../../services/workspace-service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-floating-window',
  imports: [Chat, DragDropModule],
  standalone: true,
  template: `
  <div class="window-frame" cdkDrag>
      <div class="window-header" cdkDragHandle>
        <span class="title">TERMINAL :: {{ agentId }}</span>
        <button class="close-btn" (click)="ws.close(agentId)">✕</button>
      </div>
      <div class="window-content">
        <app-chat [agentId]="agentId"></app-chat>
      </div>
    </div>
  `,
  styleUrl: './floating-window.css',
})
export class FloatingWindow {
@Input() agentId!: string;
  ws : WorkspaceService = inject(WorkspaceService);

}
