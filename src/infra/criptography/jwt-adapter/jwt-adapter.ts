import { sign } from 'jsonwebtoken'
import { TokenGenerator } from '../../../data/protocols/criptography/token-generator'

export class JwtAdapter implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generate (id: string): Promise<string> {
    const token = await sign({ id }, this.secret)
    return token
  }
}
