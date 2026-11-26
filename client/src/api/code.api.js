import api from './axiosInstance.js';

export const uploadSnippet = async (snippetData) => {
  const { data } = await api.post('/code/upload', snippetData);
  return data;
};

export const getAllSnippets = async (params = {}) => {
  const { data } = await api.get('/code/all', { params });
  return data;
};

export const getSnippet = async (id) => {
  const { data } = await api.get(`/code/${id}`);
  return data;
};

export const deleteSnippet = async (id) => {
  const { data } = await api.delete(`/code/${id}`);
  return data;
};

export const toggleBookmark = async (snippetId) => {
  const { data } = await api.post(`/code/bookmark/${snippetId}`);
  return data;
};

export const getBookmarks = async () => {
  const { data } = await api.get('/code/bookmarks');
  return data;
};

export const analyzeSnippet = async (snippetId) => {
  const { data } = await api.post(`/analysis/analyze/${snippetId}`);
  return data;
};
