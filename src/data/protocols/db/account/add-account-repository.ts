import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/use-cases'

export interface AddAccountRepository {
  add: (data: AddAccountParams) => Promise<AccountModel>
}
