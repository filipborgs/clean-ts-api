import { AccountModel } from '../models'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (data: AddAccountModel) => AccountModel
}
