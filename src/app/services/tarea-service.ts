import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { MOCK_AGENTS } from '../mock/mock-data';
import { TaskInterface } from '../models/task-dummy-interface';
import { User } from '../models/agent-interface';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://dummyjson.com';

  public readonly _usuariosCache = signal<User[]>([]);

  getNombrePorMockId(mockId: string): string {
    const agente = MOCK_AGENTS.find(a => a.id === mockId);
    if (!agente) return mockId.toUpperCase();
    const usuario = this._usuariosCache().find(u => u.id === agente.dummyUserId);
    return usuario ? `${usuario.firstName} ${usuario.lastName}` : agente.name;
  }

  getAgenteAPIPorId(id: number): Observable<User> {
    return this.http
      .get<any>(`${this.baseUrl}/users/${id}?select=id,firstName,lastName,image,company`)
      .pipe(
        map((u): User => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          image: u.image,
          company: { department: u.company.department, title: u.company.title },
        })),
        tap(usuario => {
          const actual = this._usuariosCache();
          const sinEste = actual.filter(u => u.id !== usuario.id);
          this._usuariosCache.set([...sinEste, usuario]);
        }),
      );
  }

  private mapTodo(todo: any): TaskInterface | null {
    const excludedTitles = [
      'Learn Javascript',
      'Listen to a new music genre',
      'Text a friend you haven\'t talked to in a long time',
      'Attend a local cultural festival',
      'Draw and color a Mandala'
    ];
    
    if (excludedTitles.includes(todo.todo)) {
      return null;
    }

    return {
      id: todo.id,
      texto: todo.todo,
      estado: todo.completed ? 'completada' : 'pendiente',
      asignadaA: todo.userId,
    };
  }

  getTareasApiByAgente(agentId: number): Observable<TaskInterface[]> {
    return this.http
      .get<any>(`${this.baseUrl}/todos/user/${agentId}`)
      .pipe(map((respuesta) => respuesta.todos
        .map((todo: any) => this.mapTodo(todo))
        .filter((t: any) => t !== null) as TaskInterface[]
      ));
  }

  getUsuariosConTareas(): Observable<any[]> {
    return this.http
      .get<any>('https://dummyjson.com/users?limit=6&select=id,firstName,lastName,image,company')
      .pipe(
        tap(respuesta => {
          const users: User[] = respuesta.users.map((u: any): User => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            image: u.image,
            company: { department: u.company.department, title: u.company.title },
          }));
          this._usuariosCache.set(users);
        }),
        switchMap((respuesta) => {
          const users = respuesta.users;
          const observables: Observable<any>[] = users.map((user: any) =>
            this.getTareasApiByAgente(user.id).pipe(map((tareas) => ({ ...user, tareas }))),
          );
          return forkJoin(observables);
        }),
      );
  }
}
