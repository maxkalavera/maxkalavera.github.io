import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import styles from "src/styles/layout.module.css"

export default function Layout({
  children=undefined
}: {
  children?: JSX.Element
}): JSX.Element {
  return (
    <div className={`${styles.container}`}>
      <Header />
      <section className={`${styles.content}`}>
        {children}
      </section>
      <Footer />
    </div>
  )
}