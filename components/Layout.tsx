import styles from "styles/Layout.module.css"

export default function Layout({
  children=undefined
}: {
  children?: JSX.Element
}): JSX.Element {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <h3 className="primary-h3">Max Hernandez</h3>
        </div>
        <div className={styles.navbar}>
          <h3 className={`secondary-h3 ${styles.navbarItem}`}>Work</h3>
          <h3 className={`secondary-h3 ${styles.navbarItem}`}>About</h3>
          <h3 className={`secondary-h3 ${styles.navbarItem}`}>Contact</h3>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  )
}