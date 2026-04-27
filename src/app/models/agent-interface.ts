export interface AgentMockInterface {
  id: string
  userId: number   // links to UserDTO (MOCK_USERS)
  role: string
  emoji: string
  status: 'en línea' | 'ocupado' | 'ausente'
  bg: string
}
