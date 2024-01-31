import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

import styles from "src/styles/footer.module.css"

export default function Footer () {
  return (
    <section className={`${styles.container} fadeInOnHome`}>
      <div className={`${styles['mail']}`}>
        <a href='mailto:maxhernandezcastillo@gmail.com'>
          <FontAwesomeIcon icon={faEnvelope} />
          <small className='secondary'>maxhernandezcastillo@gmail.com</small>
        </a>
      </div>
      <div className={`${styles['social-networks']}`}>
        <a href='https://github.com/maxkalavera'>
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href='https://www.linkedin.com/in/max-hernandez-castillo/'>
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>
    </section>
  );
}