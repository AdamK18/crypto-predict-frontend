import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      This is the initial project setup. Go to <Link href='/api/trades'>Trades</Link> to see some data.
    </div>
  );
};

export default HomePage;
