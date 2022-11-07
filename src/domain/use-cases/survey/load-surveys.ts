import { SurveyModel } from '@/domain/models'

export interface LoadSurvey {
  load: () => Promise<SurveyModel[] | null>
}
