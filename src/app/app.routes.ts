import { Routes } from '@angular/router';
import { AgentMap } from './components/agent-map/agent-map';
import { TodoComponent } from './components/to-do/to-do';

export const routes: Routes = [
  { path: '', component: AgentMap },
  { path: 'to-do', component: TodoComponent },
  { path: 'to-do/:id/:agentId', component: TodoComponent } // Ruta para las tareas de un agente específico
];
