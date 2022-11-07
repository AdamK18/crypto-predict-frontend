import React from 'react';
import ChartItem from '@components/ChartItem';
import { useRouter } from 'next/router';

const Bot = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <ChartItem botId={id} />
    </>
  );
};

export default Bot;
