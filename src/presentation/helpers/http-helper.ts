import { ServerError } from '../erros'
import { HttpResponse } from '../protocols'

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const noConetent = (): HttpResponse => ({
  statusCode: 204
})

export const noContent = (): HttpResponse => ({ statusCode: 204 })

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
