import { SurveyModel } from '../../models'

export interface LoadSurvey {
  load: () => Promise<SurveyModel[] | null>
}
