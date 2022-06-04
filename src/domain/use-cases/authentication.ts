export interface AuthenticationModel {
  email: string
  password: string
}
export interface Authentication {
  login: (authentication: AuthenticationModel) => Promise<string | null>
}
