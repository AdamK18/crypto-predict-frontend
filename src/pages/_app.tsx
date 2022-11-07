import { Header } from '@components/Header';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import '@styles/index.scss';

const MyApp = ({ Component, pageProps }) => {
  return (
    <StyledEngineProvider injectFirst>
      <Header />
      <div className='mainContent'>
        <Component {...pageProps} />
      </div>
    </StyledEngineProvider>
  );
};

export default MyApp;
