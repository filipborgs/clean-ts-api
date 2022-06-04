import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async login (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmail.load(authentication.email)
    if (!account) return null

    const isEqual = await this.hashCompare.compare(authentication.password, account.password)
    if (!isEqual) return null

    const token = await this.tokenGenerator.generate(account.id)
    await this.updateAccessToken.update(account.id, token)
    return token
  }
}
