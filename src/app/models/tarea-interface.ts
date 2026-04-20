export interface TareaInterface {
  id: string;
  titulo: string;
  descripcion: string;
  asignadaA: string; // idAgente
  estado: 'pendiente' | 'acabada' | 'en_progreso' | 'descartada';
  prioridad: 'baja' | 'media' | 'alta';
  creadaEn: Date;
  usuarioId: number; // idUsuario que creó la tarea
}
