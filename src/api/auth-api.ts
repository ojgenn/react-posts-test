import { api } from './api-client'

/** Ответ POST /auth/login — [DummyJSON Auth](https://dummyjson.com/docs/auth) */
export interface DummyJsonLoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface LoginRequestBody {
  username: string
  password: string
  /** Минуты жизни access token; по умолчанию на стороне API 60 */
  expiresInMins?: number
}

export async function loginWithPassword(
  body: LoginRequestBody,
): Promise<DummyJsonLoginResponse> {
  return api.post<DummyJsonLoginResponse>('/auth/login', {
    username: body.username,
    password: body.password,
    expiresInMins: body.expiresInMins ?? 30,
  })
}

export async function getAuthUser(): Promise<unknown> {
  return api.get('/auth/me')
}
