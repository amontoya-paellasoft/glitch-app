import { Component, inject } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkspaceService } from '../../services/workspace-service';

@Component({
  selector: 'app-floating-log-panel',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './floating-log-panel.html',
  styleUrl: './floating-log-panel.css',
})
export class FloatingLogPanel {
  ws = inject(WorkspaceService);
}
