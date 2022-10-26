import { useQuery } from 'react-query';
import { getBots } from 'api/getTradeData';
import { Grid } from '@mui/material';
import ChartItem from 'components/ChartItem';

const HomePage = () => {
  const { data, status } = useQuery('bots', getBots);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error loading data</p>;
  }

  return (
    <Grid container spacing={5} justifyContent={'center'} alignItems={'center'}>
      {data.map((botId) => {
        return <ChartItem key={botId} botId={botId} />;
      })}
    </Grid>
  );
};

export default HomePage;
