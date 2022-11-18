import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TradeHistoryChart } from 'components/TradeHistoryChart';
import { PerformanceChart } from 'components/PerformanceChart';
import { getBotData } from 'api/botData';
import { useQuery } from 'react-query';
import styles from './botStyles.module.scss';

enum charts {
  TRADE_HISTORY = 'TRADE_HISTORY',
  PERFORMANCE = 'PERFORMANCE',
}

enum Order {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

const order = Order.ASCENDING;

const Bot = () => {
  const [activeChart, setActiveChart] = useState<charts>(charts.PERFORMANCE);
  const [profit, setProfit] = useState(0);
  const [periodProfit, setPeriodProfit] = useState(0);
  const [limit, setLimit] = useState(50);
  const router = useRouter();
  const { id } = router.query;
  const { isIdle, data, isLoading, refetch } = useQuery(id, () => getBotData(id, limit, order));

  useEffect(() => {
    refetch();
  }, [limit]);

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
        return <PerformanceChart data={chartData} setProfit={setProfit} setPeriodProfit={setPeriodProfit} />;
    }
  };

  const handleLimitChange = (e) => {
    const value = e.target.value.toString();
    setLimit(parseInt(value));
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.subHeader}>
        <Typography className={styles.subHeader__title} variant='h6'>
          {id}: <span style={{ color: profit > 0 ? 'green' : 'red' }}>{profit.toFixed(10)}</span>
          {' & '}
          <span style={{ color: periodProfit > 0 ? 'green' : 'red' }}>{periodProfit.toFixed(10)}</span>
        </Typography>
        <Box className={styles.subHeader__selectors}>
          <FormControl className={styles.subHeader__limit}>
            <InputLabel id='selectLabel'>Limit</InputLabel>
            <Select
              size='small'
              labelId='selectLabel'
              id='select'
              value={limit}
              label='Limit'
              onChange={(e) => handleLimitChange(e)}
            >
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={250}>250</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={-1}>All</MenuItem>
            </Select>
          </FormControl>
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
