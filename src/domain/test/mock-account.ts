import { AccountModel } from '@/domain/models'
import { AddAccountParams, AuthenticationParams } from '@/domain/use-cases'
import { AutenticationModel } from '../models/autentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationModel = (): AutenticationModel => ({
  accessToken: 'valid_token',
  name: 'any_name'
})
