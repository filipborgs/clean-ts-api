import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeLoginController } from '@/main/factories/presentation/controllers/login/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/presentation/controllers/login/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
