import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAddSurvey, mockValidation } from '@/presentation/test'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, HttpRequest, Validation } from './add-survey-protocols'
describe('AddSurveyController', () => {
  interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const validationStub = mockValidation()
    const addSurveyStub = mockAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
      sut,
      validationStub,
      addSurveyStub
    }
  }

  const mockFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  })

  it('Should call Validate with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })

  it('Should return 500 if Validate thorws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(mockThrowError)
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(throwError))
  })

  it('Should retuns 204 if succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey thorws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(mockThrowError)
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(throwError))
  })
})
