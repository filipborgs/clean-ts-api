import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', () => {
  let accountCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('should return an account on add sucess', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('any_password')
  })

  it('should return an account on loadByEmail sucess', async () => {
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email')
    expect(account?.password).toBe('any_password')
  })
})
