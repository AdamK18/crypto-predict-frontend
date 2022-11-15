import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { changeDataToPerformanceChartData } from 'shared/utils';
import moment from 'moment/moment';
import styles from './performanceChart.module.scss';

const getDot = ({ key, cx, cy, payload }) => {
  const color = payload.order_side === 'SELL' ? 'red' : 'green';
  return (
    <svg key={key} x={cx - 4} y={cy - 4} width={75} height={75} fill='red' viewBox='0 0 1024 1024'>
      <circle cx='50' cy='50' r='40' stroke='black' strokeWidth='3' fill={color} />
    </svg>
  );
};

const PerformanceChart = ({ data, setProfit }) => {
  const [chartData, setchartData] = useState([]);
  const getDate = (time) => moment(time).format('YYYY.MM.DD HH:mm:ss');
  const getTime = (time) => moment(time).format('HH:mm');

  useEffect(() => {
    const changedData = changeDataToPerformanceChartData(data);
    setchartData(changedData);
    setProfit(changedData[changedData.length - 1].profit);
  }, [data]);

  const yValues = chartData.map((val) => val.profit);
  const maxY = Math.max(...yValues) * 3;
  const minY = Math.min(...yValues);

  return (
    <Box className={styles.container}>
      <ResponsiveContainer id='chart_container' width='100%' height='100%'>
        <LineChart id='chart' data={chartData} margin={{ top: 10, right: 18, bottom: 5, left: 0 }}>
          <Line
            type='monotone'
            dataKey='profit'
            stroke='#8884d8'
            dot={(props) => getDot(props)}
            activeDot={(props) => getDot(props)}
          />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='timestamp' tickFormatter={(time) => getTime(time)} />
          <YAxis
            type='number'
            domain={[minY, maxY]}
            tickFormatter={(value) => parseFloat(Number(value).toFixed(4)).toString()}
          />
          <Tooltip
            labelFormatter={(value) => getDate(value)}
            content={(props) => {
              if (!props.active || props.payload.length === 0) {
                return null;
              }
              const { payload } = props;
              const values = payload[0].payload;
              const newPayload = [
                {
                  name: 'Date',
                  value: getDate(values.timestamp),
                },
                { name: 'Price', value: values.price },
                { name: 'Order Side', value: values.order_side },
                { name: 'Profit', value: values.profit },
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

export default PerformanceChart;
