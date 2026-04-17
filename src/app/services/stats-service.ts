import { Injectable } from '@angular/core';
import { MOCK_MESSAGES } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class StatsService {

  // Cuenta cuántos mensajes ha enviado cada agente
  // Devuelve un objeto listo para ECharts
  getActividadPorAgente() {
    const contador: Record<string, number> = {};

    MOCK_MESSAGES.forEach(m => {
      // Ignoramos al usuario y los 'all' para que sea más limpio
      if (m.from === 'us') return;
      contador[m.from] = (contador[m.from] ?? 0) + 1;
    });

    const agentes = Object.keys(contador);       // ['pm', 'fe', 'be', 'qa', 'di']
    const cantidades = Object.values(contador);  // [3, 2, 4, 3, 2]

    // 3 — devolvemos el objeto para ECharts
    return {
      xAxis: { data: agentes },
      yAxis: {},
      series: [{ type: 'bar', data: cantidades }]
    };
  }

  // Público vs privado
  getProporcionVisibilidad() {
    const publicos = MOCK_MESSAGES.filter(m => m.visibility === 'public').length;
    const privados = MOCK_MESSAGES.filter(m => m.visibility === 'private').length;

    // ECharts para donut espera un array de { name, value }
    return {
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],  // donut
        data: [
          { name: 'Público', value: publicos },
          { name: 'Privado', value: privados }
        ]
      }]
    };
  }
}
