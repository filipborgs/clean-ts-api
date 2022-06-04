import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (data: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(data.password)
    const account = await this.addAccountRepository.add(Object.assign({}, data, { password: hashedPassword }))
    return account
  }
}
