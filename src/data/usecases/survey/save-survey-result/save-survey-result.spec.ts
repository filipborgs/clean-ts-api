import { DbSaveSurveyResult } from './save-survey-result'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './save-survey-result-protocols'

describe('DbSaveSurveyResult UseCase', () => {
  interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  }

  const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        return makeFakeSurveyResult()
      }
    }
    return new SaveSurveyResultRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
      sut,
      saveSurveyResultRepositoryStub
    }
  }

  const makeFakeSurveyResult = (): SurveyResultModel => (
    {
      id: 'any_id',
      accountId: 'any_id',
      surveyId: 'any_id',
      date: new Date(),
      answer: 'any_answer'
    }
  )

  const makeFakeData = (): SaveSurveyResultModel => ({
    accountId: 'any_id',
    surveyId: 'any_id',
    date: new Date(),
    answer: 'any_answer'
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const data = makeFakeData()
    await sut.save(data)
    expect(saveSpy).toBeCalledWith(data)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const error = new Error('error')
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => { throw error })
    const promise = sut.save(makeFakeData())
    await expect(promise).rejects.toThrow(error)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const survey = await sut.save(makeFakeData())
    expect(survey).toEqual(makeFakeSurveyResult())
  })
})
