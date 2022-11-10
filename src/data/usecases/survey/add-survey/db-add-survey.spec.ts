import { DbAddSurvey } from './db-add-survey'
import { AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'

describe('DbAddSurvey UseCase', () => {
  interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (data: AddSurveyParams): Promise<void> { }
    }
    return new AddSurveyRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
      sut,
      addSurveyRepositoryStub
    }
  }

  const makeFakeData = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const data = makeFakeData()
    await sut.add(data)
    expect(addSpy).toBeCalledWith(data)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error('any_error') })
    const promise = sut.add(makeFakeData())
    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
