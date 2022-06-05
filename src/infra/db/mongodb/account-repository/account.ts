import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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
}
