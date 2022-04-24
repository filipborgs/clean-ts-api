import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (data: AddAccountModel): Promise<AccountModel> {
    void await this.encrypter.encrypt(data.password)
    return { id: 'null', ...data }
  }
}
