import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'

describe('DbAddSurvey UseCase', () => {
  interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = mockAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
      sut,
      addSurveyRepositoryStub
    }
  }

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const data = mockAddSurveyParams()
    await sut.add(data)
    expect(addSpy).toBeCalledWith(data)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(mockThrowError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow(throwError)
  })
})
