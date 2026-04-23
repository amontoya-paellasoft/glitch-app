import { Component, Input, OnChanges, output, signal } from '@angular/core';
import { TaskDetailDTO } from '../../models/altorium/task-detail-dto';
import { MOCK_TASK_DETAIL } from '../../mock/mock-task-detail';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnChanges {
  @Input({ required: true }) taskId!: number;
  cerrar = output<void>();
  taskData = signal<TaskDetailDTO | null>(null);

  ngOnChanges(): void {
    // TODO: reemplazar por llamada al servicio cuando esté el endpoint
    this.taskData.set(MOCK_TASK_DETAIL);
  }
}
