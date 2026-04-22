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
  input,
  DestroyRef,
  effect,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat-service';
import { SimulationService } from '../../services/simulation-service';
import { TareaService } from '../../services/tarea-service';
import { MessageInterface } from '../../models/message-interface';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [DatePipe, FormsModule, TranslateModule, TranslatePipe],
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  agentId = input<string>(''); // funciona mejor con signal, pero no se actualiza al cambiar el input desde afuera, así que lo dejo como string normal  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('inputRef') private inputRef!: ElementRef;
  private chatSvc = inject(ChatService);
  private simulationSvc = inject(SimulationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  tareaServ = inject(TareaService);

  messages: MessageInterface[] = [];
  userInput: string = '';
  filtro: 'todo' | 'pub' | 'priv' = 'todo';

  constructor() {
    effect(() => {
      this.agentId(); // trackeo el cambio del agentId para resetear el filtro
      this.filtro = 'todo';
      this.filtrarMensajes();
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.chatSvc.conversaciones$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  setFiltro(filtro: 'todo' | 'pub' | 'priv'): void {
    this.filtro = filtro;
    this.filtrarMensajes();
  }

  sendUserMessage(): void {
    const text = this.userInput.trim();

    if (!text) return;

    this.userInput = '';
    this.simulationSvc.enviarMensajeUsuario(text, this.agentId() || 'general');
    this.inputRef.nativeElement.focus();
  }

  private filtrarMensajes(): void {
    if (!this.agentId()) {
      this.messages = this.chatSvc.getMensajesPublicos();
    } else {
      const todos = this.chatSvc.getMensajesDeAgente(this.agentId());
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

  hayMensajesEnCurso(): boolean {
    return this.chatSvc.mensajeActivo() !== null;
  }
}
