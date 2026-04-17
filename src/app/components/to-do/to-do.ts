import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column, Task } from '../../models/tarea-interface';
import { dateNotPastValidator } from '../../common/validators/date-not-past.validator';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TareaService } from '../../services/tarea-service';
import { Busqueda } from '../busqueda/busqueda';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe, Busqueda],
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.css']
})
export class TodoComponent {
  private translate = inject(TranslateService);
  public todoService = inject(TareaService);
  
  selectedTaskId: string | null = null;
  viewedTask: Task | null = null;
  taskForm: FormGroup;
  showForm = false;
  taskIdCounter = 2;

  // Accedemos a las columnas filtradas desde el servicio
  get columns() {
    return this.todoService.filteredColumns();
  }

  get currentPriority() {
    return this.todoService.priorityFilter();
  }

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(50)]],
      extendedDescription: ['', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: ['', dateNotPastValidator()]
    });
  }

  getTranslatedPriority(priority: string): string {
    return this.translate.instant('TODO.PRIORITIES.' + priority);
  }

  getTranslatedColumn(name: string): string {
    return this.translate.instant('TODO.COLUMNS.' + name);
  }

  selectTask(id: string) {
    this.selectedTaskId = this.selectedTaskId === id ? null : id;
  }

  openView(task: Task) {
    this.viewedTask = task;
  }

  closeView() {
    this.viewedTask = null;
  }

  addTask() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask: Task = {
        id: 'mise_en_place-' + Date.now(),
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        extendedDescription: formValue.extendedDescription,
        priority: formValue.priority,
        createdAt: new Date(),
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
      };
      this.taskIdCounter++;
      this.todoService.addTask(newTask);
      this.taskForm.reset({ priority: 'Medium' });
      this.showForm = false;
    }
  }

  moveTask(taskId: string, direction: 'prev' | 'next') {
    this.todoService.moveTask(taskId, direction);
    // Mantenemos la tarea seleccionada actualizando su ID si es necesario (el servicio ya gestiona el nuevo ID)
    const newId = this.todoService.findTaskIdByOriginal(taskId);
    this.selectedTaskId = newId || taskId;
  }
}
