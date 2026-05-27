'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './agenda.module.css';

export default function AgendaAdmin() {

  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem('agendamentos');

    if (dados) {
      setAgendamentos(JSON.parse(dados));
    }
  }, []);

  return (
    <main className={styles.container}>

      <div className={styles.topo}>
        <h1>AGENDA</h1>

        <Link href="/admin/agenda/novo" className={styles.botaoNovo}>
          + Novo Evento
        </Link>
      </div>

      <section className={styles.stats}>

        <div className={styles.cardStat}>
          <h2>{agendamentos.length}</h2>
          <p>Total de Eventos</p>
        </div>

        <div className={styles.cardStat}>
          <h2>{agendamentos.filter(i => i.status === 'Pendente').length}</h2>
          <p>Pendentes</p>
        </div>

        <div className={styles.cardStat}>
          <h2>{agendamentos.filter(i => i.status === 'Confirmado').length}</h2>
          <p>Confirmados</p>
        </div>

        <div className={styles.cardStat}>
          <h2>{agendamentos.filter(i => i.tipo === 'BOLETO').length}</h2>
          <p>Boletos</p>
        </div>

      </section>

      <section className={styles.filtros}>
        <input type="text" placeholder="Buscar..." />
        <select>
          <option>Status</option>
          <option>Pendente</option>
          <option>Confirmado</option>
          <option>Cancelado</option>
        </select>

        <select>
          <option>Tipo</option>
          <option>CONSULTA</option>
          <option>VISITA_TECNICA</option>
          <option>BOLETO</option>
          <option>ESTOQUE</option>
          <option>OUTRO</option>
        </select>

        <input type="date" />
      </section>

      <section className={styles.tabelaContainer}>

        <table className={styles.tabela}>

          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            {agendamentos.map((item) => (
              <tr key={item.id}>

                <td>
                  <strong>{item.titulo}</strong>
                  {item.nome && <span>{item.nome}</span>}
                </td>

                <td>
                  <span className={`${styles.tipo} ${styles[item.tipo?.toLowerCase()]}`}>
                    {item.tipo}
                  </span>
                </td>

                <td>{item.data}</td>

                <td>{item.horario}</td>

                <td>
                  <span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                    {item.status}
                  </span>
                </td>

                <td className={styles.acoes}>
                  <button>Confirmar</button>
                  <button>Remarcar</button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </section>

    </main>
  );
}