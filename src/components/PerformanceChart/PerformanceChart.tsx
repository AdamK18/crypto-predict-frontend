import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Label, Brush } from 'recharts';
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
  //This is to rerender the Brush component
  const [chartKey, setChartKey] = useState(0);
  const [chartData, setchartData] = useState([]);
  const [brushPosition, setBrushPosition] = useState({ start: 5, end: 10 });
  const getDate = (time) => moment(time).format('YYYY.MM.DD HH:mm:ss');
  const getTime = (time) => moment(time).format('HH:mm');

  const length = chartData.length;
  const { start, end } = brushPosition;

  useEffect(() => {
    const performanceData = changeDataToPerformanceChartData(data);
    setchartData(performanceData);
    const len = performanceData.length;
    setProfit(performanceData[len - 1].profit);
    const range = len > 50 ? { start: len - 51, end: len - 1 } : { start: 0, end: len - 1 };
    setBrushPosition(range);
  }, [data]);

  const profits = chartData.map((val) => val.profit);
  const profitMax = Math.max(...profits);
  const profitMin = Math.min(...profits);
  const prices = chartData.map((val) => val.price);
  const priceMax = Math.max(...prices);
  const priceMin = Math.min(...prices);

  const onKeyPress = (e) => {
    const keyCode = e.keyCode;
    if (![87, 65, 83, 68].includes(keyCode)) return;
    if (keyCode === 87 && end !== length - 1) {
      setBrushPosition({ start, end: end + 1 });
    } else if (keyCode === 65 && start !== 0) {
      setBrushPosition({ start: start - 1, end: end - 1 });
    } else if (keyCode === 83 && end !== 0) {
      setBrushPosition({ start, end: end - 1 });
    } else if (keyCode === 68 && end !== length - 1) {
      setBrushPosition({ start: start + 1, end: end + 1 });
    }
    setChartKey(chartKey + 1);
  };

  return (
    <Box className={styles.container} onKeyDown={(e) => onKeyPress(e)}>
      <ResponsiveContainer id='chart_container' width='100%' height='100%'>
        <LineChart key={chartKey} id='chart' data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 20 }}>
          <Brush
            startIndex={start}
            endIndex={end}
            dataKey='timestamp'
            tickFormatter={(time) => getTime(time)}
            onChange={(pos) => setBrushPosition({ start: pos.startIndex, end: pos.endIndex })}
            height={20}
          />
          <Line
            isAnimationActive={chartKey === 0}
            yAxisId='price'
            type='monotone'
            dataKey='price'
            stroke='#8884d8'
            dot={(props) => getDot(props)}
            activeDot={(props) => getDot(props)}
          />
          <Line
            isAnimationActive={chartKey === 0}
            yAxisId='profit'
            type='monotone'
            dataKey='profit'
            stroke='#222222'
            dot={(props) => null}
            activeDot={(props) => null}
          />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='timestamp' tickFormatter={(time) => getTime(time)} tickMargin={5} />
          <YAxis
            domain={[profitMin, profitMax]}
            yAxisId='profit'
            orientation='right'
            type='number'
            tickFormatter={(value) => parseFloat(Number(value).toFixed(3)).toString()}
            tickMargin={10}
          >
            <Label value={'Profit ($)'} angle={-90} position='right' fill='#222222' fontSize={20} offset={20} dy={40} />
          </YAxis>
          <YAxis
            domain={[priceMin, priceMax]}
            yAxisId='price'
            tickFormatter={(value) => parseFloat(Number(value).toFixed(0)).toString()}
            tickMargin={10}
          >
            <Label value={'Price (₿)'} angle={-90} position='left' fill='#8884d8' fontSize={20} offset={20} dy={-40} />
          </YAxis>
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
                { name: 'Order Side', value: values.order_side },
                { name: 'Price', value: values.price },
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
