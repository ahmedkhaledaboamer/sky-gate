import { http } from './client';

export const authApi = {
  signup: (body) => http.post('/auth/signup', body),
  login: (body) => http.post('/auth/login', body),
  forgotPassword: (email) => http.post('/auth/forgotPassword', { email }),
  verifyResetCode: (resetCode) =>
    http.post('/auth/verifyResetCode', { resetCode }),
  resetPassword: (email, newPassword) =>
    http.put('/auth/resetPassword', { email, newPassword }),
};
