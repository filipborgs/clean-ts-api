import { AddAccount, LoadAccountByEmailRepository, AddAccountParams, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadByEmail: LoadAccountByEmailRepository
  ) {}

  async add (data: AddAccountParams): Promise<AccountModel | null> {
    const existsAccount = await this.loadByEmail.loadByEmail(data.email)
    if (existsAccount) return null
    const hashedPassword = await this.hasher.hash(data.password)
    const account = await this.addAccountRepository.add(Object.assign({}, data, { password: hashedPassword }))
    return account
  }
}
