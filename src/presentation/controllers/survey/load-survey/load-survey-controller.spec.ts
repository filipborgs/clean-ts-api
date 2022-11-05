import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/use-cases/survey/load-surveys'
import { LoadSurveyController } from './load-survey-controller'

describe('LoadSurveyController', () => {
  const makeLoadSurveyStub = (): LoadSurvey => {
    class LoadSurveyStub implements LoadSurvey {
      async load (): Promise<SurveyModel[] | null> {
        return []
      }
    }

    return new LoadSurveyStub()
  }
  test('Should call LoadSurvey with no values', async () => {
    const loadSurvey = makeLoadSurveyStub()
    const loadSpy = jest.spyOn(loadSurvey, 'load')
    const sut = new LoadSurveyController(loadSurvey)
    await sut.handle()
    expect(loadSpy).toBeCalledWith()
  })
})
