import axios from 'axios';

export const getBots = (limit?: number, orderBy?: string) => axios.get('/api/bots', { params: { limit, orderBy } });

export const getBotData = (botId, limit?: number, orderBy?: string) =>
  axios.get(`/api/bots/${botId}`, { params: { limit, orderBy } });
