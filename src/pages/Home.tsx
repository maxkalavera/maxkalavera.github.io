import styles from 'src/styles/home.module.css';
import DisplayImage from 'src/assets/home-display.svg';


export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles['left-frame']}`}>
          <h1 className={styles['title']}>Hi, I am Max Hernandez</h1>
          <h2 className={styles['subtitle']}>a software developer</h2>
        </div>
        <div className={`${styles['right-frame']}`}>
          <img 
            className={`${styles['display']}`}
            src={DisplayImage} 
            alt='website authors profile graph'
          />
        </div>
      </div>

      <svg 
        width="562" 
        height="231" 
        viewBox="0 0 562 231" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles['diagonal-decorator']}`}
      >
        <line x1="2.44639" y1="186.606" x2="402.446" y2="27.7613" stroke="#FF9900" stroke-width="3"/>
        <line x1="1.51773" y1="227.285" x2="560.454" y2="4.2848" stroke="#FB4027" stroke-width="8"/>
      </svg>
    </>
  )
};