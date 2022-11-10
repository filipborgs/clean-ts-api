import { mockSurveysModel } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { mockLoadSurveys } from '@/presentation/test'
import { LoadSurveysController } from './load-surveys-controller'
import {
  LoadSurveys, noContent, ok, serverError
} from './load-surveys-protocols'

describe('LoadSurveyController', () => {
  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurvey = mockLoadSurveys()
    const sut = new LoadSurveysController(loadSurvey)
    return {
      loadSurvey,
      sut
    }
  }

  interface SutTypes {
    loadSurvey: LoadSurveys
    sut: LoadSurveysController
  }

  test('Should call LoadSurvey with no values', async () => {
    const { sut, loadSurvey } = makeSut()
    const loadSpy = jest.spyOn(loadSurvey, 'load')
    await sut.handle()
    expect(loadSpy).toBeCalledWith()
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurvey } = makeSut()
    jest.spyOn(loadSurvey, 'load').mockImplementation(mockThrowError)
    const response = await sut.handle()
    expect(response).toEqual(serverError(throwError))
  })

  test('Should return 200 on sucess', async () => {
    const { sut } = makeSut()
    const response = await sut.handle()
    const surveys = mockSurveysModel()
    expect(response).toEqual(ok({
      surveys
    }))
  })

  test('Should return 204 on sucess if has no surveys', async () => {
    const { sut, loadSurvey } = makeSut()
    jest.spyOn(loadSurvey, 'load').mockResolvedValueOnce([])
    let response = await sut.handle()
    expect(response).toEqual(noContent())

    jest.spyOn(loadSurvey, 'load').mockResolvedValueOnce(null)
    response = await sut.handle()
    expect(response).toEqual(noContent())
  })
})
