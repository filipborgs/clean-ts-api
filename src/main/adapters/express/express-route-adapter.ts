import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body
  }
  const httpResponse = await controller.handle(httpRequest)
  if (httpResponse.statusCode > 299) {
    res.status(httpResponse.statusCode).send({
      name: httpResponse.body.name,
      message: httpResponse.body.message
    })
  } else {
    res.status(httpResponse.statusCode).send(httpResponse.body)
  }
}
