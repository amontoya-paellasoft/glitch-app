import { Component } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  template: `<div class="panel">Panel de control</div>`,
  styles: [`
    .panel {
      height: 52px;
      border-top: 0.5px solid var(--border);
      background: var(--surface2);
      display: flex;
      align-items: center;
      padding: 0 16px;
      color: var(--text3);
      font-size: 12px;
    }
  `]
})
export class ControlPanel {}
