import { ObjectId } from 'mongodb'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/index'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...data })
    return MongoHelper.mapInserted(data, insertedId)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: { accessToken: token }
    })
  }
}
