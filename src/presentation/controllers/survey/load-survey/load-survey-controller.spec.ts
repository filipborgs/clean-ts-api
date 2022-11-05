import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/use-cases/survey/load-surveys'
import { LoadSurveyController } from './load-survey-controller'
import { serverError, ok } from '../../../helpers/http/http-helper'

describe('LoadSurveyController', () => {
  const makeLoadSurveyStub = (): LoadSurvey => {
    class LoadSurveyStub implements LoadSurvey {
      async load (): Promise<SurveyModel[] | null> {
        return makeFakeSurveys()
      }
    }
    return new LoadSurveyStub()
  }

  const makeFakeSurveys = (): SurveyModel[] => ([
    {
      id: 'any_id',
      question: 'anu_question',
      date: new Date(),
      answers: []
    }
  ])

  const makeSut = (): SutTypes => {
    const loadSurvey = makeLoadSurveyStub()
    const sut = new LoadSurveyController(loadSurvey)
    return {
      loadSurvey,
      sut
    }
  }

  interface SutTypes {
    loadSurvey: LoadSurvey
    sut: LoadSurveyController
  }

  test('Should call LoadSurvey with no values', async () => {
    const { sut, loadSurvey } = makeSut()
    const loadSpy = jest.spyOn(loadSurvey, 'load')
    await sut.handle()
    expect(loadSpy).toBeCalledWith()
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurvey } = makeSut()
    const error = new Error('error')
    jest.spyOn(loadSurvey, 'load').mockImplementation(() => { throw error })
    const response = await sut.handle()
    expect(response).toEqual(serverError(error))
  })

  test('Should return 200 on sucess', async () => {
    const { sut } = makeSut()
    const response = await sut.handle()
    const surveys = makeFakeSurveys()
    expect(response).toEqual(ok({
      surveys
    }))
  })
})
