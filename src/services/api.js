import axios from 'axios';

const BASE_URL = 'https://api.docvault.site/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );


// AUTH
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// FILES
// export const uploadFile = (formData) =>
//   api.post('/files/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
export const uploadFile = (formData) =>
api.post('/files/upload', formData);
export const getAllFiles = () => api.get('/files/allFiles');
export const searchFiles = (name) => api.get(`/search?name=${name}`);
export const downloadFile = (id) =>
  api.get(`/files/${id}/download`, { responseType: 'blob' });
export const deleteFile = (id) => api.delete(`/files/${id}`);
export const getStats = ()=> api.get('/files/stats');
export const shareFile = (id) => api.post(`/files/${id}/share`);
  export const revokeShare = (id) => api.delete(`/files/${id}/share`);

// FOLDERS
export const getFolders = () => api.get('/folders/allFolders');
export const createFolder = (data) => api.post('/folders/create', data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);
export const getFilesByFolder = (folderId) =>
      api.get(`/files/folders/${folderId}/files`);

export const renameFolder = (id, data) => api.put(`/folders/${id}`, data);


 // USER
 export const getProfile = () => api.get('/user/profile');
 export const updateProfile = (data) => api.put('/user/profile', data);
 export const changePassword = (data) => api.put('/user/change-password', data);
 export const deleteAccount = () => api.delete('/user/account');


