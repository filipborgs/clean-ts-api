import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'
import { mockLoadSurveyById } from '@/presentation/test'
import { mockLoadSurveyResult } from '@/presentation/test/mock-survey-result'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { forbidden, HttpRequest, InvalidParamError, LoadSurveyById, ok, serverError } from './load-survey-result-controller-protocols'

describe('LoadSurveyResultController', () => {
  interface SutTypes {
    sut: LoadSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    loadSurveyResultStub: LoadSurveyResult
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyResultStub = mockLoadSurveyResult()
    const loadSurveyByIdStub = mockLoadSurveyById()

    const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
    return {
      sut,
      loadSurveyResultStub,
      loadSurveyByIdStub
    }
  }

  const mockFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
    },
    accountId: 'any_id'
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const params = mockFakeRequest()
    await sut.handle(params)
    expect(loadSpy).toHaveBeenCalledWith(params.params.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementation(mockThrowError)
    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(serverError(throwError))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const params = mockFakeRequest()
    await sut.handle(params)
    expect(loadSpy).toHaveBeenCalledWith(params.params.surveyId)
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const error = new Error('error')
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementation(mockThrowError)
    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(serverError(error))
  })

  test('Should return 200 on sucess', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockFakeRequest())
    const surveyResult = mockSurveyResultModel()
    expect(response).toEqual(ok({
      surveyResult
    }))
  })
})
