import { DbAuthentication } from "../../../../data/usecases/authentication/db-authentication"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../../infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"
import env from "../../../config/env"

export const makeDbAuthentication = ()=>{
    const accountMongoRepository = new AccountMongoRepository()
    const bcryptAdapter = new BcryptAdapter(12)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}