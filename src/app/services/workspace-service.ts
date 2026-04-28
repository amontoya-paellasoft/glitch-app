import { Injectable, signal } from '@angular/core';
import { BuildRunLogDTO } from '../models/altorium/build-dto';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  public ventanasAbiertas = signal<string[]>([]);

  agentSelec = signal<string | null>(null);

  seleccionar(agentId: string): void {
    this.agentSelec.update((actual) => (actual === agentId ? null : agentId));
  }

  abrir({ agentId }: { agentId: string }) {
    if (!this.ventanasAbiertas().includes(agentId)) {
      this.ventanasAbiertas.update((ids) => [...ids, agentId]);
    }
  }

  cerrar(agentId: string) {
    this.ventanasAbiertas.update((ids) => ids.filter((id) => id !== agentId));
  }

  focus(agentId: string) {
    this.ventanasAbiertas.update((ids) => {
      if (!ids.includes(agentId)) return ids;
      const filtrados = ids.filter((id) => id !== agentId);
      return [...filtrados, agentId];
    });
  }

  cerrarPanel(): void {
    this.agentSelec.set(null);
  }

  cerrarTodas() {
    this.cerrarPanel();
    this.ventanasAbiertas.set([]);
  }

  reiniciar(): void {
    this.cerrarTodas();
    this.cerrarPanel();
    this.abrir({ agentId: '' });
  }

  // ECHARTS
  statsAbierto = signal<boolean>(false);

  abrirStats(): void {
    this.statsAbierto.set(true);
  }

  cerrarStats(): void {
    this.statsAbierto.set(false);
  }

  // LOG PANEL
  logPanelTab = signal<'stdout' | 'stderr' | null>(null);
  logData = signal<BuildRunLogDTO | null>(null);

  abrirLogPanel(tab: 'stdout' | 'stderr', data: BuildRunLogDTO): void {
    this.logData.set(data);
    this.logPanelTab.set(tab);
  }

  cerrarLogPanel(): void {
    this.logPanelTab.set(null);
  }
}
