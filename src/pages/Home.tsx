import { useEffect } from 'react'
import animateHexagonGrid from 'src/animations/animateHexagonGrid'
import profilePicture from 'src/assets/me.jpg'
import styles from 'src/styles/home.module.css'

export default function Home() {

  useEffect(() => {
    const _animator = animateHexagonGrid()
    _animator.resume()
    return () => _animator.stop()
  }, [])

  return (
    <div className={styles.container}>
      <div className={`${styles.content} hexagon-background-animation`}>
        <div className={`${styles.info}`}>
          <h1 className={`primary-h1 ${styles.infoTitle}`}>
            I am Max Hernandez
          </h1>
          <h3 className={`secondary-h3 ${styles.infoSubtitle}`}>
            A software engineer by logical conclusion, fan of comedy by nature and dancer by fortune.
          </h3>
        </div>
        <div className={`${styles.profilePictureWrapper}`}>
          <img
            className={styles.profilePicture}
            src={profilePicture}    
            alt='Profile avatar'      
            width={240}
            height={240}
            style={{
              borderRadius: "12px",
              border: "12px solid var(--white)"
            }}
          />
        </div>
      </div>
    </div>
  )
}