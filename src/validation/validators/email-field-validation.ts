import { InvalidParamError } from '@/presentation/erros'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidator } from '@/validation/protocols'

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
