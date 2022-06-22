import { RequiredFieldValidation, ValidationComposite } from '../../../../../../validation/validators'
import { Validation } from '../../../../../../presentation/protocols'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../../validation/validators/validation-composite')
describe('ValidationComposite AddSurvey', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const requiredFields = ['question', 'answers']
    requiredFields.forEach(
      field => validations.push(new RequiredFieldValidation(field)))

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
