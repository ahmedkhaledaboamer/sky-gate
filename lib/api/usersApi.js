import { http } from './client';
import { createResource } from './resource';

export const usersApi = {
  // admin / manager — POST/PUT use multipart/form-data (profileImg)
  ...createResource('/users'),
  changePassword: (id, body) => http.put(`/users/changeMyPassword/${id}`, body),

  // logged user
  getMe: (options) => http.get('/users/getMe', options),
  updateMe: (body) => http.put('/users/updateMe', body),
  // returns { data, token } — the previous token stops working
  changeMyPassword: (password) =>
    http.put('/users/changeMyPassword', { password }),
  deleteMe: () => http.delete('/users/deleteMe'),
};
