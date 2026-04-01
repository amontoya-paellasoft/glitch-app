import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/structure/header/header';
import { AgentMap } from './components/agent-map/agent-map';
import { Chat } from './components/chat/chat';
import { ControlPanel } from './components/control-panel/control-panel';
import { AngularSplitModule } from 'angular-split';
import { WorkspaceService } from './services/workspace-service';
import { FloatingWindow } from './components/floating-window/floating-window';
import { ChatService } from './services/chat-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, AgentMap, Chat, ControlPanel, AngularSplitModule, FloatingWindow],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit{
  public ws: WorkspaceService = inject(WorkspaceService);
  public chatServ: ChatService = inject(ChatService);

  ngOnInit() {
    this.chatServ.startSimulation();
  }
}
