'use client';

import styles from './page.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          controlsList="nodownload noplaybackrate"         
          className={styles.videoBackground}
        >
          <source src="/home/videoHome.mp4" type="video/mp4" />
        </video>

        <nav className={styles.navbar}>
          <div className={styles.logo}></div>
        </nav>

        <div className={styles.heroContent}>
          <h1>
            <span className={styles.word}>ENCONTRE</span> <br />
            <span className={styles.word}>O ÓCULOS</span> <br />
            <strong className={`${styles.highlight} ${styles.word}`}>
              PERFEITO
            </strong>
            <br />
            <span className={styles.word}>para</span>{' '}
            <span className={`${styles.underline} ${styles.word}`}>
              VOCÊ!
            </span>
          </h1>
        </div>
      </section>

      <section className={styles.collections}>
        <motion.h2
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
        >
          NOSSAS COLEÇÕES
        </motion.h2>

        <div className={styles.cards}>

          <Link href="/produtos" style={{ textDecoration: 'none' }}>
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true }} 
            >
              <img src="/home/feminino.jpeg" alt="Feminino" />
              <h3>FEMININO</h3>
            </motion.div>
          </Link>

          <Link href="/produtos" style={{ textDecoration: 'none' }}>
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="/home/masculino.webp" alt="Masculino" />
              <h3>MASCULINO</h3>
            </motion.div>
          </Link>

          <Link href="/produtos" style={{ textDecoration: 'none' }}>
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
          </Link>

        </div>
      </section>

      <section className={styles.lensSection}>

        <div className={styles.lensContainer}>

          {/* ========================= */}
          {/* TIPO DE CORREÇÃO */}
          {/* ========================= */}

          <section className={styles.lensCategory}>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              ESCOLHA O TIPO DE CORREÇÃO
            </motion.h2>

            <div className={styles.lensGrid}>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3>Lente Monofocal</h3>

                <p>
                  Ideal para correção de visão de perto ou de longe.
                </p>
              </motion.div>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3>Lente Bifocal</h3>

                <p>
                  Corrige duas distâncias em uma única lente.
                </p>
              </motion.div>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3>Lente Multifocal Progressiva</h3>

                <p>
                  Transição suave entre diferentes campos de visão.
                </p>
              </motion.div>

            </div>

          </section>

          {/* ========================= */}
          {/* TRATAMENTOS */}
          {/* ========================= */}

          <section className={styles.lensCategory}>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              ADICIONE UM TRATAMENTO
            </motion.h2>

            <div className={styles.lensGrid}>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3>Antirreflexo + Antirrisco</h3>

                <p>
                  Mais conforto visual e maior durabilidade para suas lentes.
                </p>
              </motion.div>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3>Filtro Blue Control</h3>

                <p>
                  Redução da luz azul emitida por telas digitais.
                </p>
              </motion.div>

            </div>

          </section>

          {/* ========================= */}
          {/* UPGRADE */}
          {/* ========================= */}

          <section className={styles.lensCategory}>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              UPGRADE COMPLETO
            </motion.h2>

            <div className={styles.lensGrid}>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3>Lente Fotossensível</h3>

                <p>
                  Escurecem automaticamente no sol para mais conforto.
                </p>
              </motion.div>

              <motion.div
                className={styles.lensOption}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3>Proteção UV + Hard Coat</h3>

                <p>
                  Proteção contra raios UV e maior resistência contra riscos.
                </p>
              </motion.div>

            </div>

          </section>


        </div>

    </section>
    {/* ========================= */}
{/* CATÁLOGO PREMIUM */}
{/* ========================= */}

