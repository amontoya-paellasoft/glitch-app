import { Component, inject } from '@angular/core';
import { WorkspaceService } from '../../services/workspace-service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  template: `<div class="panel">
    <span class="panel-title">PANEL DE CONTROL</span>
    <button class="btn-action" (click)="ws.reiniciar()">[ REINICIAR ]</button>
    <button class="btn-kill" (click)="ws.cerrarTodas()">[ CERRAR VENTANAS ]</button>
  </div>`,
  styleUrl: './control-panel.css'
})
export class ControlPanel {
  ws: WorkspaceService = inject(WorkspaceService);

}
