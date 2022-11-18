import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbSaveSurveyResult } from '@/main/factories/data/usecases/survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/data/usecases/survey/db-load-survey-by-id-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbSaveSurveyResult(), makeDbLoadSurveyById())
  return new LogControllerDecorator(saveSurveyResultController, new LogMongoErrorRepository())
}
