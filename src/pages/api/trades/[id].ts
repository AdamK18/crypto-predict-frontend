import { collection, getDocs } from 'firebase/firestore';
import { getDB } from 'pages/api';

const tradeHandler = async (req, res) => {
  const { id } = req.query;
  const db = getDB();
  if (!db) {
    res.status(500).json('Not Authorized');
  }
  const tradesSnapshot = await getDocs(collection(db, `bots/${id}/trades`));
  const tradesList = tradesSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(tradesList);
};

export default tradeHandler;
