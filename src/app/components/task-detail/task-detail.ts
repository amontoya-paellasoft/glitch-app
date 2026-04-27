import { Component, inject, Input, OnChanges, output, signal } from '@angular/core';
import { TaskDetailDTO } from '../../models/altorium/task-detail-dto';
import { MOCK_TASK_DETAIL } from '../../mock/mock-task-detail';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkspaceService } from '../../services/workspace-service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [UpperCasePipe, TranslatePipe, DatePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnChanges {
  @Input({ required: true }) taskId!: number;
  cerrar = output<void>();
  taskData = signal<TaskDetailDTO | null>(null);
  ws = inject(WorkspaceService);

  ngOnChanges(): void {
    // TODO: reemplazar por llamada al servicio cuando esté el endpoint
    this.taskData.set(MOCK_TASK_DETAIL);
  }

  abrirLog(tab: 'stdout' | 'stderr'): void {
    const data = this.taskData();
    if (!data) return;
    this.ws.abrirLogPanel(tab, data.latestBuildLog);
  }
}
