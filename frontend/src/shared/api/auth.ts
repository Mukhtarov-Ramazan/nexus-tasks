import { request } from './http';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  companyName?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<void>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload) =>
    request<void>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
};
