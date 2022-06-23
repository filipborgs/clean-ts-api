import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel, LoadAccountByToken } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}
  async loadByToken (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const id = await this.decrypter.decrypt(accessToken)
    if (!id) return null
  }
}
