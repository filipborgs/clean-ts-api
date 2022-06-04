import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async login (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmail.load(authentication.email)
    if (!account) return null
    this.hashCompare.compare(authentication.password, account.password)
    return null
  }
}
