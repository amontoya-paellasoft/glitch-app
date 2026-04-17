export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  extendedDescription: string;
  priority: Priority;
  createdAt: Date;
  dueDate?: Date;
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

// Mantener la interfaz en español por compatibilidad si es necesario en otros sitios
export interface TareaInterface {
  id: string;
  titulo: string;
  descripcion: string;
  asignadaA: string; // idAgente
  estado: 'pendiente' | 'acabada' | 'en_progreso' | 'descartada';
  prioridad: 'baja' | 'media' | 'alta';
  creadaEn: Date;
}