<section className={styles.catalogSection}>

  <motion.h2
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    CATÁLOGO
  </motion.h2>

  <p className={styles.catalogSubtitle}>
    Principais Produtos
  </p>

  <div className={styles.catalogGrid}>

    {/* Masculino */}

    <motion.div
      className={styles.productCard}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <img src="/home/masculino-catalogo.jpg" alt="Óculos Masculino" />

      <div className={styles.productInfo}>
        <span>Óculos Masculino</span>

        <h3>Jean Monnier</h3>

        <p>Metal cinza</p>

        <strong>R$ 669,90</strong>

        <Link href="/produtos"><button>Reservar</button></Link>
      </div>
    </motion.div>

    {/* Feminino */}

    <motion.div
      className={styles.productCard}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <img src="/home/feminino-catalogo.jpeg" alt="Óculos Feminino" />

      <div className={styles.productInfo}>
        <span>Óculos Feminino</span>

        <h3>Vogue</h3>

        <p>Metal dourado</p>

        <strong>R$ 759,90</strong>

        <Link href="/produtos"><button>Reservar</button></Link>
      </div>
    </motion.div>

    {/* Infantil */}

    <motion.div
      className={styles.productCard}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      viewport={{ once: true }}
    >
      <img src="/home/infantil-catalogo.jpeg" alt="Óculos Infantil" />

      <div className={styles.productInfo}>
        <span>Óculos Infantil</span>

        <h3>Miraflex</h3>

        <p>Acetato azul</p>

        <strong>R$ 459,90</strong>

        <Link href="/produtos"><button>Reservar</button></Link>
      </div>
    </motion.div>

    <motion.div
      className={styles.productCard}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <img src="/home/unissex-catalogo.jpeg" alt="Óculos Unissex" />

      <div className={styles.productInfo}>
        <span>Óculos Unissex</span>

        <h3>Reserva</h3>

        <p>Acetato</p>

        <strong>R$ 529,90</strong>

        <Link href="/produtos"><button>Reservar</button></Link>
      </div>
    </motion.div>

  </div>

</section>
{/* ========================= */}
{/* PROMOÇÃO */}
{/* ========================= */}

<section className={styles.promoSection}>

  <div className={styles.promoLeft}>

    <span className={styles.promoTag}>
      DIA DOS NAMORADOS
    </span>

    <h2>
      Amor à <br />
      <span>Primeira Vista</span>
    </h2>

    <p className={styles.promoText}>
      Quem ama, combina até no olhar.
    </p>

    <div className={styles.promoCards}>

      <div className={styles.promoCard}>
        <h3>30% OFF</h3>
        <p>2º par do casal</p>
      </div>

      <div className={styles.promoCard}>
        <h3>Antirreflexo Grátis</h3>
        <p>na compra de 2 armações</p>
      </div>

    </div>

    <Link href="/produtos">
      <button className={styles.promoButton}>
        RESERVAR AGORA
      </button>
    </Link>
  </div>

</section>

{/* ========================= */}
{/* AGENDAMENTO */}
{/* ========================= */}

<section id="agendamento" className={styles.scheduleSection}>

  <div className={styles.scheduleLeft}>

    <span className={styles.scheduleTag}>
      EXAME DE VISTA
    </span>

    <h2>
      Agende seu <br />
      <span>Exame</span>
    </h2>

    <p className={styles.scheduleText}>
      Experiência completa em cuidado visual com profissionais parceiros especializados.  
      Na compra de lente + armação, seu exame sai gratuitamente.
    </p>

    <div className={styles.scheduleBenefits}>

      <div className={styles.scheduleBenefit}>
        ✔ Exame de refração completo
      </div>

      <div className={styles.scheduleBenefit}>
        ✔ Mapeamento de retina
      </div>

      <div className={styles.scheduleBenefit}>
        ✔ Resultado disponível por WhatsApp
      </div>

      <div className={styles.scheduleBenefit}>
        ✔ Atendimento rápido e personalizado
      </div>

    </div>

  </div>

  {/* FORMULÁRIO */}

  <div className={styles.scheduleFormBox}>

    <form className={styles.scheduleForm}>

      <input
        type="text"
        placeholder="Nome completo"
      />

      <input
        type="tel"
        placeholder="Telefone"
      />

      <select>
        <option>Tipo de consulta</option>
        <option>Exame de vista</option>
        <option>Retorno</option>
        <option>Avaliação completa</option>
      </select>

      <input
        type="date"
      />

      <input
        type="time"
      />

      <input
        type="text"
        placeholder="Convênio (Opcional)"
      />

      <button type="submit">
        Confirmar Agendamento
      </button>

    </form>

  </div>

</section>

{/* ========================= */}
{/* WHATSAPP CTA */}
{/* ========================= */}

<section id="contato" className={styles.whatsappSection}>

  <div className={styles.whatsappContent}>

    <div className={styles.whatsappText}>
      <h2>Chatbot WhatsApp • Atendimento 24h</h2>

      <p>
        Tire dúvidas, consulte preços e agende seu atendimento
        diretamente pelo WhatsApp.
      </p>
    </div>

    <a href="https://wa.me/5581984384624">
      <button className={styles.whatsappButton}>
        Iniciar conversa
      </button>
    </a>
  </div>

</section>
    </main>
  );
}