import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getTrades } from 'api/getTradeData';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { sortByTimeStamp } from '@utils';
import moment from 'moment/moment';

const chartItemStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
};

const ChartItem = ({ botId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTrades(botId);
      setData(response.data);
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <p>loading...</p>;
  }

  const formatEpoch = (time) => moment(time).format('YYYY.MM.DD hh:mm:ss');

  const yValues = data?.map((val) => val.avg_price);
  const formattedData = sortByTimeStamp(data);
  const minY = Math.min(...yValues) * 0.9;
  const maxY = Math.max(...yValues) * 1.1;

  return (
    <Box sx={chartItemStyles}>
      <Typography>{botId}</Typography>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <Line type='monotone' dataKey='price' stroke='#8884d8' />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='timestamp' tickFormatter={(time) => formatEpoch(time)} />
          <YAxis type='number' domain={[minY, maxY]} tickFormatter={(value) => parseFloat(Number(value).toFixed(2))} />
          <Tooltip labelFormatter={(value) => formatEpoch(value)} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartItem;
