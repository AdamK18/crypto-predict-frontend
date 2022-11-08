import { getBots } from 'api/botData';
import { TableRow, Paper, Button, CircularProgress } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import { useQuery } from 'react-query';
import Link from 'next/link';

const HomePage = () => {
  const { isIdle, data, isLoading } = useQuery('bots', () => getBots());

  if (isLoading || isIdle || data?.data.length === 0) {
    return <CircularProgress className='spinner' />;
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
                  <Link href={`/bot/${bot_id}`} passHref>
                    <Button variant='outlined'>See data</Button>
                  </Link>
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
