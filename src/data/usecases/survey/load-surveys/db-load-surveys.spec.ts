import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

describe('DbLoadSurveys', () => {
  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveyRepositoryStub: LoadSurveysRepository
  }

  const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return null as any
      }
    }
    return new LoadSurveysRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const loadSurveyRepositoryStub = makeLoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
    return {
      sut,
      loadSurveyRepositoryStub
    }
  }
  test('Should calls LoadSurveysRepository with no values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'load')
    await sut.load()
    expect(loadSpy).toBeCalledWith()
  })
})
