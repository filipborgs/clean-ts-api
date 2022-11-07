import { Hasher } from '@/data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import { HashCompare } from '@/data/protocols/criptography/hash-compare'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(value, hash)
    return isEqual
  }
}
