import axios from 'axios';

export const getBots = async () => {
  const response = await axios.get('/api/trades');
  const botIds = response.data.map((bot) => {
    return bot.bot_id;
  });
  return botIds;
};

export const getTrades = async ({ queryKey }) => {
  const [_, botId] = queryKey;
  const response = await axios.get(`/api/trades/${botId}`);
  return response.data;
};
