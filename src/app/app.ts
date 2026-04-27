import { Component, inject, OnInit } from '@angular/core';
import { Header } from './components/structure/header/header';
import { WorkspaceService } from './services/workspace-service';
import { SimulationService } from './services/simulation-service';
import { AgentPanel } from './components/agent-panel/agent-panel';
import { ControlPanel } from './components/structure/control-panel/control-panel';
import { Stats } from './components/stats/stats';
import { FloatingLogPanel } from './components/floating-log-panel/floating-log-panel';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, ControlPanel, AgentPanel, Stats, FloatingLogPanel, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  public ws: WorkspaceService = inject(WorkspaceService);
  private simulationServ: SimulationService = inject(SimulationService);
  private router = inject(Router);
  
  isMapRoute = true;

  ngOnInit() {
    this.simulationServ.iniciarSimulacion();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // La ruta del mapa es ''
      this.isMapRoute = event.url === '/' || event.url === '';
    });
  }

  get windowWidth(): number {
    return window.innerWidth;
  }
}
