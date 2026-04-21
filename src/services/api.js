import axios from 'axios';

const BASE_URL = 'https://api.docvault.site/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// FILES
export const uploadFile = (formData) =>
  api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getAllFiles = () => api.get('/files/allFiles');
export const searchFiles = (name) => api.get(`/search?name=${name}`);
export const downloadFile = (id) =>
  api.get(`/files/${id}/download`, { responseType: 'blob' });
export const deleteFile = (id) => api.delete(`/files/${id}`);

// FOLDERS
export const getFolders = () => api.get('/folders/allFolders');
export const createFolder = (data) => api.post('/folders/create', data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);
export const getFilesByFolder = (folderId) =>
      api.get(`/files/folders/${folderId}/files`);

