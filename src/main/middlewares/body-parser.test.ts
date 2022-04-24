import request from 'supertest'
import app from '../config/app'

describe('BodyParser middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/', (req, res) => {
      res.send(req.body)
    })

    await request(app).post('/').send({ name: 'name' }).expect({ name: 'name' })
  })
})
