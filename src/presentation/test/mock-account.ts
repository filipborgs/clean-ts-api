import { AccountModel } from '@/domain/models'
import { AutenticationModel } from '@/domain/models/autentication'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/use-cases'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: 'valid_id',
        name: account.name,
        email: account.email,
        password: account.password
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async login (authentication: AuthenticationParams): Promise<AutenticationModel | null> {
      return mockAuthenticationModel()
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (email: string): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }

  return new LoadAccountByTokenStub()
}
