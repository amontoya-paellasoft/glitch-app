import { Component, inject, OnInit } from '@angular/core';
import { Header } from './components/structure/header/header';
import { AgentMap } from './components/agent-map/agent-map';
import { ControlPanel } from './components/control-panel/control-panel';
import { AngularSplitModule, SplitGutterInteractionEvent } from 'angular-split';
import { WorkspaceService } from './services/workspace-service';
import { FloatingWindow } from './components/floating-window/floating-window';
import { ChatService } from './services/chat-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, AgentMap, ControlPanel, AngularSplitModule, FloatingWindow],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  public ws: WorkspaceService = inject(WorkspaceService);
  public chatServ: ChatService = inject(ChatService);
  sizePaneles: number[] = [50, 50];

  ngOnInit() {
    const guardado = localStorage.getItem('glitch-split');
    // JSONparse convierte el string en un array [n,n]
    if (guardado) this.sizePaneles = JSON.parse(guardado);
    this.chatServ.iniciarSimulacion();
    this.ws.abrir({ agentId: '' });
  }

  onSplitFin(event: SplitGutterInteractionEvent): void {
    // Cada vez que el usuario suelta el divisor, guardamos los tamaños nuevos
    localStorage.setItem('glitch-split', JSON.stringify(event.sizes));
  }

  get windowWidth(): number {
    return window.innerWidth;
  }
}
