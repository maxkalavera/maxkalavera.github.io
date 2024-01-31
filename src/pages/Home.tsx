import { useEffect } from 'react';

import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import fadeInTextLeftRight from 'src/utils/animations/fadeInTextLeftRight';
import fadeIn from 'src/utils/animations/fadeIn';
import DisplayImage from 'src/components/DisplayImage';
import styles from 'src/styles/home.module.css';

var singleExecutionFlag = false;

function Introduction () {
  return (
    <>
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
    </>
  );
}

function DiagonalLinesDecoration () {
  return (
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
  );
}

function Home() {
  useEffect(() => {
    (async () => {
      if (singleExecutionFlag)
        return;
      singleExecutionFlag = true;

      Array.from(document.getElementsByClassName('fadeInOnHome')).forEach(elem => {
        // @ts-ignore
        elem.style.opacity = "0.0";
      });

      const animeQueue = [
        {
          callback: fadeInTextLeftRight,
          args: [
            '464fce7e-d26a-4b08-b038-6cddff68c826', 
            'Hi, I am Max Hernandez',
            3500          
          ]
        },
        {
          callback: fadeInTextLeftRight,
          args: [
            'e2e0c90c-6896-46c8-80e5-359f0116404f', 
            '',
            1000
          ]
        },
        {
          callback: fadeInTextLeftRight,
          args: [
            'e2e0c90c-6896-46c8-80e5-359f0116404f', 
            'a software developer',
            1500
          ]
        },
        {
          callback: fadeIn,
          args: [
            '.fadeInOnHome', 
            3500
          ]
        }
      ];
      
      for (let i = 0; i < animeQueue.length; i++) {
        let breakFlagRef = {current: false};
        let stop = () => {
          animation.anime?.pause();
          animation.anime?.seek(100 * animation.anime.duration);
          breakFlagRef.current = true;     
        }
        document.addEventListener('click', stop);
        document.addEventListener('keydown', stop);
        // @ts-ignore
        let animation = animeQueue[i].callback.apply(null, animeQueue[i].args);
        // @ts-ignore
        await animation.promise;
        document.removeEventListener('click', stop);
        document.addEventListener('keydown', stop);
        if (breakFlagRef.current) break;
      }

      const subtitle = document.getElementById('e2e0c90c-6896-46c8-80e5-359f0116404f');
      if (subtitle) subtitle.textContent = 'a software developer';
      Array.from(document.getElementsByClassName('fadeInOnHome')).forEach(elem => {
        // @ts-ignore
        elem.style.opacity = "1.0";
      });
    })();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.content}>
        <div className={`${styles['left-frame']}`}>
          <Introduction />
        </div>
        <div className={`${styles['right-frame']}`}>
          <DisplayImage
            className={`${styles['display-image']} fadeInOnHome`}
          />
        </div>
      </div>
      <Footer />

      <DiagonalLinesDecoration />
    </>
  )
};

export default function HomeWrapper () {
  return (
    <Home />
  );
}