import { AddSurveyModel } from '../../add-account/db-add-account-protocols'
import { AddSurvey, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyRepository) {}
  async add (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurvey.add(surveyData)
  }
}
