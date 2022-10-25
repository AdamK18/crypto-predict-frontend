import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@components/header';
import axios from 'axios';

const HomePage = () => {
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get('/api/trades');
      console.log(data);
    };
    getData();
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

export default HomePage;
