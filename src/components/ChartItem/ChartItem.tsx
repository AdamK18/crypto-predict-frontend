import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { getTrades } from 'api/getTradeData';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { sortByTimeStamp } from '@utils';
import moment from 'moment/moment';
import styles from './chartItem.module.scss';

const ChartItem = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if ((process.env.NODE_ENV === 'development' && data.length > 0) || !router.isReady) {
      return;
    }

    const fetchData = async () => {
      const response = await getTrades(id);
      setData(response.data);
    };

    fetchData();
  }, [router.isReady]);

  if (data.length === 0) {
    return <p>loading...</p>;
  }

  const getDate = (time) => moment(time).format('YYYY.MM.DD hh:mm:ss');
  const getTime = (time) => moment(time).format('hh:mm:ss');
  const formattedData = sortByTimeStamp(data);

  const yValues = data?.map((val) => val.price);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <Box className={styles.container}>
      <Typography>{id}</Typography>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <Line
            type='monotone'
            dataKey='price'
            stroke='#8884d8'
            dot={({ cx, cy, payload }) => {
              const color = payload.order_side === 'SELL' ? 'red' : 'green';
              return (
                <svg x={cx - 4} y={cy - 4} width={75} height={75} fill='red' viewBox='0 0 1024 1024'>
                  <circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill={color} />
                </svg>
              );
            }}
          />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='timestamp' tickFormatter={(time) => getTime(time)} />
          <YAxis
            type='number'
            domain={[minY, maxY]}
            tickFormatter={(value) => parseFloat(Number(value).toFixed(2)).toString()}
          />
          <Tooltip
            labelFormatter={(value) => getDate(value)}
            content={(props) => {
              if (!props.active) {
                return null;
              }
              const { payload } = props;
              const values = payload[0].payload;
              console.log(props);
              const newPayload = [
                {
                  name: 'Date',
                  value: getDate(values.timestamp),
                },
                { name: 'Price', value: values.price },
                { name: 'Order Side', value: values.order_side },
              ];
              // we render the default, but with our overridden payload
              return <DefaultTooltipContent {...props} payload={newPayload} label={null} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartItem;
