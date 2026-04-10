import { Component, inject, Input, OnInit, ElementRef } from '@angular/core';
import { Chat } from '../chat/chat';
import { WorkspaceService } from '../../services/workspace-service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-floating-window',
  imports: [Chat, DragDropModule],
  standalone: true,
  templateUrl: './floating-window.html',
  styleUrl: './floating-window.css',
})
export class FloatingWindow implements OnInit {
  @Input() agentId!: string;
  ws = inject(WorkspaceService);
  private el = inject(ElementRef);

  get esGeneral(): boolean {
    return this.agentId === '';
  }

  ngOnInit(): void {
    // Añade la clase al :host según el tipo de ventana
    this.el.nativeElement.classList.add(
      this.esGeneral ? 'general' : 'privada'
    );
  }
}
