import styles from './page.module.css';

export default function AgendarExames() {
  return (
    <section className={styles.scheduleSection}>

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

          <input type="date" />

          <input type="time" />

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
  );
}