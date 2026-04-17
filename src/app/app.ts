import { Component, inject, OnInit } from '@angular/core';
import { Header } from './components/structure/header/header';
import { WorkspaceService } from './services/workspace-service';
import { FloatingWindow } from './components/floating-window/floating-window';
import { SimulationService } from './services/simulation-service';
import { AgentPanel } from './components/agent-panel/agent-panel';
import { ControlPanel } from './components/structure/control-panel/control-panel';
import { Stats } from './components/stats/stats';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, ControlPanel, FloatingWindow, AgentPanel, Stats, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  public ws: WorkspaceService = inject(WorkspaceService);
  private simulationServ: SimulationService = inject(SimulationService);

  ngOnInit() {
    this.simulationServ.iniciarSimulacion();
    this.ws.abrir({ agentId: '' });
  }

  get windowWidth(): number {
    return window.innerWidth;
  }
}
