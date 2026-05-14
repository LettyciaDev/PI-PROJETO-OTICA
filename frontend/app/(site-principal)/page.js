import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <h1>
            ENCONTRE <br />
            <span>O ÓCULOS</span> <br />
            <strong className={styles.highlight}>PERFEITO</strong> <br />
            para <span className={styles.underline}>VOCÊ!</span>
          </h1>
        </div>
      </section>
    </main>
  );
}