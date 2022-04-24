import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (data: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    const account = await this.addAccountRepository.add(Object.assign({}, data, { password: hashedPassword }))
    return account
  }
}
