import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class LogMongoErrorRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errors = await MongoHelper.getCollection('errors')
    await errors.insertOne({
      stack
    })
  }
}
