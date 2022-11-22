import { AutenticationModel } from '@/domain/models/autentication'

export interface AuthenticationParams {
  email: string
  password: string
}
export interface Authentication {
  login: (authentication: AuthenticationParams) => Promise<AutenticationModel | null>
}
