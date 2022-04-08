import { AccountModel } from '../../../domain/models'
import { AddAccount, AddAccountModel } from '../../../domain/use-cases'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (data: AddAccountModel): Promise<AccountModel> {
    void await this.encrypter.encrypt(data.password)
    return { id: 'null', ...data }
  }
}
