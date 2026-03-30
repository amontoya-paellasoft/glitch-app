export interface MessageInterface {
  id: number
  agentId: string
  text: string
  code?: string
  isUser: boolean
  timeStamp: Date
}
