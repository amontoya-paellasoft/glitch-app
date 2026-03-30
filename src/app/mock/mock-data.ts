import { AgentInterface } from "../models/agent-interface";
import { MessageInterface } from "../models/message-interface";

export const MOCK_AGENTS: AgentInterface[] = [
  { id: 'A-ID', name: 'A-Name', role: 'A-Role', emoji: '🏛️', status: 'ocupado', bg: 'pink' },
  { id: 'B-ID', name: 'B-Name', role: 'B-Role', emoji: '🔍', status: 'en línea', bg: 'pink' },
  { id: 'C-ID', name: 'C-Name', role: 'C-Role', emoji: '✨', status: 'ausente', bg: 'pink' },
  { id: 'D-ID', name: 'D-Name', role: 'D-Role', emoji: '🧪', status: 'ocupado', bg: 'pink' },
  { id: 'E-ID', name: 'E-Name', role: 'E-Role', emoji: '🦄', status: 'en línea', bg: 'pink' },
];

export const MOCK_MESSAGES: MessageInterface[] = [
  { id: 1, agentId: 'A-ID', text: 'Soy el mensaje 1', code: 'Code1', isUser: false, timeStamp: new Date() },
  { id: 2, agentId: 'B-ID', text: 'Soy el mensaje 2', code: 'Code2', isUser: true, timeStamp: new Date() },
  { id: 3, agentId: 'C-ID', text: 'Soy el mensaje 3 sin código', isUser: false, timeStamp: new Date() },
  { id: 4, agentId: 'E-ID', text: 'Soy el mensaje 4', code: 'Code3', isUser: true, timeStamp: new Date() }
];

export const MOCK_LINKS = [
  { source: 'A-ID', target: 'B-ID', label: 'enseña' },
  { source: 'B-ID', target: 'C-ID', label: 'diseña' },
  { source: 'C-ID', target: 'D-ID', label: 'llama' },
  { source: 'D-ID', target: 'E-ID', label: 'apoya' },
  { source: 'E-ID', target: 'C-ID', label: 'instruye' },
];
