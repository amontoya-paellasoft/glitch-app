import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TAREAS } from '../mock/mock-data';
import { Task, Column, TareaInterface } from '../models/tarea-interface';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private tasks = signal<Task[]>([
    {
      id: 'in_progress-1',
      title: 'Optimización del renderizado',
      shortDescription: 'Reducir re-renders innecesarios.',
      extendedDescription: 'Reducir re-renders innecesarios en el árbol de UI y revisar performance del frontend en pantallas complejas.',
      priority: 'Medium',
      createdAt: new Date(),
    }
  ]);

  private searchTerm = signal<string>('');
  private priorityFilterSignal = signal<string>('All');

  public columns = computed<Column[]>(() => {
    const allTasks = this.tasks();
    const filteredTasks = allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
                          task.shortDescription.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesPriority = this.priorityFilterSignal() === 'All' || task.priority === this.priorityFilterSignal();
      return matchesSearch && matchesPriority;
    });

    return [
      { id: 'mise_en_place', name: 'Mise en Place', tasks: filteredTasks.filter(t => t.id.startsWith('mise_en_place')) },
      { id: 'backlog', name: 'Backlog', tasks: filteredTasks.filter(t => t.id.startsWith('backlog')) },
      { id: 'todo', name: 'To Do', tasks: filteredTasks.filter(t => !t.id.startsWith('mise_en_place') && !t.id.startsWith('backlog') && !t.id.startsWith('in_progress') && !t.id.startsWith('testing') && !t.id.startsWith('done')) },
      { id: 'in_progress', name: 'Do', tasks: filteredTasks.filter(t => t.id.startsWith('in_progress')) },
      { id: 'testing', name: 'Test', tasks: filteredTasks.filter(t => t.id.startsWith('testing')) },
      { id: 'done', name: 'Done', tasks: filteredTasks.filter(t => t.id.startsWith('done')) }
    ];
  });

  getAllTareas(): Observable<TareaInterface[]> {
    return of(MOCK_TAREAS);
  }

  getTareasByAgente(agentId: string): Observable<TareaInterface[]> {
    const filtradas = MOCK_TAREAS.filter(t => t.asignadaA === agentId);
    return of(filtradas);
  }

  getTareasByEstado(estado: TareaInterface['estado']): Observable<TareaInterface[]> {
    const filtradas = MOCK_TAREAS.filter(t => t.estado === estado);
    return of(filtradas);
  }

  filteredColumns() {
    return this.columns();
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  setPriorityFilter(priority: string) {
    this.priorityFilterSignal.set(priority);
  }

  priorityFilter() {
    return this.priorityFilterSignal();
  }

  addTask(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
  }

  moveTask(taskId: string, direction: 'prev' | 'next') {
    const columnsOrder = ['mise_en_place', 'backlog', 'todo', 'in_progress', 'testing', 'done'];
    const currentColumn = columnsOrder.find(col => taskId.startsWith(col));
    const currentIndex = currentColumn ? columnsOrder.indexOf(currentColumn) : 2; 
    const nextIndex = direction === 'next' ? Math.min(currentIndex + 1, columnsOrder.length - 1) : Math.max(currentIndex - 1, 0);
    
    const newPrefix = columnsOrder[nextIndex];
    const baseId = taskId.replace(/^(mise_en_place|backlog|todo|in_progress|testing|done)-/, '') || taskId;
    const newId = `${newPrefix}-${baseId}`;
    
    this.tasks.update(tasks => tasks.map(t => t.id === taskId ? { ...t, id: newId } : t));
  }

  findTaskIdByOriginal(originalId: string): string | null {
    const task = this.tasks().find(t => t.id.endsWith(originalId.replace(/^(mise_en_place|backlog|todo|in_progress|testing|done)-/, '')));
    return task ? task.id : null;
  }
}
