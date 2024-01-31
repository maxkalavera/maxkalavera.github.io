import { Link } from "react-router-dom";

import styles from "src/styles/header.module.css"

export default function Header () {
  return (
    <section className={`${styles.container} fadeInOnHome`}>
      <div className={`${styles.content}`}>
        <Link to={`/`} style={{ textDecoration: 'none' }}>
          <h3 className={`primary ${styles['navbar-logo']}`}>
            Max Hernandez
          </h3>
        </Link>
        <ul className={styles['navbar-items']}>
          <li><Link to={`/`}>Home</Link></li>
          <li><Link to={`/resume/`}>Resume</Link></li>
          <li><Link to={`/projects/`}>Projects</Link></li>
        </ul>
      </div>
    </section>
  );
}