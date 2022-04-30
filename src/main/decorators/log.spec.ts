import { ok } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok('any_body')
  }
}

const makeController = (): ControllerStub => {
  const controllerStub = new ControllerStub()
  return controllerStub
}

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: ControllerStub
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut, controllerStub
  }
}
describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: 'valid_body'
    }
    await sut.handle(httpRequest)
    expect(controllerStubSpy).toBeCalledWith(httpRequest)
  })
})
