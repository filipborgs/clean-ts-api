import { AccountModel } from '../models'

export interface LoadAccountByToken {
  loadByToken: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
