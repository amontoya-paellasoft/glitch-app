import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _lang = signal<Language>((localStorage.getItem('lang') as Language) || 'es');
  public currentLang = this._lang.asReadonly();

  private translations: any = {
    es: {
      TODO: {
        TITLE: 'Tablero de Tareas',
        NEW_TASK: '+ Nueva Tarea',
        CLOSE: '✕ Cerrar',
        MODAL_TITLE: 'Nueva Tarea',
        LABELS: {
          TITLE: 'Título',
          DESCRIPTION: 'Descripción',
          DETAILS: 'Detalles',
          PRIORITY: 'Prioridad',
          DUE_DATE: 'Fecha de Entrega',
          STATUS: 'Estado',
          CREATED: 'Creado',
          ID: 'ID'
        },
        PLACEHOLDERS: {
          TITLE: 'Título de la tarea',
          DESCRIPTION: 'Breve descripción',
          DETAILS: 'Información detallada...'
        },
        PRIORITIES: {
          Low: 'Baja',
          Medium: 'Media',
          High: 'Alta'
        },
        ERRORS: {
          PAST_DATE: 'La fecha no puede ser anterior a hoy.'
        },
        BUTTONS: {
          CANCEL: 'Cancelar',
          ADD: 'Añadir Tarea',
          VIEW: 'Ver',
          ALL: 'Todas'
        },
        FILTERS: {
          PRIORITY: 'Filtrar por Prioridad',
          ALL: 'Todas'
        },
        COLUMNS: {
          'Mise en Place': 'Mise en Place',
          'Backlog': 'Pendientes',
          'To Do': 'Por Hacer',
          'Do': 'En Proceso',
          'Test': 'Pruebas',
          'Done': 'Hecho'
        },
        VIEW_MODAL: {
          TITLE: 'Detalles de la Tarea',
          NO_DEADLINE: 'Sin fecha límite'
        },
        EMPTY_STATE: 'No hay tareas aquí'
      }
    },
    en: {
      TODO: {
        TITLE: 'Task Board',
        NEW_TASK: '+ New Task',
        CLOSE: '✕ Close',
        MODAL_TITLE: 'New Task',
        LABELS: {
          TITLE: 'Title',
          DESCRIPTION: 'Description',
          DETAILS: 'Details',
          PRIORITY: 'Priority',
          DUE_DATE: 'Due Date',
          STATUS: 'Status',
          CREATED: 'Created',
          ID: 'ID'
        },
        PLACEHOLDERS: {
          TITLE: 'Task title',
          DESCRIPTION: 'Brief description',
          DETAILS: 'Detailed information...'
        },
        PRIORITIES: {
          Low: 'Low',
          Medium: 'Medium',
          High: 'High'
        },
        ERRORS: {
          PAST_DATE: 'Date cannot be in the past.'
        },
        BUTTONS: {
          CANCEL: 'Cancel',
          ADD: 'Add Task',
          VIEW: 'View',
          ALL: 'All'
        },
        FILTERS: {
          PRIORITY: 'Filter by Priority',
          ALL: 'All'
        },
        COLUMNS: {
          'Mise en Place': 'Mise en Place',
          'Backlog': 'Backlog',
          'To Do': 'To Do',
          'Do': 'Do',
          'Test': 'Test',
          'Done': 'Done'
        },
        VIEW_MODAL: {
          TITLE: 'Task Details',
          NO_DEADLINE: 'No deadline'
        },
        EMPTY_STATE: 'No tasks here'
      }
    }
  };

  constructor() {}

  public setLanguage(lang: Language) {
    this._lang.set(lang);
    localStorage.setItem('lang', lang);
  }

  public translate(key: string): string {
    const keys = key.split('.');
    let result = this.translations[this._lang()];
    
    if (!result) return key;

    for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      let tempResult = result[currentKey];

      // Optimización: si no se encuentra, intentamos reconstruir la clave por si contenía puntos internos
      if (tempResult === undefined) {
        let j = i + 1;
        while (j < keys.length && tempResult === undefined) {
          currentKey += '.' + keys[j];
          tempResult = result[currentKey];
          if (tempResult !== undefined) {
            i = j; // Avanzamos el puntero al haber consumido más partes de la clave
          }
          j++;
        }
      }

      if (tempResult === undefined) {
        return key;
      }
      result = tempResult;
    }
    
    return typeof result === 'string' ? result : key;
  }
}
