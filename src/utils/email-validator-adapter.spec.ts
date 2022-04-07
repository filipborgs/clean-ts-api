import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })
})
