import { HttpRequest, LoadSurveyById, SaveSurveyResultModel, SurveyModel, SurveyResultModel } from '../login/singup/singup-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, InvalidParamError, SaveSurveyResult, serverError } from './save-survey-result-controller-protocols'

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
      answers: [{
        answer: 'valid_answer'
      }]
    }
  )

  interface SutTypes {
    sut: SaveSurveyResultController
    saveSurveyResultStub: SaveSurveyResult
    loadSurveyByIdStub: LoadSurveyById
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
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
    },
    body: {
      answer: 'valid_answer'
    },
    accountId: 'any_id'
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const params = makeFakeRequest()
    await sut.handle(params)
    expect(loadSpy).toHaveBeenCalledWith(params.params.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const error = new Error('error')
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementation(() => { throw error })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(error))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      ...makeFakeRequest(),
      body: {
        answer: 'wrong_value'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const params = makeFakeRequest()
    await sut.handle(params)
    const { params: { surveyId }, body: { answer }, accountId } = params
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId,
      answer,
      date: new Date(),
      accountId
    })
  })
})
