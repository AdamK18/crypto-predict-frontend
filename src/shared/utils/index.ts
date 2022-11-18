export const calculateAndAddProfit = (data) => {
  let USDT = 0,
    BTC = 0;
  return data.map((value) => {
    const { order_side, price, amount_in_usd, quantity } = value;
    if (order_side === 'BUY') {
      BTC += quantity;
      USDT -= amount_in_usd;
    } else {
      BTC -= quantity;
      USDT += amount_in_usd;
    }
    const profit = BTC * price + USDT;
    return { ...value, profit: profit };
  });
};
