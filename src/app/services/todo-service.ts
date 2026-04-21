import { Injectable, signal, computed, inject } from '@angular/core';
import { Column, Task } from '../models/to-do-interface';
import { TareaInterface } from '../models/tarea-interface';
import { TaskInterface } from '../models/task-dummy-interface';
import { TareaService } from './tarea-service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tareaService = inject(TareaService);
  private _searchTerm = signal<string>('');
  public searchTerm = this._searchTerm.asReadonly();

  private _priorityFilter = signal<string>('All');
  public priorityFilter = this._priorityFilter.asReadonly();

  private _usuarioIdFilter = signal<number | null>(null);
  public usuarioIdFilter = this._usuarioIdFilter.asReadonly();

  public currentUser = signal<number>(1);

  private _columns = signal<Column[]>([
    { id: 'mise-en-place', name: 'Mise en Place', tasks: [] },
    { id: 'backlog',       name: 'Backlog',       tasks: [] },
    { id: 'todo',          name: 'To Do',         tasks: [] },
    { id: 'doing',         name: 'Do',            tasks: [] },
    { id: 'test',          name: 'Test',          tasks: [] },
    { id: 'done',          name: 'Done',          tasks: [] },
  ]);

  public actualizarColumnas(columns: Column[]) {
    this._columns.set([...columns]);
  }

  public filteredColumns = computed(() => {
    const term = this._searchTerm().toLowerCase();
    const priority = this._priorityFilter();
    const userIdFilter = this._usuarioIdFilter();

    return this._columns().map(col => ({
      ...col,
      tasks: [...col.tasks].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)).filter(task => {
        const userName = this.tareaService._usuariosCache().find(u => u.id === task.asignadaA);
        const fullName = userName ? `${userName.firstName} ${userName.lastName}`.toLowerCase() : `usuario ${task.asignadaA}`.toLowerCase();
        
        const matchesSearch = !term || 
          task.texto.toLowerCase().includes(term) ||
          fullName.includes(term);
        
        const matchesPriority = priority === 'All' || task.priority === priority;
        
        const matchesUser = userIdFilter === null || task.asignadaA === userIdFilter;
        
        return matchesSearch && matchesPriority && matchesUser;
      })
    }));
  });

  public setSearchTerm(term: string) {
    this._searchTerm.set(term);
  }

  public setPriorityFilter(priority: string) {
    this._priorityFilter.set(priority);
  }

  public setUsuarioIdFilter(id: number | null) {
    this._usuarioIdFilter.set(id);
    if (id !== null) {
      this.currentUser.set(id);
    }
  }

  public addTask(task: Task) {
    const currentCols = this._columns();
    currentCols[0].tasks.push(task);
    this._columns.set([...currentCols]);
  }

  public moveTask(taskId: number, direction: 'prev' | 'next') {
    const currentCols = this._columns();
    let sourceColumnIndex = -1;
    let taskIndex = -1;

    for (let i = 0; i < currentCols.length; i++) {
      taskIndex = currentCols[i].tasks.findIndex((t: Task) => t.id === taskId);
      if (taskIndex !== -1) {
        sourceColumnIndex = i;
        break;
      }
    }

    if (sourceColumnIndex === -1) return;

    const targetColumnIndex = direction === 'next' ? sourceColumnIndex + 1 : sourceColumnIndex - 1;

    if (targetColumnIndex >= 0 && targetColumnIndex < currentCols.length) {
      const [task] = currentCols[sourceColumnIndex].tasks.splice(taskIndex, 1);
      // Actualizamos el estado basado en la columna destino
      if (currentCols[targetColumnIndex].id === 'done') {
        task.estado = 'completada';
      } else {
        task.estado = 'pendiente';
      }
      currentCols[targetColumnIndex].tasks.push(task);
      this._columns.set([...currentCols]);
    }
  }

  public getColumns() {
    return this._columns();
  }

  public cargarTareasMock(tareas: TareaInterface[]): void {
    const currentCols = this._columns();
    
    tareas.forEach(tarea => {
      // Evitar duplicados (id puede ser string o number en TareaInterface, convertimos a number si es numérico)
      const numericId = parseInt(tarea.id.replace('tarea', ''), 10) || Math.floor(Math.random() * 10000);
      const yaExiste = currentCols.some(col => 
        col.tasks.some(t => t.id === numericId)
      );
      if (yaExiste) return;

      const task: Task = {
        id: numericId,
        texto: tarea.titulo,
        estado: tarea.estado === 'acabada' ? 'completada' : 'pendiente',
        asignadaA: tarea.usuarioId,
        priority: this.mapPrioridad(tarea.prioridad),
        createdAt: tarea.creadaEn,
      };

      // Mapear estado a columna
      const colId = this.mapEstadoAColumna(tarea.estado);
      const targetCol = currentCols.find(c => c.id === colId);
      if (targetCol) {
        targetCol.tasks.push(task);
      }
    });

    this._columns.set([...currentCols]);
  }

  private mapPrioridad(p: TareaInterface['prioridad']): Task['priority'] {
    if (p === 'alta') return 'High';
    if (p === 'media') return 'Medium';
    return 'Low';
  }

  private mapEstadoAColumna(e: TareaInterface['estado']): string {
    if (e === 'pendiente') return 'todo';
    if (e === 'en_progreso') return 'doing';
    if (e === 'acabada') return 'done';
    return 'backlog';
  }

  public cargarTareasDeApi(tareas: TaskInterface[]): void {
    const currentCols = this._columns();
    const todoCol  = currentCols.find(c => c.id === 'todo');
    const doneCol  = currentCols.find(c => c.id === 'done');
    if (!todoCol || !doneCol) return;

    tareas.forEach(tarea => {
      const yaExiste = currentCols.some(col =>
        col.tasks.some(t => t.id === tarea.id)
      );
      if (yaExiste) return;

      const task: Task = {
        id: tarea.id,
        texto: tarea.texto,
        estado: tarea.estado,
        asignadaA: tarea.asignadaA,
        priority: 'Medium',
        createdAt: new Date(),
      };

      if (tarea.estado === 'completada') {
        doneCol.tasks.push(task);
      } else {
        todoCol.tasks.push(task);
      }
    });

    this._columns.set([...currentCols]);
  }
}
