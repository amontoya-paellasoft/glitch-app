import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column, Task } from '../../models/to-do-interface';
import { dateNotPastValidator } from '../../common/validators/date-not-past.validator';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TodoService } from '../../services/todo-service';
import { TareaService } from '../../services/tarea-service';
import { MOCK_AGENTS, MOCK_TAREAS } from '../../mock/mock-data';
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
  @Input('id') tareaId!: string;
  
  private _agentId!: string;
  @Input('agentId') set agentId(value: string) {
    this._agentId = value;
    this.updateFilter();
  }
  get agentId() { return this._agentId; }

  private _userId!: string;
  @Input('userId') set userId(value: string) {
    this._userId = value;
    this.updateFilter();
  }
  get userId() { return this._userId; }

  private _userNameInput!: string;
  @Input('userName') set userNameInput(value: string) {
    this._userNameInput = value;
    if (value) this.userName.set(value.replace(/-/g, ' '));
  }
  get userNameInput() { return this._userNameInput; }

  private translate = inject(TranslateService);
  public todoService = inject(TodoService);
  private tareaService = inject(TareaService);
  private destroyRef = inject(DestroyRef);

  selectedTaskId: string | null = null;
  viewedTask: Task | null = null;
  taskForm: FormGroup;
  showForm = false;
  taskIdCounter = 2;
  userName = signal<string>('');

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

  private updateFilter(): void {
    if (this.userId) {
      const uId = parseInt(this.userId, 10);
      this.todoService.setUsuarioIdFilter(uId);
      const agente = MOCK_AGENTS.find(a => a.dummyUserId === uId);
      if (agente) {
        this.userName.set(this.tareaService.getNombrePorMockId(agente.id));
      } else {
        this.userName.set(`Usuario ${uId}`);
      }
    } else if (this.agentId) {
      // Intentamos buscar por ID de agente o por dummyUserId si se pasó un número
      const agente = MOCK_AGENTS.find(a => a.id === this.agentId || a.dummyUserId.toString() === this.agentId);
      if (agente) {
        this.todoService.setUsuarioIdFilter(agente.dummyUserId);
        this.userName.set(this.tareaService.getNombrePorMockId(agente.id));
      } else {
        const uId = parseInt(this.agentId, 10);
        if (!isNaN(uId)) {
          this.todoService.setUsuarioIdFilter(uId);
          this.userName.set(`Usuario ${uId}`);
        }
      }
    } else {
      this.todoService.setUsuarioIdFilter(null);
      this.userName.set('');
    }
  }

  ngOnInit(): void {
    this.updateFilter();

    // Cargamos las tareas del MOCK local
    this.todoService.cargarTareasMock(MOCK_TAREAS);

    this.tareaService.getUsuariosConTareas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usuarios => {
        usuarios.forEach((usuario: any) => {
          this.todoService.cargarTareasDeApi(usuario.tareas);
        });
        
        // Refrescamos el nombre del usuario por si ahora tenemos más info en el cache
        this.updateFilter();
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
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        usuarioId: this.todoService.currentUser()
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
