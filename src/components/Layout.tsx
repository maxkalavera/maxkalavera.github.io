import styles from "src/styles/layout.module.css"

export default function Layout({
  children=undefined
}: {
  children?: JSX.Element
}): JSX.Element {
  return (
    <>
      <section className={`${styles.container}`}>
        <div className={`${styles.header}`}>
          <div className={`${styles.logo}`}>
            <h3 
              style={{
                fontFamily: 'Bad Script',
                lineHeight: '130%'
              }}
              className="primary-h3"
            >
              Max Hernandez
            </h3>
          </div>
          <div className={`${styles.navbar}`}>
            <h3 className={`secondary-h3 ${styles.navbarItem} hexagon-background-animation`}>Work</h3>
            <h3 className={`secondary-h3 ${styles.navbarItem} hexagon-background-animation`}>About</h3>
            <h3 className={`secondary-h3 ${styles.navbarItem} hexagon-background-animation`}>Contact</h3>
          </div>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </section>
      <div id="canvas-container">
        <canvas id="canvas-background" />
      </div>
    </>
  )
}

/*
    <Head>
      <title>Max Hernandez</title>
    </Head>
*/