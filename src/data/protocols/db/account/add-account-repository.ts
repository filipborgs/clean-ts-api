import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/use-cases'

export interface AddAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountModel>
}
