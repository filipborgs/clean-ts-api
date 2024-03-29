import { NextFunction, Request, Response } from 'express'
import { HttpRequest } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

export const adaptMiddleware = (middleware: Middleware) => async (req: Request, res: Response, next: NextFunction) => {
  const httpRequest: HttpRequest = {
    headers: req.headers,
    body: req.body
  }
  const httpResponse = await middleware.handle(httpRequest)
  if (httpResponse.statusCode === 200) {
    Object.assign(req, httpRequest.body)
    next()
  } else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
}
