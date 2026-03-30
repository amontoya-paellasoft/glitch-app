import { Component } from '@angular/core';
import { MOCK_AGENTS, MOCK_MESSAGES } from '../../mock/mock-data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [DatePipe],
  styleUrl: './chat.css'
})
export class Chat {
  messages = MOCK_MESSAGES.map(m => ({ id: m.id,
    agentId: m.agentId, text: m.text, timestamp: m.timeStamp
  }));

agentsMap = new Map(
  MOCK_AGENTS.map(a => [a.id, a])
);

}
