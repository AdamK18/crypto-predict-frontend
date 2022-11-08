import axios from 'axios';

export const getBots = () => axios.get('/api/bots');

export const getBotData = (botId) => axios.get(`/api/bots/${botId}`);
