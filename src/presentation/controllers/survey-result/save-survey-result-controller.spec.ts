import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { mockLoadSurveyById } from '@/presentation/test'
import { mockSaveSurveyResult } from '@/presentation/test/mock-survey-result'
import { HttpRequest, LoadSurveyById } from '../login/singup/singup-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, InvalidParamError, ok, SaveSurveyResult, serverError } from './save-survey-result-controller-protocols'

describe('SaveSurveyResultController', () => {
  interface SutTypes {
    sut: SaveSurveyResultController
    saveSurveyResultStub: SaveSurveyResult
    loadSurveyByIdStub: LoadSurveyById
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const saveSurveyResultStub = mockSaveSurveyResult()
    const loadSurveyByIdStub = mockLoadSurveyById()

    const sut = new SaveSurveyResultController(saveSurveyResultStub, loadSurveyByIdStub)
    return {
      sut,
      saveSurveyResultStub,
      loadSurveyByIdStub
    }
  }

  const mockFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'any_answer'
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

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      ...mockFakeRequest(),
      body: {
        answer: 'wrong_value'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const params = mockFakeRequest()
    await sut.handle(params)
    const { params: { surveyId }, body: { answer }, accountId } = params
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId,
      answer,
      date: new Date(),
      accountId
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const error = new Error('error')
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementation(mockThrowError)
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
