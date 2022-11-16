import { getBots } from 'api/botData';
import { TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import { useQuery } from 'react-query';
import Link from 'next/link';

const limit = process.env.NODE_ENV === 'development' ? 1 : -1;

const HomePage = () => {
  const { isIdle, data, isLoading } = useQuery('bots', () => getBots(limit));

  if (isLoading || isIdle) {
    return <CircularProgress className='spinner' />;
  }

  if (!data || !data.data) {
    return <Typography>No data</Typography>;
  }

  const bots = data.data;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Bot ID</TableCell>
            <TableCell align='right'>Window size</TableCell>
            <TableCell align='right'>Lookup step</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bots.map((bot) => {
            const { bot_id, window_size, lookup_step } = bot;
            return (
              <TableRow key={bot_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {bot_id}
                </TableCell>
                <TableCell align='right'>{window_size}</TableCell>
                <TableCell align='right'>{lookup_step}</TableCell>
                <TableCell align='right'>
                  <a href={`/bot/${bot_id}`} target='_blank'>
                    <Button variant='outlined'>See data</Button>
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HomePage;
