import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_AGENTS } from '../mock/mock-data';
import { MOCK_TASK_DATA } from '../mock/task-data';
import { TareaInterface } from '../models/tarea-interface';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  company: { department: string; title: string };
}

const MOCK_USERS_CACHE: User[] = [
  { id: 11, firstName: 'Sophia',  lastName: 'Brown',   image: '', company: { department: 'Management',  title: 'Project Manager' } },
  { id: 14, firstName: 'Ana',     lastName: 'Torres',  image: '', company: { department: 'Engineering', title: 'Developer'       } },
  { id: 17, firstName: 'Olivia',  lastName: 'Wilson',  image: '', company: { department: 'Engineering', title: 'Developer'       } },
  { id: 18, firstName: 'Emily',   lastName: 'Johnson', image: '', company: { department: 'QA',          title: 'QA Engineer'     } },
  { id: 19, firstName: 'Lucas',   lastName: 'Herrera', image: '', company: { department: 'Engineering', title: 'Developer'       } },
  { id: 21, firstName: 'Daniel',  lastName: 'Morais',  image: '', company: { department: 'Engineering', title: 'Developer'       } },
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
  public readonly _usuariosCache = signal<User[]>(MOCK_USERS_CACHE);

  getNombrePorMockId(mockId: string): string {
    const agente = MOCK_AGENTS.find(a => a.id === mockId);
    return agente ? agente.name : mockId.toUpperCase();
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
