import { Box } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { sortByTimeStamp } from 'shared/utils';
import moment from 'moment/moment';
import styles from './performanceChart.module.scss';

const getDot = ({ cx, cy, payload }) => {
  const color = payload.order_side === 'SELL' ? 'red' : 'green';
  return (
    <svg x={cx - 4} y={cy - 4} width={75} height={75} fill='red' viewBox='0 0 1024 1024'>
      <circle cx='50' cy='50' r='40' stroke='black' strokeWidth='3' fill={color} />
    </svg>
  );
};

const PerformanceChart = ({ data }) => {
  const getDate = (time) => moment(time).format('YYYY.MM.DD HH:mm:ss');
  const getTime = (time) => moment(time).format('HH:mm');
  const formattedData = sortByTimeStamp(data);

  const yValues = data?.map((val) => val.price);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <Box className={styles.container}>
      <ResponsiveContainer id='chart_container' width='100%' height='100%'>
        <LineChart id='chart' data={formattedData} margin={{ top: 10, right: 18, bottom: 5, left: 0 }}>
          <Line
            type='monotone'
            dataKey='price'
            stroke='#8884d8'
            dot={(props) => getDot(props)}
            activeDot={(props) => getDot(props)}
          />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='timestamp' tickFormatter={(time) => getTime(time)} />
          <YAxis
            type='number'
            domain={[minY, maxY]}
            tickFormatter={(value) => parseFloat(Number(value).toFixed(0)).toString()}
          />
          <Tooltip
            labelFormatter={(value) => getDate(value)}
            content={(props) => {
              if (!props.active) {
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
