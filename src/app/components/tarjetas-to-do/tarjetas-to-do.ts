import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToDoTask, MiseEnPlaceItem } from '../../models/to-do-interface';
import { TareaService } from '../../services/tarea-service';

@Component({
  selector: 'app-tarjetas-to-do',
  standalone: true,
  imports: [CommonModule, DragDropModule, TranslateModule],
  templateUrl: './tarjetas-to-do.html',
  styleUrl: './tarjetas-to-do.css',
})
export class TarjetasToDo {
  private translate = inject(TranslateService);
  private tareaService = inject(TareaService);

  @Input({ required: true }) task!: ToDoTask | MiseEnPlaceItem;
  @Input({ required: true }) colIndex!: number;
  @Input() columnId: string = '';
  @Input() selectedTaskId: number | null = null;
  @Input() columnIsMiseEnPlace: boolean = false;

  public isCollapsed = false;

  @Output() onSelect = new EventEmitter<number>();
  @Output() onViewDetails = new EventEmitter<any>();
  @Output() onMove = new EventEmitter<{ taskId: number, direction: 'prev' | 'next' }>();

  toggleCollapse(event: Event) {
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  selectTask(taskId: number) {
    this.onSelect.emit(taskId);
  }

  viewTaskDetails(task: any) {
    this.onViewDetails.emit(task);
  }

  moveTask(taskId: number, direction: 'prev' | 'next') {
    this.onMove.emit({ taskId, direction });
  }

  getPriority(item: any): string {
    return item.priority || 'Medium';
  }

  getTranslatedPriority(priority: string): string {
    return this.translate.instant('TODO.PRIORITIES.' + priority);
  }

  getNombreUsuario(userId: number | undefined): string {
    if (userId === undefined || userId === 0) {
      return this.translate.instant('TODO.DETAIL_PANEL.VALUES.SYSTEM');
    }
    const usuario = this.tareaService._usuariosCache().find(u => u.userId === userId);
    return usuario ? usuario.fullName : `Usuario ${userId}`;
  }

  getAsignadaA(item: any): number | undefined {
    return item.asignadaA || item.assignedUserId;
  }

  asMiseEnPlace(item: ToDoTask | MiseEnPlaceItem): MiseEnPlaceItem {
    return item as MiseEnPlaceItem;
  }

  asTask(item: ToDoTask | MiseEnPlaceItem): ToDoTask {
    return item as ToDoTask;
  }

  getFormattedEstimation(task: ToDoTask): string {
    if (!task.estimatedPrice && !task.estimatedMinutes) return 'N/A';
    const hours = task.estimatedMinutes ? (task.estimatedMinutes / 60).toFixed(1) : '0';
    return `€${task.estimatedPrice || 0} / ${hours}h`;
  }

  getApprovalLabel(status: string | undefined): string {
    const key = status || 'NONE';
    return this.translate.instant('TODO.CARD.APPROVAL_STATUS.' + key);
  }
}
