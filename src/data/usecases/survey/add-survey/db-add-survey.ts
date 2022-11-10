import { AddSurvey, AddSurveyRepository, AddSurveyParams } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyRepository) {}
  async add (surveyData: AddSurveyParams): Promise<void> {
    await this.addSurvey.add(surveyData)
  }
}
