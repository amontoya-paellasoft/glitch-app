import { Component, OnInit, signal } from '@angular/core';
import { TaskDetailDTO } from '../../models/altorium/task-detail-dto';
import { MOCK_TASK_DETAIL } from '../../mock/mock-task-detail';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  data = signal<TaskDetailDTO | null>(null);

  ngOnInit(): void {
    // TODO: reemplazar por llamada al servicio cuando esté el endpoint
    this.data.set(MOCK_TASK_DETAIL);
  }
}
