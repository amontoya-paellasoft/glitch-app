import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';
import { TareaService } from '../../services/tarea-service';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDTO } from '../../models/altorium/task-dto';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {
  public todoService = inject(TodoService);
  public tareaService = inject(TareaService);
  public searchTerm = '';
  public priorities = ['All', 'Low', 'Medium', 'High'];

  get usuarios() {
    const columns = this.todoService.getColumns();
    const userIds = new Set<number>();
    
    columns.forEach(col => {
      col.tasks.forEach(task => {
        const userId = (task as any).assignedUserId ?? (task as any).asignadaA;
        if (userId) userIds.add(userId);
      });
    });

    const cache = this.tareaService._usuariosCache();
    const usuariosPresentes: UserDTO[] = cache.filter(u => userIds.has(u.userId));

    userIds.forEach(id => {
      if (!cache.find(u => u.userId === id)) {
        usuariosPresentes.push({ userId: id, fullName: `Usuario ${id}`, email: '' });
      }
    });

    return usuariosPresentes;
  }

  onSearchChange() {
    this.todoService.setSearchTerm(this.searchTerm);
  }

  setPriority(priority: string) {
    this.todoService.setPriorityFilter(priority);
  }

  setUser(userId: string) {
    const id = userId === 'All' ? null : parseInt(userId, 10);
    this.todoService.setUsuarioIdFilter(id);
  }
}
