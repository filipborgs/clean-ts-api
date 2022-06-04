import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmail: LoadAccountByEmailRepository) {}

  async login (authentication: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmail.load(authentication.email)
    return null
  }
}
