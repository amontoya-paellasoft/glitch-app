import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MOCK_AGENTS, MOCK_MESSAGES } from '../../mock/mock-data';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat-service';


@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [DatePipe, UpperCasePipe],
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnChanges {
  @Input() agentId: string = '';

  private chatServ : ChatService = inject(ChatService);

  allMessages: any[] = [];
  messagesAgent: any[] = [];

  ngOnInit() {
    this.chatServ.messages$.subscribe(m => {
      this.allMessages = m;
      this.filterMessages();
    })
  }

ngOnChanges(changes: SimpleChanges) {
    if (changes['agentId']) {
      this.filterMessages();
    }
  }

  private filterMessages() {
    if (this.agentId) {
      // Modo ventana (idAgente)
      this.messagesAgent = this.allMessages.filter(m => m.agentId === this.agentId);
    } else {
      // Modo panel general
      this.messagesAgent = [...this.allMessages];
    }
  }
}
