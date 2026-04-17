import { Component, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private translate = inject(TranslateService);

  isLangMenuOpen = false;
  idiomaActual = localStorage.getItem('idioma_preferido') || 'es';

  selectLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('idioma_preferido', lang);
    this.idiomaActual = lang;
    this.isLangMenuOpen = false;
  }

  toggleMenu(): void {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

}
