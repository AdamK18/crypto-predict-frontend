import { getDocs, collectionGroup, collection } from 'firebase/firestore';
import { getDB } from '@api';

const tradeHandler = async (req, res) => {
  const db = getDB();
  if (!db) {
    res.status(500).json('Not Authorized');
  }
  const tradesSnapshot = await getDocs(collection(db, 'trades'));
  /* const tradesList = tradesSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(tradesSnapshot); */
};

export default tradeHandler;
