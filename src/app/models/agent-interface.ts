export interface AgentMockInterface {
  id: string
  userId: number   // links to UserDTO (MOCK_USERS)
  name: string
  role: string
  emoji: string
  status: 'en línea' | 'ocupado' | 'ausente'
  bg: string
}
