import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

describe('DbLoadSurveys', () => {
  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveyRepositoryStub: LoadSurveysRepository
  }

  const mockLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return mockFakeSurveys()
      }
    }
    return new LoadSurveysRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyRepositoryStub = mockLoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
    return {
      sut,
      loadSurveyRepositoryStub
    }
  }

  const mockFakeSurveys = (): SurveyModel[] => ([
    {
      id: 'any_id',
      question: 'anu_question',
      date: new Date(),
      answers: []
    }
  ])

  test('Should calls LoadSurveysRepository with no values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'load')
    await sut.load()
    expect(loadSpy).toBeCalledWith()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const error = new Error('any_error')
    jest.spyOn(loadSurveyRepositoryStub, 'load').mockImplementationOnce(() => { throw error })
    await expect(sut.load()).rejects.toThrow(error)
  })

  test('Should return corret values on sucess', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockFakeSurveys())
  })
})
