export const sortByTimeStamp = (data) => {
  return data.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
};

const calculateProfit = (data) => {
  let USDT = 0,
    BTC = 0,
    sumProfit = 0;
  return data.map((value) => {
    const { order_side, price, amount_in_usd, quantity } = value;
    if (order_side === 'BUY') {
      BTC += quantity;
      USDT -= amount_in_usd;
      return { ...value, profit: sumProfit };
    }
    BTC -= quantity;
    USDT += amount_in_usd;
    const profit = BTC * price + USDT;
    sumProfit += profit;
    return { ...value, profit };
  });
};

export const changeDataToPerformanceChartData = (data) => {
  const sortedData = sortByTimeStamp(data);
  const dataWithprofit = calculateProfit(sortedData);
  console.log(dataWithprofit);
  return dataWithprofit;
};
