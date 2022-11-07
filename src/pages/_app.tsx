import Header from '@components/header';
import '@styles/index.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <div className='mainContent'>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
