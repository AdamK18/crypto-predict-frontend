import React, { useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { getTrades } from 'api/getTradeData';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { sortByTimeStamp } from '@utils';
import moment from 'moment/moment';

const chartItemStyles = {
  width: '100%',
  height: '400px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
};

const ChartItem = ({ botId }) => {
  const { data, status } = useQuery(['trades/${botId}', botId], getTrades);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error loading data</p>;
  }

  const formatEpoch = (time) => moment(time).format('hh:mm:ss');

  const yValues = data?.map((val) => val.avg_price);
  const formattedData = sortByTimeStamp(data);

  return (
    <Grid sx={chartItemStyles} item xs={12} sm={12} md={6} lg={6} xl={6} justifyContent={'center'}>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error loading data</p>}
      {status === 'success' && (
        <>
          <Typography>{botId}</Typography>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <Line type='monotone' dataKey='avg_price' stroke='#8884d8' />
              <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
              <XAxis dataKey='timestamp' tickFormatter={(time) => formatEpoch(time)} />
              <YAxis
                type='number'
                domain={[Math.min(...yValues), Math.max(...yValues)]}
                tickFormatter={(value) => parseFloat(Number(value).toFixed(2))}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </Grid>
  );
};

export default ChartItem;
