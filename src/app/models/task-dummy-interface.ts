export interface TaskInterface {
  id: number;
  texto: string;
  estado: 'pendiente' | 'completada';
  asignadaA: number;
}
