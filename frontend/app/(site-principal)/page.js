'use client';

import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className={styles.main}>

      <section className={styles.hero}>

        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
        >
          <source src="/home/videoHome.mp4" type="video/mp4" />
        </video>

        <nav className={styles.navbar}>
          <div className={styles.logo}></div>

        </nav>

        <div className={styles.heroContent}>
          <h1>
            <span className={styles.word1}>ENCONTRE</span> <br />

            <span className={styles.word2}>O ÓCULOS</span> <br />

            <strong className={`${styles.highlight} ${styles.word3}`}>
              PERFEITO
            </strong>
            <br />

            <span className={styles.word4}>para</span>{' '}

            <span className={`${styles.underline} ${styles.word5}`}>
              VOCÊ!
            </span>
          </h1>
        </div>

      </section>

      {/* COLEÇÕES */}
      <section className={styles.collections}>

        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          NOSSAS COLEÇÕES
        </motion.h2>

        <div className={styles.cards}>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src="/home/feminino.jpeg" alt="Feminino" />
            <h3>FEMININO</h3>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img src="/home/masculino.jpg" alt="Masculino" />
            <h3>MASCULINO</h3>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <img src="/home/infantil.jpg" alt="Infantil" />
            <h3>INFANTIL</h3>
          </motion.div>

        </div>

      </section>

    </main>
  );
}