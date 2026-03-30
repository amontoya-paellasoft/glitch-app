// header.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="topbar">
      <span class="status-led"></span>
      <span class="topbar-title">ESTADO</span>
      <span class="topbar-sub">Simulación chat multiagentes IA</span>
      <span class="sprint-badge">Sprint 1</span>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px;
      border-bottom: 0.5px solid var(--border);
      background: var(--surface);
    }
    .status-led {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #3fc87a;
    }
    .topbar-title { font-size: 13px; font-weight: 600; }
    .topbar-sub { font-size: 12px; color: var(--text3); }
    .sprint-badge {
      margin-left: auto;
      font-size: 11px; font-weight: 500;
      padding: 3px 10px;
      border-radius: 20px;
      background: var(--accent-bg);
      color: var(--accent);
    }
  `]
})
export class Header {}
