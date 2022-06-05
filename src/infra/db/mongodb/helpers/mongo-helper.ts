import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.topology.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mapInserted (collection: any, id: any) {
    return {
      ...collection,
      id: id.toString()
    }
  },

  map (collection: any) {
    if (collection) {
      const { _id, ...data } = collection
      return {
        ...data,
        id: _id.toString()
      }
    }
    return null
  }

}
