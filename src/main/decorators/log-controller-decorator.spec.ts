import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/test'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok('any_body')
  }
}

const mockController = (): ControllerStub => {
  const controllerStub = new ControllerStub()
  return controllerStub
}

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: ControllerStub
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}
describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: 'any_body'
    }
    await sut.handle(httpRequest)
    expect(controllerStubSpy).toBeCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: 'any_body'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok('any_body'))
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const serverErrorMock = serverError(new Error())
    jest.spyOn(controllerStub, 'handle').mockResolvedValue(serverErrorMock)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest: HttpRequest = {
      body: 'any_body'
    }
    await sut.handle(httpRequest)
    expect(logSpy).toBeCalledWith(serverErrorMock.body.stack)
  })
})
