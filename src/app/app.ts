import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/structure/header/header';
import { AgentMap } from './components/agent-map/agent-map';
import { Chat } from './components/chat/chat';
import { ControlPanel } from './components/control-panel/control-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, AgentMap, Chat, ControlPanel],
  template: `
    <div class="workspace">
      <app-header />
      <app-agent-map />
      <app-chat />
      <app-control-panel />
    </div>
  `,
  styles: [`
    .workspace {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 46px 1fr auto;
      height: 100vh;
      overflow: hidden;
    }

    app-header {
      grid-column: 1 / -1;
    }

    app-control-panel {
      grid-column: 1 / -1;
    }
  `]
})
export class App {
  protected readonly title = signal('Glitch');
}
