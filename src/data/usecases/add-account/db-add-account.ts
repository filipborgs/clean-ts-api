import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (data: AddAccountModel): Promise<AccountModel> {
    const password = await this.encrypter.encrypt(data.password)
    const account = await this.addAccountRepository.add({
      name: data.name,
      email: data.email,
      password
    })
    return account
  }
}
