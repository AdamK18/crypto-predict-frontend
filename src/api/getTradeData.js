const getMetaData = async () => {
  const response = await axios.get('/api/trades');
  const botIds = response.data.map((bot) => {
    return bot.bot_id;
  });
  return botIds;
};

const getBotData = async (botId) => {
  const response = await axios.get(`/api/trades/${botId}`);
  return response.data;
};
