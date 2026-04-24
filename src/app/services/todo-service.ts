import { Injectable, signal, computed, inject } from '@angular/core';
import { Column, Task, MiseEnPlaceItem } from '../models/to-do-interface';
import { MOCK_TASK_DATA, MOCK_MISE_EN_PLACE } from '../mock/task-data';
import { TareaService } from './tarea-service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // ... (código existente) ...

  public drop(event: CdkDragDrop<any[]>) {
    const columns = this._columns();
    
    // Identificar columna origen y destino
    const sourceCol = columns.find(c => c.tasks === event.previousContainer.data);
    const targetCol = columns.find(c => c.tasks === event.container.data);

    if (!sourceCol || !targetCol) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Bloqueo para columna 'doing' si ya tiene tarea
      if (targetCol.id === 'doing' && targetCol.tasks.length > 0) return;
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // Actualizar orderIndex de todas las tareas en la columna destino
    targetCol.tasks.forEach((task, index) => {
      (task as any).orderIndex = index;
    });

    this._columns.set([...columns]);
  }
  private tareaService = inject(TareaService);
  
  private _searchTerm = signal<string>('');
  public searchTerm = this._searchTerm.asReadonly();

  private _priorityFilter = signal<string>('All');
  public priorityFilter = this._priorityFilter.asReadonly();

  private _usuarioIdFilter = signal<number | null>(null);
  public usuarioIdFilter = this._usuarioIdFilter.asReadonly();

  public currentUser = signal<number>(1);

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

  public cargarTareasMock(tareas: any[]): void {
    const currentCols = this._columns();
    tareas.forEach(tarea => {
      const numericId = parseInt(tarea.id.replace('tarea', ''), 10) || Math.floor(Math.random() * 10000);      
      const yaExiste = currentCols.some(col => col.tasks.some(t => (t as any).id === numericId));
      if (yaExiste) return;
      const task: Task = {
        taskId: numericId, id: numericId, title: tarea.titulo, texto: tarea.titulo, state: 'TODO',
        estado: tarea.estado === 'acabada' ? 'completada' : 'pendiente', assignedUserId: tarea.usuarioId,      
        asignadaA: tarea.usuarioId, priority: 'Medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        companyId: 0, projectId: 0, originType: 'MANUAL', functionalSummary: '', createdBy: 0,
        currentIteration: 1, validationMode: 'NONE', relatedTaskId: null, automationActive: false, automationBranchName: null
      };
      const targetCol = currentCols.find(c => c.id === 'todo');
      if (targetCol) targetCol.tasks.push(task);
    });
    this._columns.set([...currentCols]);
  }

  public cargarTareasDeApi(tareas: any[]): void {
    const currentCols = this._columns();
    const todoCol  = currentCols.find(c => c.id === 'todo');
    if (!todoCol) return;
    tareas.forEach(tarea => {
      const yaExiste = currentCols.some(col => col.tasks.some(t => (t as any).id === tarea.id));
      if (yaExiste) return;
      todoCol.tasks.push({ 
        ...tarea, 
        taskId: tarea.id, 
        title: tarea.texto, 
        texto: tarea.texto, 
        state: 'TODO', 
        estado: tarea.estado, 
        assignedUserId: tarea.asignadaA, 
        asignadaA: tarea.asignadaA, 
        priority: 'Medium', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        originType: 'MANUAL',
        validationMode: 'NONE',
        functionalSummary: '',
        companyId: 0,
        projectId: 0,
        createdBy: 0,
        currentIteration: 1,
        automationActive: false,
        automationBranchName: null,
        relatedTaskId: null
      } as any);
    });
    this._columns.set([...currentCols]);
  }
  private _columns = signal<Column[]>([
    { id: 'mise-en-place', name: 'Mise en Place', tasks: [], isMiseEnPlace: true },
    { id: 'backlog',       name: 'Backlog',       tasks: [] },
    { id: 'todo',          name: 'To Do',         tasks: [] },
    { id: 'doing',         name: 'Doing',         tasks: [] },
    { id: 'test',          name: 'Test',          tasks: [] },
    { id: 'done',          name: 'Done',          tasks: [] },
  ]);

  constructor() {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales() {
    const cols = this._columns();
    
    // 1. Mise en Place
    const miseCol = cols.find(c => c.id === 'mise-en-place');
    if (miseCol) {
      miseCol.tasks = MOCK_MISE_EN_PLACE.map(item => ({
        ...item,
        id: parseInt(item.itemId.replace(/\D/g, ''), 10) || 0,
        texto: item.title,
        itemType: item.itemType as any // Forzar tipo para evitar error de literal
      } as MiseEnPlaceItem));
    }

    // 2. Tareas
    MOCK_TASK_DATA.forEach((t: any) => {
      const stateId = t.state.toLowerCase();
      const col = cols.find(c => c.id === stateId);
      if (col) {
        if (col.id === 'doing' && col.tasks.length > 0) return;
        col.tasks.push({
          ...t,
          id: t.taskId,
          texto: t.title,
          estado: t.state === 'DONE' ? 'completada' : 'pendiente',
          asignadaA: t.assignedUserId,
          priority: 'Medium'
        });
      }
    });

    this._columns.set([...cols]);
  }

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
        // Normalizar acceso a usuario asignado
        const assignedUserId = (task as any).assignedUserId ?? (task as any).asignadaA;
        
        const matchesSearch = !term || 
          (task as any).title?.toLowerCase().includes(term) ||
          (task as any).texto?.toLowerCase().includes(term);
        
        const matchesPriority = priority === 'All' || (task as any).priority === priority;
        
        const matchesUser = userIdFilter === null || assignedUserId == userIdFilter;
        
        return matchesSearch && matchesPriority && matchesUser;
      })
    }));
  });

  public moveTask(taskId: number, direction: 'prev' | 'next') {
    const currentCols = this._columns();
    let sourceColumnIndex = -1;
    let taskIndex = -1;

    for (let i = 0; i < currentCols.length; i++) {
      taskIndex = currentCols[i].tasks.findIndex((t: any) => (t.taskId ?? t.id) === taskId);
      if (taskIndex !== -1) {
        sourceColumnIndex = i;
        break;
      }
    }

    if (sourceColumnIndex === -1) return;

    const targetColumnIndex = direction === 'next' ? sourceColumnIndex + 1 : sourceColumnIndex - 1;

    if (targetColumnIndex >= 0 && targetColumnIndex < currentCols.length) {
      const [task] = currentCols[sourceColumnIndex].tasks.splice(taskIndex, 1);
      
      // Si la columna destino es DOING, verificamos si ya hay una tarea
      if (currentCols[targetColumnIndex].id === 'doing' && currentCols[targetColumnIndex].tasks.length > 0) {
        currentCols[sourceColumnIndex].tasks.push(task); // Devolvemos al origen
        this._columns.set([...currentCols]);
        return;
      }

      currentCols[targetColumnIndex].tasks.push(task);
      this._columns.set([...currentCols]);
    }
  }

  public reorderTasks(event: any) {
    const currentCols = this._columns();
    const sourceColId = event.previousContainer.id;
    const targetColId = event.container.id;

    const sourceColIndex = currentCols.findIndex(c => c.id === sourceColId);
    const targetColIndex = currentCols.findIndex(c => c.id === targetColId);

    if (sourceColIndex === -1 || targetColIndex === -1) return;

    if (sourceColId === targetColId) {
      // Reordenar en la misma columna
      const tasks = [...currentCols[sourceColIndex].tasks];
      const [movedItem] = tasks.splice(event.previousIndex, 1);
      tasks.splice(event.currentIndex, 0, movedItem);
      
      // Actualizar orderIndex
      tasks.forEach((t, i) => (t as any).orderIndex = i);
      
      currentCols[sourceColIndex].tasks = tasks;
    } else {
      // Mover entre columnas
      const sourceTasks = [...currentCols[sourceColIndex].tasks];
      const targetTasks = [...currentCols[targetColIndex].tasks];
      
      const [movedItem] = sourceTasks.splice(event.previousIndex, 1);
      targetTasks.splice(event.currentIndex, 0, movedItem);

      // Actualizar estados y orderIndex
      sourceTasks.forEach((t, i) => (t as any).orderIndex = i);
      targetTasks.forEach((t, i) => {
        (t as any).orderIndex = i;
        (t as any).state = targetColId;
      });

      currentCols[sourceColIndex].tasks = sourceTasks;
      currentCols[targetColIndex].tasks = targetTasks;
    }

    this._columns.set([...currentCols]);
  }

  public getColumns() {
    return this._columns();
  }
}
