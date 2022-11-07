import { useState, useEffect } from 'react';
import { getBots } from 'api/getTradeData';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Link from 'next/link';

const HomePage = () => {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBots();
      setBots(response.data);
    };

    fetchData();
  }, []);

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
