import { Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private chatSvc = inject(ChatService);

  allMessages: any[] = [];
  messagesAgent: any[] = [];

  ngOnInit(): void {
    this.chatSvc.mensajes$.subscribe(msgs => {
      this.allMessages = msgs;
      this.filterMessages();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agentId']) {
      this.filterMessages();
    }
  }

  private filterMessages(): void {
    this.messagesAgent = this.agentId
      ? this.allMessages.filter(m => m.agentId === this.agentId)
      : [...this.allMessages];

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        const div = this.scrollContainer.nativeElement;
        div.scrollTop = div.scrollHeight;
      } catch {}
    }, 10);
  }
}
