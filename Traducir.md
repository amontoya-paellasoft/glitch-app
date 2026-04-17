# Guía de Implementación Multi-Idioma (i18n)

Para hacer el proyecto multi-idioma (Español/Inglés) de forma nativa y sin librerías externas que causen conflictos de compilación, se ha implementado un sistema ligero basado en señales (Signals) y un servicio dedicado.

## Estructura del Sistema
1.  **`TranslationService`**: Servicio centralizado en `src/app/Service/Translation/translation-service.ts`.
    *   **Estado**: Gestiona el idioma actual como una `Signal` (`'es'` | `'en'`).
    *   **Persistencia**: Guarda la preferencia del usuario en `localStorage` para mantenerla entre recargas.
    *   **Diccionario**: Contiene el objeto de traducciones. La lógica de `translate()` está optimizada para manejar claves con puntos internos (como las estadísticas: `TABLERO.STATS.Def. Especial`).
2.  **`TranslatePipe`**: Un `Pipe` personalizado (`src/app/Utils/translate-pipe.ts`) que permite usar la traducción directamente en los templates HTML de forma reactiva.

## Cómo añadir nuevos textos
Para traducir cualquier texto de la aplicación:
1.  **Define la clave en el diccionario**:
    *   Abre `src/app/Service/Translation/translation-service.ts`.
    *   Añade el par clave-valor en las secciones `es` y `en` del objeto `translations`.
2.  **Usa el Pipe en el HTML**:
    *   Asegúrate de que el componente tenga `TranslatePipe` en su array de `imports`.
    *   Usa el pipe: `{{ 'CLAVE.DEL.TEXTO' | translate }}`.

## Funcionalidades implementadas
- [x] **Persistencia**: El idioma se recupera automáticamente al recargar.
- [x] **Reactividad**: Cambio dinámico instantáneo al pulsar el botón de idioma.
- [x] **Cobertura**: 
    - Menú (títulos, opciones, tutorial).
    - Tablero (títulos, estadísticas, estados de objetos, botones de acción, mensajes de liga).
- [x] **Selector de Idioma**: Botón en el menú para alternar entre idiomas.

## Notas Técnicas
- El sistema busca recursivamente en el objeto de traducciones. Si la clave contiene más de tres niveles o puntos (como en las estadísticas), el servicio `translate()` reconstruye la clave adecuadamente.
- Si una clave no se encuentra en el diccionario, el pipe devuelve la clave original, lo cual es útil para detectar textos olvidados durante el desarrollo.
