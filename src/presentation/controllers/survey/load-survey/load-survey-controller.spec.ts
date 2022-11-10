import { LoadSurveyController } from './load-survey-controller'
import {
  LoadSurvey,
  SurveyModel,
  serverError, ok, noContent
} from './load-survey-protocols'

describe('LoadSurveyController', () => {
  const mockLoadSurveyStub = (): LoadSurvey => {
    class LoadSurveyStub implements LoadSurvey {
      async load (): Promise<SurveyModel[] | null> {
        return mockFakeSurveys()
      }
    }
    return new LoadSurveyStub()
  }

  const mockFakeSurveys = (): SurveyModel[] => ([
    {
      id: 'any_id',
      question: 'anu_question',
      date: new Date(),
      answers: []
    }
  ])

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurvey = mockLoadSurveyStub()
    const sut = new LoadSurveyController(loadSurvey)
    return {
      loadSurvey,
      sut
    }
  }

  interface SutTypes {
    loadSurvey: LoadSurvey
    sut: LoadSurveyController
  }

  test('Should call LoadSurvey with no values', async () => {
    const { sut, loadSurvey } = makeSut()
    const loadSpy = jest.spyOn(loadSurvey, 'load')
    await sut.handle()
    expect(loadSpy).toBeCalledWith()
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurvey } = makeSut()
    const error = new Error('error')
    jest.spyOn(loadSurvey, 'load').mockImplementation(() => { throw error })
    const response = await sut.handle()
    expect(response).toEqual(serverError(error))
  })

  test('Should return 200 on sucess', async () => {
    const { sut } = makeSut()
    const response = await sut.handle()
    const surveys = mockFakeSurveys()
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
