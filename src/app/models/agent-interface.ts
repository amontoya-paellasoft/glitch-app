export interface AgentMockInterface {
  id: string
  dummyUserId: number
  name: string
  role: string
  emoji: string
  status: 'en línea' | 'ocupado' | 'ausente'
  bg: string
}


export interface RespuestaDummyApi {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  firstName: string
  lastName: string
  image: string
  company: {
    department: string
    title: string
  }
}
