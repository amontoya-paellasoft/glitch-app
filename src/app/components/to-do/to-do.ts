import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo-service';
import { TareaService } from '../../services/tarea-service';
import { Task, Column } from '../../models/to-do-interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Busqueda } from '../busqueda/busqueda';

import { TarjetasToDo } from '../tarjetas-to-do/tarjetas-to-do';
import { TaskDetail } from '../task-detail/task-detail';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslateModule, DragDropModule, Busqueda, TarjetasToDo, TaskDetail],
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.css']
})
export class TodoComponent implements OnInit {
  public todoService = inject(TodoService);
  private tareaService = inject(TareaService);
  private translate = inject(TranslateService);
  
  get columns() {
    return this.todoService.filteredColumns();
  }
  showForm = false;
  selectedTaskId: number | null = null;
  detailTaskId: number | null = null;
  taskForm = (this.todoService as any).getTaskForm ? (this.todoService as any).getTaskForm() : null;

  ngOnInit() {}

  selectTask(taskId: number) {
    this.selectedTaskId = taskId;
  }

  viewTaskDetails(task: any) {
    this.detailTaskId = task.taskId ?? null;
  }

  closeTaskDetails() {
    this.detailTaskId = null;
  }

  addTask() {
    if (this.taskForm.valid) {
      this.todoService.addTask(this.taskForm.value);
      this.taskForm.reset({ priority: 'Medium' });
      this.showForm = false;
    }
  }

  moveTask(taskId: number, direction: 'prev' | 'next') {
    this.todoService.moveTask(taskId, direction);
    this.selectedTaskId = taskId;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if ((this.todoService as any).drop) {
      (this.todoService as any).drop(event);
    }
  }

  getNombreUsuario(userId: number | undefined): string {
    if (userId === undefined || userId === 0) {
      return this.translate.instant('TODO.DETAIL_PANEL.VALUES.SYSTEM');
    }
    const usuario = this.tareaService._usuariosCache().find(u => u.id === userId);
    return usuario ? `${usuario.firstName} ${usuario.lastName}` : `Usuario ${userId}`;
  }

  getNombreCompania(companyId: number): string {
    if (companyId === 81) return 'Altorium Corp';
    if (companyId === 0) return 'N/A';
    return `Compañía ${companyId}`;
  }

  getNombreTareaRelacionada(relatedTaskId: number | null): string {
    if (!relatedTaskId) {
      return this.translate.instant('TODO.DETAIL_PANEL.VALUES.NONE');
    }
    
    for (const col of this.todoService.getColumns()) {
      const task = col.tasks.find(t => (t as Task).taskId === relatedTaskId);
      if (task) return (task as Task).title;
    }
    
    return `#${relatedTaskId}`;
  }

  getPriority(item: any): string {
    return item.priority || 'Medium';
  }

  getTranslatedPriority(priority: string): string {
    return this.translate.instant('TODO.PRIORITIES.' + priority);
  }

  getTranslatedColumn(state: string): string {
    return this.translate.instant('TODO.COLUMNS.' + state.toLowerCase());
  }

  getAsignadaA(item: any): number | undefined {
    return item.asignadaA || item.assignedUserId;
  }


}
