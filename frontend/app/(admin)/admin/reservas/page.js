'use client';

import styles from './reservas.module.css';

export default function ReservasPage() {

  const reservas = [
    { id: '#001', cliente: 'Bento Guilherme', status: 'Em andamento', data: '22/04/2026' },
    { id: '#002', cliente: 'Lorenna Almeida', status: 'Cancelada', data: '23/04/2026' },
    { id: '#003', cliente: 'Lettycia Melo', status: 'Concluída', data: '24/04/2026' },
    { id: '#004', cliente: 'Anna Beatriz', status: 'Em andamento', data: '25/04/2026' },
  ];

  return (
    <main className={styles.container}>

      <h1 className={styles.title}>Reservas</h1>

      {/* CARDS */}
      <section className={styles.cardsContainer}>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Total</div>
          <div className={styles.cardValue}>{reservas.length}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Em andamento</div>
          <div className={styles.cardValue}>
            {reservas.filter(r => r.status === 'Em andamento').length}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Canceladas</div>
          <div className={styles.cardValue}>
            {reservas.filter(r => r.status === 'Cancelada').length}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Concluídas</div>
          <div className={styles.cardValue}>
            {reservas.filter(r => r.status === 'Concluída').length}
          </div>
        </div>

      </section>

      {/* TABELA */}
      <section className={styles.section}>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            {reservas.map((r) => (

              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.cliente}</td>
                <td>{r.data}</td>

                <td>
                  <span className={`${styles.badge} ${
                    r.status === 'Em andamento'
                      ? styles.andamento
                      : r.status === 'Cancelada'
                      ? styles.cancelada
                      : styles.concluida
                  }`}>
                    {r.status}
                  </span>
                </td>

                <td className={styles.actions}>
                  <button>Ver</button>
                  <button>Editar</button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

    </main>
  );
}