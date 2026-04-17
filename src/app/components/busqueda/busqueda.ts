import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {
  public todoService = inject(TodoService);
  public searchTerm = '';
  public priorities = ['All', 'Low', 'Medium', 'High'];

  onSearchChange() {
    this.todoService.setSearchTerm(this.searchTerm);
  }

  setPriority(priority: string) {
    this.todoService.setPriorityFilter(priority);
  }
}
