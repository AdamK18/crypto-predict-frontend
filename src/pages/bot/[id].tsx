import { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { TradeHistoryChart } from 'components/TradeHistoryChart';
import { PerformanceChart } from 'components/PerformanceChart';
import { getBotData } from 'api/botData';
import { useQuery } from 'react-query';
import styles from './botStyles.module.scss';

const limit = process.env.NODE_ENV === 'development' ? 50 : 50;

enum charts {
  TRADE_HISTORY = 'TRADE_HISTORY',
  PERFORMANCE = 'PERFORMANCE',
}

enum Order {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

const Bot = () => {
  const [activeChart, setActiveChart] = useState<charts>(charts.PERFORMANCE);
  const [profit, setProfit] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { isIdle, data, isLoading } = useQuery(id, () => getBotData(id, limit));

  if (isLoading || isIdle) {
    return <CircularProgress className='spinner' />;
  }

  if (!data || !data.data) {
    return <Typography>No data</Typography>;
  }

  const chartData = data.data;
  const getButtonVariant = (chart) => (activeChart === chart ? 'contained' : 'outlined');

  const getChart = (chart) => {
    switch (chart) {
      case charts.TRADE_HISTORY:
        return <TradeHistoryChart data={chartData} />;
      case charts.PERFORMANCE:
        return <PerformanceChart data={chartData} setProfit={setProfit} />;
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.subHeader}>
        <Typography className={styles.subHeader__title} variant='h6'>
          {id}: <span style={{ color: profit > 0 ? 'green' : 'red' }}>{profit}</span>
        </Typography>
        <Box className={styles.subHeader__selectors}>
          <Button variant={getButtonVariant(charts.PERFORMANCE)} onClick={() => setActiveChart(charts.PERFORMANCE)}>
            Performance
          </Button>
          <Button variant={getButtonVariant(charts.TRADE_HISTORY)} onClick={() => setActiveChart(charts.TRADE_HISTORY)}>
            Trade History
          </Button>
        </Box>
      </Box>
      {id && getChart(activeChart)}
    </Box>
  );
};

export default Bot;
