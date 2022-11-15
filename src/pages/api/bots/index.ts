import { getDocs, collection, query, limit as Limit, orderBy as OrderBy } from 'firebase/firestore';
import { getDB } from 'pages/api';

const botHandler = async (req, res) => {
  const db = getDB();
  if (!db) {
    res.status(500).json('Not Authorized');
  }
  const { limit, orderBy } = req.query;
  const queryParams = [];
  if (orderBy && ['desc', 'asc'].includes(orderBy)) {
    //queryParams.push(OrderBy());
  }
  if (limit && limit > 0) {
    queryParams.push(Limit(limit));
  }
  const tradesSnapshot = await getDocs(query(collection(db, 'bots'), ...queryParams));
  const tradesList = tradesSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(tradesList);
};

export default botHandler;
