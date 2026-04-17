import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column, Task } from '../../models/to-do-interface';
import { dateNotPastValidator } from '../../common/validators/date-not-past.validator';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TodoService } from '../../services/todo-service';
import { TareaService } from '../../services/tarea-service';
import { Busqueda } from '../busqueda/busqueda';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe, Busqueda, RouterLink],
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.css']
})
export class TodoComponent implements OnInit {
  private translate = inject(TranslateService);
  public todoService = inject(TodoService);
  private tareaService = inject(TareaService);
  private destroyRef = inject(DestroyRef);

  selectedTaskId: string | null = null;
  viewedTask: Task | null = null;
  taskForm: FormGroup;
  showForm = false;
  taskIdCounter = 2;

  // Accedemos a las columnas filtradas desde el servicio
  get columns() {
    return this.todoService.filteredColumns();
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(50)]],
      extendedDescription: ['', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: ['', dateNotPastValidator()]
    });
  }

  ngOnInit(): void {
    this.tareaService.getUsuariosConTareas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usuarios => {
        usuarios.forEach((usuario: any) => {
          this.todoService.cargarTareasDeApi(usuario.tareas);
        });
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
        id: this.taskIdCounter.toString(),
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
    this.selectedTaskId = taskId;
  }
}
