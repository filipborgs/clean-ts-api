import { ServerError } from '../erros/server-error'
import { HttpResponse } from '../protocols/http'

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const noContent = (): HttpResponse => ({ statusCode: 204 })

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
