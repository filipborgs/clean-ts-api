import { Router } from 'express'
import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { makeSaveSurveyResultController } from '../factories/presentation/controllers/survey-result/save-survey-result-controller'

export default (router: Router): void => {
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
