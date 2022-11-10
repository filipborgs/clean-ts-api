import { DbSaveSurveyResult } from './save-survey-result'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './save-survey-result-protocols'

describe('DbSaveSurveyResult UseCase', () => {
  interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  }

  const mockSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return mockFakeSurveyResult()
      }
    }
    return new SaveSurveyResultRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepositoryStub()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
      sut,
      saveSurveyResultRepositoryStub
    }
  }

  const mockFakeSurveyResult = (): SurveyResultModel => (
    {
      id: 'any_id',
      accountId: 'any_id',
      surveyId: 'any_id',
      date: new Date(),
      answer: 'any_answer'
    }
  )

  const mockFakeData = (): SaveSurveyResultParams => ({
    accountId: 'any_id',
    surveyId: 'any_id',
    date: new Date(),
    answer: 'any_answer'
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const data = mockFakeData()
    await sut.save(data)
    expect(saveSpy).toBeCalledWith(data)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const error = new Error('error')
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => { throw error })
    const promise = sut.save(mockFakeData())
    await expect(promise).rejects.toThrow(error)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const survey = await sut.save(mockFakeData())
    expect(survey).toEqual(mockFakeSurveyResult())
  })
})
