import { QueryClient, QueryClientProvider } from 'react-query';
import Header from '@components/header';
import '@styles/index.css';

const MyApp = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className='mainContent'>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
};

export default MyApp;
