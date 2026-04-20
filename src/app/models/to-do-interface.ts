import { TaskInterface } from './task-dummy-interface';

export interface Task extends TaskInterface {
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}
