import axios from 'axios';

export const getBots = () => axios.get('/api/trades');

export const getTrades = (botId) => axios.get(`/api/trades/${botId}`);
