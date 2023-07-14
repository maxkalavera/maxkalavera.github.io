import { useEffect } from 'react';

import fadeInTextLeftRight from 'src/utils/animations/fadeInTextLeftRight';
import fadeIn from 'src/utils/animations/fadeIn';
import styles from 'src/styles/home.module.css';
import DisplayImage from 'src/components/DisplayImage';

var singleExecutionFlag = false;

export default function Home() {

  useEffect(() => {
    if (!singleExecutionFlag) {
      (async () => {
        Array.from(document.getElementsByClassName('fadeInOnHome')).forEach(elem => {
          // @ts-ignore
          elem.style.opacity = "0.0";
        });
        await fadeInTextLeftRight(
          '464fce7e-d26a-4b08-b038-6cddff68c826', 
          'Hi, I am Max Hernandez',
          3500
        );
        await fadeInTextLeftRight(
          'e2e0c90c-6896-46c8-80e5-359f0116404f', 
          '',
          1000
        );
        await fadeInTextLeftRight(
          'e2e0c90c-6896-46c8-80e5-359f0116404f', 
          'a software developer',
          1500
        );
        await fadeIn('.fadeInOnHome', 3500);
        Array.from(document.getElementsByClassName('fadeInOnHome')).forEach(elem => {
          // @ts-ignore
          elem.style.opacity = "1.0";
        });
      })();
      singleExecutionFlag = true;
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles['left-frame']}`}>
          <div 
            className={`${styles['title']}`}
            id='464fce7e-d26a-4b08-b038-6cddff68c826'
          >
            Hi, I am Max Hernandez
          </div>
          <div 
            className={styles['subtitle']}
            id='e2e0c90c-6896-46c8-80e5-359f0116404f'
          >
          </div>
        </div>
        <div className={`${styles['right-frame']}`}>
          <DisplayImage
            className={`${styles['display-image']} fadeInOnHome`}
          />
        </div>
      </div>

      <svg 
        width="562" 
        height="231" 
        viewBox="0 0 562 231" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles['diagonal-decorator']} fadeInOnHome`}
      >
        <line x1="2.44639" y1="186.606" x2="402.446" y2="27.7613" stroke="#FF9900" strokeWidth="3"/>
        <line x1="1.51773" y1="227.285" x2="560.454" y2="4.2848" stroke="#FB4027" strokeWidth="8"/>
      </svg>
    </>
  )
};