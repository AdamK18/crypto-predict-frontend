import { getDocs, collection } from 'firebase/firestore';
import { getDB } from '@api';

const botHandler = async (req, res) => {
  const db = getDB();
  if (!db) {
    res.status(500).json('Not Authorized');
  }
  const tradesSnapshot = await getDocs(collection(db, 'bots'));
  const tradesList = tradesSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(tradesList);
};

export default botHandler;
