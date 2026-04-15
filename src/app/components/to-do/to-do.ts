import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column, Task } from '../../models/to-do-interface';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.css']
})
export class TodoComponent {
  selectedTaskId: string | null = null;
  viewedTask: Task | null = null;
  taskForm: FormGroup;
  showForm = false;
  taskIdCounter = 2;

  columns: Column[] = [
    { 
      id: 'mise-en-place', 
      name: 'Mise en Place', 
      tasks: [
        { 
          id: '1', 
          title: 'Config. Entorno', 
          shortDescription: 'Setup inicial de VSCode y extensiones.', 
          extendedDescription: 'Instalar Prettier, ESLint y las extensiones necesarias para el desarrollo con Angular 21. Configurar el archivo settings.json.', 
          priority: 'Medium',
          createdAt: new Date('2026-04-10'),
          dueDate: new Date('2026-04-20')
        }
      ] 
    },
    { id: 'backlog', name: 'Backlog', tasks: [] },
    { id: 'todo', name: 'To Do', tasks: [] },
    { id: 'doing', name: 'Doing', tasks: [] },
    { id: 'test', name: 'Test', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] }
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(50)]],
      extendedDescription: ['', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: ['']
    });
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
      this.columns[0].tasks.push(newTask);
      this.taskForm.reset({ priority: 'Medium' });
      this.showForm = false;
    }
  }

  moveTask(taskId: string, direction: 'prev' | 'next') {
    let sourceColumnIndex = -1;
    let taskIndex = -1;

    for (let i = 0; i < this.columns.length; i++) {
      taskIndex = this.columns[i].tasks.findIndex((t: Task) => t.id === taskId);
      if (taskIndex !== -1) {
        sourceColumnIndex = i;
        break;
      }
    }

    if (sourceColumnIndex === -1) return;

    const targetColumnIndex = direction === 'next' ? sourceColumnIndex + 1 : sourceColumnIndex - 1;

    if (targetColumnIndex >= 0 && targetColumnIndex < this.columns.length) {
      const [task] = this.columns[sourceColumnIndex].tasks.splice(taskIndex, 1);
      this.columns[targetColumnIndex].tasks.push(task);
    }
    
    this.selectedTaskId = taskId;
  }
}
