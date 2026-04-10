export interface UsersInterfaces {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  firstName: string
  lastName: string
  age: number
  username: string
  image: string
}
