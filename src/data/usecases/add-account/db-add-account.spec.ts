import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  it('should call encrypt with correct values', async () => {
    class EncryptStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return 'hashed_value'
      }
    }

    const encryptStub = new EncryptStub()
    const sut = new DbAddAccount(encryptStub)
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)

    expect(encryptSpy).toBeCalledWith(accountData.password)
  })
})
