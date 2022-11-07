import { Router } from 'express'
import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { makeAddSurveyController } from '@/main/factories/presentation/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '@/main/factories/presentation/controllers/survey/load-surveys/load-surveys-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
