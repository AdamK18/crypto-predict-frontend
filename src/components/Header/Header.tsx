import React from 'react';
import styles from './header.module.scss';
import Link from 'next/link';

const Header = () => {
  return (
    <header className={styles.container}>
      <h1 className={styles.h1}>Crypto predict</h1>
      <nav className={styles.nav}>
        <div className={styles.nav__item}>
          <Link href={'/'}>Home</Link>
        </div>
        <div className={styles.nav__item}>
          <Link href={'/api/trades'}>Bots data</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
