import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_AGENTS, MOCK_USERS } from '../mock/mock-data';
import { MOCK_TASK_DATA } from '../mock/task-data';
import { TareaInterface } from '../models/tarea-interface';
import { UserDTO } from '../models/altorium/task-dto';

const MOCK_USERS_CACHE: UserDTO[] = [
  { userId: 11, fullName: 'Sophia Brown',   email: '' },
  { userId: 14, fullName: 'Ana Torres',     email: '' },
  { userId: 17, fullName: 'Olivia Wilson',  email: '' },
  { userId: 18, fullName: 'Emily Johnson',  email: '' },
  { userId: 19, fullName: 'Lucas Herrera',  email: '' },
  { userId: 21, fullName: 'Daniel Morais',  email: '' },
];

const AGENT_TASK_MAP: Record<string, number[]> = {
  'pm': [1042, 1051],
  'di': [1049, 1048],
  'fe': [1046, 1047],
  'be': [1052, 1050],
  'qa': [1045, 1043],
  'us': [],
};

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  public readonly _usuariosCache = signal<UserDTO[]>(MOCK_USERS_CACHE);

  getNombrePorMockId(mockId: string): string {
    const agente = MOCK_AGENTS.find(a => a.id === mockId);
    if (!agente) return mockId.toUpperCase();
    const usuario = MOCK_USERS.find(u => u.userId === agente.userId);
    return usuario?.fullName ?? mockId.toUpperCase();
  }

  getTareasByAgenteMock(agentId: string): Observable<TareaInterface[]> {
    const taskIds = AGENT_TASK_MAP[agentId] ?? [];
    const tareas: TareaInterface[] = MOCK_TASK_DATA
      .filter(t => taskIds.includes(t.taskId))
      .map(t => ({
        id: String(t.taskId),
        titulo: t.title,
        descripcion: t.functionalSummary,
        asignadaA: String(t.assignedUserId),
        estado: this.mapEstado(t.state),
        prioridad: this.mapPrioridad(t.validationMode),
        creadaEn: new Date(t.createdAt),
      }));
    return of(tareas);
  }

  private mapEstado(state: string): TareaInterface['estado'] {
    if (state === 'DOING' || state === 'TEST') return 'en_progreso';
    if (state === 'DONE') return 'acabada';
    return 'pendiente';
  }

  private mapPrioridad(validationMode: string): TareaInterface['prioridad'] {
    if (validationMode === 'FULL_SANDBOX')    return 'alta';
    if (validationMode === 'PARTIAL_SANDBOX') return 'media';
    return 'baja';
  }
}
