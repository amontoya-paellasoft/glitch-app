import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat-service';
import { SimulationService } from '../../services/simulation-service';
import { TareaService } from '../../services/tarea-service';
import { MessageInterface } from '../../models/message-interface';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [DatePipe, UpperCasePipe, FormsModule, TranslateModule, TranslatePipe
  ],
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnChanges {
  @Input() agentId: string = '';
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('inputRef') private inputRef!: ElementRef;

  private chatSvc = inject(ChatService);
  private simulationSvc = inject(SimulationService);
  private cdr = inject(ChangeDetectorRef);
  tareaServ = inject(TareaService);

  messages: MessageInterface[] = [];
  userInput: string = '';
  filtro: 'todo' | 'pub' | 'priv' = 'todo';

  ngOnInit(): void {
    this.chatSvc.conversaciones$.subscribe(() => {
      this.filtrarMensajes();
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agentId']) {
      this.filtro = 'todo';
      this.filtrarMensajes();
    }
  }

  setFiltro(filtro: 'todo' | 'pub' | 'priv'): void {
    this.filtro = filtro;
    this.filtrarMensajes();
  }

  sendUserMessage(): void {
    const text = this.userInput.trim();

    if (!text) return;

    this.userInput = '';
    this.simulationSvc.enviarMensajeUsuario(text, this.agentId || 'general');
    this.inputRef.nativeElement.focus();
  }

  private filtrarMensajes(): void {
    if (!this.agentId) {
      this.messages = this.chatSvc.getMensajesPublicos();
    } else {
      const todos = this.chatSvc.getMensajesDeAgente(this.agentId);
      if (this.filtro === 'pub') {
        this.messages = todos.filter((m) => m.visibility === 'public');
      } else if (this.filtro === 'priv') {
        this.messages = todos.filter((m) => m.visibility === 'private');
      } else {
        this.messages = todos;
      }
    }

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      } catch {}
    }, 10);
  }

  isEscribiendo(): boolean {
    return this.chatSvc.mensajeActivo() !== null;
  }
}
