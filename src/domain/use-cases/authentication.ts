export interface Authentication {
  login: (email: string, password: string) => Promise<string | null>
}
