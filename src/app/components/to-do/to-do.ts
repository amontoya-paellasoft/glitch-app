import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';
import { TareaService } from '../../services/tarea-service';
import { Task, MiseEnPlaceItem, Column } from '../../models/to-do-interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Busqueda } from '../busqueda/busqueda';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, DragDropModule, Busqueda],
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.css']
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  private tareaService = inject(TareaService);
  private translate = inject(TranslateService);
  
  columns = this.todoService.getColumns();
  showForm = false;
  selectedTaskId: number | null = null;
  selectedTaskDetail: any = null;
  taskForm = (this.todoService as any).getTaskForm ? (this.todoService as any).getTaskForm() : null;

  ngOnInit() {}

  selectTask(taskId: number) {
    this.selectedTaskId = taskId;
  }

  viewTaskDetails(task: any) {
    this.selectedTaskDetail = task;
  }

  closeTaskDetails() {
    this.selectedTaskDetail = null;
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

  isTask(item: any): item is Task {
    return (item as Task).taskId !== undefined && (item as any).itemType === undefined;
  }

  asMiseEnPlace(item: any): MiseEnPlaceItem {
    return item as MiseEnPlaceItem;
  }

  asTask(item: any): Task {
    return item as Task;
  }
}
