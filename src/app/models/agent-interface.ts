export interface AgentInterface {
  id: string
  name: string
  role: string
  emoji: string
  status: 'en línea' | 'ocupado' | 'ausente'
  bg: string
}
