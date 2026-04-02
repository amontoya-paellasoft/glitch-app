import {
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
  signal,
  computed,
  effect
} from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [DatePipe, UpperCasePipe],
  styleUrl: './chat.css'
})
export class Chat {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private chatSvc = inject(ChatService);

  private agentIdSig = signal<string>('');

  @Input() set agentId(value: string) {
    this.agentIdSig.set(value);
  }

  messagesAgent = computed(() => {
    const msgs = this.chatSvc.mensajes();
    const agentId = this.agentIdSig();

    return agentId
      ? msgs.filter(m => m.agentId === agentId)
      : msgs;
  });

  constructor() {
    effect(() => {
      this.messagesAgent();

      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  private scrollToBottom(): void {
    try {
      const div = this.scrollContainer?.nativeElement;
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    } catch {}
  }
}
