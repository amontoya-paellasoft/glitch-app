// header.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="topbar">
      <span class="status-led"></span>
      <span class="topbar-title" routerLink="/" style="cursor: pointer">GLITCH</span>
      <span class="topbar-sub d-none d-md-inline">Simulación de trabajo entre agentes IA</span>
      
      <nav class="ms-3 d-flex gap-2">
        <button class="nav-btn" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dash</button>
        <button class="nav-btn" routerLink="/to-do" routerLinkActive="active">To-Do</button>
      </nav>

      <span class="sprint-badge">Sprint 1</span>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1rem;
      border-bottom: 0.5px solid var(--border);
      background: var(--surface);
    }
    .status-led {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #3fc87a;
    }
    .topbar-title { font-size: 13px; font-weight: 600; text-decoration: none; color: inherit; }
    .topbar-sub { font-size: 12px; color: var(--text3); font-style: italic; }
    
    .nav-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text2);
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--hover); }
    .nav-btn.active {
      background: var(--accent-bg);
      color: var(--accent);
      border-color: var(--accent);
    }

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
