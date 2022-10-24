import { collection, getDocs } from 'firebase/firestore/lite';
import { getDB } from '@api';

const getTrades = async (req, res) => {
  const db = getDB();
  const trades = collection(db, 'trades/1m_30d_WS20_LS5_10_20/trades');
  const tradesSnapshot = await getDocs(trades);
  const tradesList = tradesSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(tradesList);
};

export default getTrades;
