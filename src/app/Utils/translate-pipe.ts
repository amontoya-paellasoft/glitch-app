import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../Service/Translation/translation-service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Necesario para que reaccione al cambio de signal sin cambio de input
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string): string {
    // Al acceder a la signal currentLang(), Angular marca el pipe como sucio cuando la signal cambia
    this.translationService.currentLang();
    return this.translationService.translate(key);
  }
}
