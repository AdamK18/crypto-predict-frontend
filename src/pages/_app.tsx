import { Header } from 'components/Header';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClientProvider, QueryClient } from 'react-query';
import 'shared/styles/index.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8884d8',
    },
  },
});

const MyApp = ({ Component, pageProps }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: process.env.NODE_ENV === 'development' ? false : 'always',
        keepPreviousData: process.env.NODE_ENV === 'development',
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <div className='mainContent'>
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default MyApp;
