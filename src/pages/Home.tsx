import { useEffect } from 'react';
import profilePicture from 'src/assets/me.jpg';
import styles from 'src/styles/home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={`${styles.content} hexagon-animation-background`}>
        <div className={`${styles.info}`}>
          <h1 className={`primary-h1 ${styles.infoTitle}`}>
            I am Max Hernandez
          </h1>
          <h3 className={`secondary-h3 ${styles.infoSubtitle}`}>
            A software engineer by logical conclusion, fan of comedy by nature and dancer by fortune.
          </h3>
        </div>
        <img
          className={styles.profilePicture}
          src={profilePicture}    
          alt='Profile avatar'      
          width={240}
          height={240}
        />
      </div>
    </div>
  )
};