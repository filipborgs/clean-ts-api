import { DbLoadSurveysById } from './load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './load-survey-by-id-protocols'

describe('DbLoadSurveysById', () => {
  interface SutTypes {
    sut: DbLoadSurveysById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
      async loadById (id: string): Promise<SurveyModel> {
        return makeFakeSurvey()
      }
    }
    return new LoadSurveyByIdRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
    const sut = new DbLoadSurveysById(loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadSurveyByIdRepositoryStub
    }
  }

  const makeFakeSurvey = (): SurveyModel => (
    {
      id: 'any_id',
      question: 'anu_question',
      date: new Date(),
      answers: []
    }
  )

  const makeFakeParams = (): string => ('any_id')

  test('Should calls LoadSurveyByIdRepository with id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const params = makeFakeParams()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(params)
    expect(loadSpy).toBeCalledWith(params)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const error = new Error('any_error')
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw error })
    await expect(sut.loadById('id')).rejects.toThrow(error)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })
})