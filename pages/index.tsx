import type { NextPage } from 'next'
//import Image from 'next/image'

import Mandelbrot from 'components/fractals/Maldelbrot'
//import profilePicture from 'public/me.jpg'
import styles from 'styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Mandelbrot />
      </div>
    </div>
  )
}

export default Home


/*
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={`primary-h1 ${styles.infoTitle}`}>
            I am Max Hernandez
          </h1>
          <h3 className={`secondary-h3 ${styles.infoSubtitle}`}>
            A software engineer by logical conclusion, fan of comedy by nature and dancer by fortune.
          </h3>
        </div>
        <div className={styles.profilePictureWrapper}>
          <Image
            className={styles.profilePicture}
            src={profilePicture}
            alt="Picture of the author"
            width={240}
            height={240}
            quality={95}
          />
        </div>
      </div>
*/