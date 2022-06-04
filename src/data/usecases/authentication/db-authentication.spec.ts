import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
        return account
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeSut = (): any => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
      sut, loadAccountByEmailRepositoryStub
    }
  }
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.login({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
