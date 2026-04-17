// header.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <header class="topbar">
      <span class="status-led"></span>
      <span class="topbar-title" routerLink="/" style="cursor: pointer">{{ 'APP_1001_TITLE' | translate }}</span>
      <span class="topbar-sub d-none d-md-inline">{{ 'APP_1002_SUBTITLE' | translate }}</span>
      
      <nav class="ms-3 d-flex gap-2">
        <button class="nav-btn" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dash</button>
        <button class="nav-btn" routerLink="/to-do" routerLinkActive="active">To-Do</button>
      </nav>

      <div class="ms-auto d-flex align-items-center gap-3">
        <button class="lang-btn" (click)="toggleLanguage()">
          {{ translate.currentLang === 'es' ? 'EN' : 'ES' }}
        </button>
        <span class="sprint-badge">Sprint 1</span>
      </div>
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

    .lang-btn {
      background: var(--accent-bg);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .lang-btn:hover { opacity: 0.8; }

    .sprint-badge {
      font-size: 11px; font-weight: 500;
      padding: 3px 10px;
      border-radius: 20px;
      background: var(--accent-bg);
      color: var(--accent);
    }
  `]
})
export class Header {
  public translate = inject(TranslateService);

  toggleLanguage() {
    const nextLang = this.translate.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(nextLang);
  }
}
