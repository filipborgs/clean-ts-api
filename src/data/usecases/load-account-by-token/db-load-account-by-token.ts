import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account'
import { AccountModel, LoadAccountByToken } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const id = await this.decrypter.decrypt(accessToken)
    if (!id) return null
    await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
  }
}
