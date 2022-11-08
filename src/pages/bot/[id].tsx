import { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { TradeHistoryChart } from 'components/TradeHistoryChart';
import { PerformanceChart } from 'components/PerformanceChart';
import { getBotData } from 'api/botData';
import { useQuery } from 'react-query';
import styles from './botStyles.module.scss';

enum charts {
  TRADE_HISTORY = 'TRADE_HISTORY',
  PERFORMANCE = 'PERFORMANCE',
}

const Bot = () => {
  const [acvtiveChart, setAcvtiveChart] = useState<charts>(charts.TRADE_HISTORY);
  const router = useRouter();
  const { id } = router.query;
  const { isIdle, data, isLoading } = useQuery(id, () => getBotData(id));

  if (isLoading || isIdle || data?.data.length === 0) {
    return <CircularProgress className='spinner' />;
  }

  const chartData = data.data;
  const getButtonVariant = (chart) => (acvtiveChart === chart ? 'contained' : 'outlined');

  const getChart = (chart) => {
    switch (chart) {
      case charts.TRADE_HISTORY:
        return <TradeHistoryChart data={chartData} />;
      case charts.PERFORMANCE:
        return <PerformanceChart data={chartData} />;
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.subHeader}>
        <Typography className={styles.subHeader__title} variant='h6'>
          {id}
        </Typography>
        <Box className={styles.subHeader__selectors}>
          <Button
            variant={getButtonVariant(charts.TRADE_HISTORY)}
            onClick={() => setAcvtiveChart(charts.TRADE_HISTORY)}
          >
            Trade History
          </Button>
          <Button variant={getButtonVariant(charts.PERFORMANCE)} onClick={() => setAcvtiveChart(charts.PERFORMANCE)}>
            Performance
          </Button>
        </Box>
      </Box>
      {id && getChart(acvtiveChart)}
    </Box>
  );
};

export default Bot;
