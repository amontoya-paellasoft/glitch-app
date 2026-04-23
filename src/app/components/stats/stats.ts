import { Component, inject, OnInit } from '@angular/core';
import { Periodo, StatsService } from '../../services/stats-service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  imports: [NgxEchartsDirective, DragDropModule, TranslatePipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {
  private statsServ: StatsService = inject(StatsService);
  private chatServ: ChatService = inject(ChatService);
  ws = inject(WorkspaceService);

  // Tipos inferidos del servicio; siempre inicializados antes del primer render por ngOnInit
  configBarras!: ReturnType<StatsService['getActividadPorAgente']>;
  configDonut!: ReturnType<StatsService['getProporcionVisibilidad']>;

  ngOnInit(): void {
    this.recalcular();
    this.chatServ.conversaciones$.subscribe(() => this.recalcular());
  }

  onPeriodoChange(event: Event): void {
    this.cambiarPeriodo((event.target as HTMLSelectElement).value as Periodo);
  }

  cambiarPeriodo(nuevoPeriodo: Periodo): void {
    this.statsServ.periodoActual = nuevoPeriodo;
    this.recalcular();
  }

  private recalcular(): void {
    this.configBarras = this.statsServ.getActividadPorAgente();
    this.configDonut = this.statsServ.getProporcionVisibilidad();
  }
}
