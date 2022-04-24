import request from 'supertest'
import app from '../config/app'

describe('Content-type middleware', () => {
  test('Should return header content-type json', async () => {
    app.post('/test-content', (req, res) => {
      res.send()
    })

    await request(app).post('/test-content')
      .expect('content-type', /json/)
  })

  test('Should return header content-type xml when forced', async () => {
    app.post('/test-content-xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app).post('/test-content-xml')
      .expect('content-type', /xml/)
  })
})
