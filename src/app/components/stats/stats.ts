import { Component, inject, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats-service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkspaceService } from '../../services/workspace-service';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-stats',
  imports: [NgxEchartsDirective, DragDropModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {
  private statsServ: StatsService = inject(StatsService);
  private chatServ: ChatService  = inject(ChatService);
  ws = inject(WorkspaceService);

  configBarras: any = {};
  configDonut:  any = {};

  ngOnInit(): void {
    // Recalcula cada vez que llega un mensaje nuevo
    this.chatServ.conversaciones$.subscribe(() => {
      this.configBarras = this.statsServ.getActividadPorAgente();
      this.configDonut  = this.statsServ.getProporcionVisibilidad();
    });
  }
}
