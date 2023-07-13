import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";

import styles from "src/styles/layout.module.css"

export default function Layout({
  children=undefined
}: {
  children?: JSX.Element
}): JSX.Element {
  return (
    <>
      <div className={`${styles.container}`}>
        <section className={`${styles.header} fadeInOnHome`}>
          <div className={`${styles['header__content']}`}>
            <Link to={`/`}><h3 className={`primary ${styles['navbar-logo']}`}>MAX HERNANDEZ</h3></Link>
            <ul className={styles['navbar-items']}>
              <li><Link to={`/`}>Home</Link></li>
              <li><Link to={`/resume/`}>Resume</Link></li>
              <li><Link to={`/projects/`}>Projects</Link></li>
            </ul>
          </div>
          <hr className={styles.divider} />
        </section>

        <section className={`${styles.content}`}>
          {children}
        </section>

        <section className={`${styles.footer} fadeInOnHome`}>
          <div className={`${styles['footer-mail']}`}>
            <FontAwesomeIcon icon={faEnvelope} />
            <p className='secondary'>maxhernandezcastillo@gmail.com</p>
          </div>
          <div className={`${styles['footer-social-networks']}`}>
            <a href='https://github.com/maxkalavera'>
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href='https://www.linkedin.com/in/max-hernandez-castillo/'>
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </section>
      </div>
    </>
  )
}