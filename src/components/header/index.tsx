import React from 'react';
import styles from './header.module.css';
import Link from 'next/link';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>Crypto predict</h1>
      <nav className={styles.nav}>
        <Link href={'/api/trades'}>Bots data</Link>
      </nav>
    </header>
  );
};

export default Header;