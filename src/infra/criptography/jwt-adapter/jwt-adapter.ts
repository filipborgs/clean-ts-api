import { sign, verify } from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { TokenGenerator } from '../../../data/protocols/criptography/token-generator'

export class JwtAdapter implements TokenGenerator, Decrypter {
  constructor (private readonly secret: string) {}

  async generate (id: string): Promise<string> {
    const token = await sign({ id }, this.secret)
    return token
  }

  async decrypt (token: string): Promise<string | null> {
    const value: any = await verify(token, this.secret)
    return value
  }
}
