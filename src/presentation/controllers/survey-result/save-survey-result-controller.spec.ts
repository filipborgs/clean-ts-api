import { HttpRequest, LoadSurveyById, SaveSurveyResultModel, SurveyModel, SurveyResultModel } from '../login/singup/singup-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SaveSurveyResult } from './save-survey-result-controller-protocols'

describe('SaveSurveyResultController', () => {
  const makeSaveSurveyResultStub = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
      async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        return null as any
      }
    }

    return new SaveSurveyResultStub()
  }

  const makeLoadSurveyByIdStub = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
      async loadById (): Promise<SurveyModel| null> {
        return makeFakeSurvey()
      }
    }
    return new LoadSurveyByIdStub()
  }

  const makeFakeSurvey = (): SurveyModel => (
    {
      id: 'any_id',
      question: 'anu_question',
      date: new Date(),
      answers: []
    }
  )

  interface SutTypes {
    sut: SaveSurveyResultController
    saveSurveyResultStub: SaveSurveyResult
    loadSurveyByIdStub: LoadSurveyById
  }

  const makeSut = (): SutTypes => {
    const saveSurveyResultStub = makeSaveSurveyResultStub()
    const loadSurveyByIdStub = makeLoadSurveyByIdStub()

    const sut = new SaveSurveyResultController(saveSurveyResultStub, loadSurveyByIdStub)
    return {
      sut,
      saveSurveyResultStub,
      loadSurveyByIdStub
    }
  }

  const makeFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
    }
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const params = makeFakeRequest()
    await sut.handle(params)
    expect(loadSpy).toHaveBeenCalledWith(params.params.surveyId)
  })
})
