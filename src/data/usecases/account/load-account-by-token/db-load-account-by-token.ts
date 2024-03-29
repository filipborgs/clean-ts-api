import {
  Decrypter, LoadAccountByTokenRepository,
  AccountModel, LoadAccountByToken
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const id = await this.decrypter.decrypt(accessToken)
    if (id) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) return account
    }
    return null
  }
}
