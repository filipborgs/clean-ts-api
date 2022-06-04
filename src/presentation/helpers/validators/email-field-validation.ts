import { InvalidParamError } from '../../erros'
import { EmailValidator, Validation } from '../../protocols'

export class EmailFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
