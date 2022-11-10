import { AccountModel } from '@/domain/models'

export interface AddAccountParams {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (data: AddAccountParams) => Promise<AccountModel | null>
}
