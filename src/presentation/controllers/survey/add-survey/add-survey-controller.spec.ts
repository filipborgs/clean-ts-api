import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation, AddSurvey, AddSurveyParams } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
describe('AddSurveyController', () => {
  interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
  }

  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error | undefined {
        return undefined
      }
    }
    return new ValidationStub()
  }

  const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (data: AddSurveyParams): Promise<void> {}
    }
    return new AddSurveyStub()
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const validationStub = makeValidationStub()
    const addSurveyStub = makeAddSurveyStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
      sut,
      validationStub,
      addSurveyStub
    }
  }

  const makeFakeRequest = (): HttpRequest => ({
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })

  it('Should return 500 if Validate thorws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error('any_error') })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  it('Should retuns 204 if succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey thorws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => { throw new Error('any_error') })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
