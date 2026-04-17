export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  extendedDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  dueDate?: Date;
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}
