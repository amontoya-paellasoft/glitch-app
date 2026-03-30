import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  template: `<div class="panel">Consola retro</div>`,
  imports: [],
  styles: [`
    .panel {
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text3);
      font-size: 13px;
    }
  `]
})
export class Chat {}
