import { useState, useEffect, useRef } from 'react';
import useStateRef from 'react-usestateref';
import { Box } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Label, Brush } from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { calculateAndAddProfit } from 'shared/utils';
import moment from 'moment/moment';
import styles from './performanceChart.module.scss';

const listenerAlreadyAttached = false;

const getDot = ({ key, cx, cy, payload }) => {
  const color = payload.order_side === 'SELL' ? 'red' : 'green';
  return (
    <svg key={key} x={cx - 4} y={cy - 4} width={75} height={75} fill='red' viewBox='0 0 1024 1024'>
      <circle cx='50' cy='50' r='40' stroke='black' strokeWidth='3' fill={color} />
    </svg>
  );
};

const PerformanceChart = ({ data, setProfit, setPeriodProfit }) => {
  //This is to rerender the Brush component
  const [chartData, setchartData] = useState([]);
  const [chartKey, setChartKey, chartKeyRef] = useStateRef(0);
  const [brushPosition, setBrushPosition, brushPositionRef] = useStateRef({ start: 0, end: 0 });
  const dataLength = useRef(0);

  const getDate = (time) => moment(time).format('YYYY.MM.DD HH:mm:ss');
  const getTime = (time) => moment(time).format('HH:mm');

  const { start, end } = brushPosition;

  useEffect(() => {
    const performanceData = calculateAndAddProfit(data);
    setchartData(performanceData);
    const len = performanceData.length;
    setProfit(performanceData[len - 1].profit);
    const range = len > 50 ? { start: len - 51, end: len - 1 } : { start: 0, end: len - 1 };
    setBrushPosition(range);
    dataLength.current = len;
  }, [data]);

  useEffect(() => {
    const periodPerformance = calculateAndAddProfit(data.slice(brushPosition.start, brushPosition.end + 1));
    setPeriodProfit(periodPerformance[periodPerformance.length - 1].profit);
  }, [brushPosition]);

  const updateBrush = () => setChartKey(chartKeyRef.current + 1);

  //Function to handle scroll event. It sets the brush position based on the direction of the scroll
  const onScroll = (e) => {
    const isShiftPressed = e.shiftKey;
    const up = e.deltaY < 0;
    let range = { ...brushPositionRef.current };
    const len = dataLength.current;
    const { start, end } = range;
    if (isShiftPressed) {
      if (up) {
        if (end !== len - 1) {
          range = { start: start, end: end + 1 };
        } else if (start !== 0) {
          range = { start: start - 1, end: end };
        }
      } else if (!up && start + 1 !== end) {
        range = { start: start, end: end - 1 };
      }
    } else {
      if (up && end !== len - 1) {
        range = { start: start + 1, end: end + 1 };
      } else if (!up && start !== 0) {
        range = { start: start - 1, end: end - 1 };
      }
    }
    setBrushPosition(range);
    updateBrush();
  };

  //Attach scroll event
  useEffect(() => {
    if (listenerAlreadyAttached) {
      return;
    }
    document.addEventListener('wheel', onScroll);
  }, []);

  const profits = chartData.map((val) => val.profit).slice(brushPosition.start, brushPosition.end + 1);
  const profitMax = Math.max(...profits);
  const profitMin = Math.min(...profits);
  const prices = chartData.map((val) => val.price).slice(brushPosition.start, brushPosition.end + 1);
  const priceMax = Math.max(...prices);
  const priceMin = Math.min(...prices);

  return (
    <Box className={styles.container}>
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
            dot={() => null}
            activeDot={() => null}
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
