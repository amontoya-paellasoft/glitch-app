import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TodoComponent } from './components/to-do/to-do';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'to-do', component: TodoComponent }
];
