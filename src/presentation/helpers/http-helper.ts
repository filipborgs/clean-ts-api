import { ServerError } from '../erros/server-error'
import { HttpResponse } from '../protocols/http'

export const noContent = (): HttpResponse => {
  return {
    statusCode: 204
  }
}

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
