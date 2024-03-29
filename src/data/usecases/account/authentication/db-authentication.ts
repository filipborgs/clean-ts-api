import {
  AuthenticationParams,
  Authentication,
  HashCompare,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async login (authentication: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByEmail.loadByEmail(authentication.email)
    if (!account) return null

    const isEqual = await this.hashCompare.compare(authentication.password, account.password)
    if (!isEqual) return null

    const token = await this.tokenGenerator.generate(account.id)
    await this.updateAccessToken.updateAccessToken(account.id, token)
    return token
  }
}
