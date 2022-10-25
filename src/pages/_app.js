import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@components/header';
import axios from 'axios';
import { sortByTimeStamp } from '@utils';
import '@styles/index.css';

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/api/trades');
      const sortedData = sortByTimeStamp(response.data);
      console.log(sortedData);
    };
    //getData();
  }, []);

  return (
    <>
      <Header />
      <div>
        This is the initial project setup. Go to <Link href='/api/trades'>Trades</Link> to see some data.
      </div>
    </>
  );
};

export default App;
