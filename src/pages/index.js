import App from './_app';
import { QueryClient, QueryClientProvider } from 'react-query';

const HomePage = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default HomePage;
