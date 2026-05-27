'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './clientes.module.css';

export default function ClientesAdmin() {

  const [clientes, setClientes] = useState([]);

  useEffect(() => {

    const dados = localStorage.getItem('clientes');

    if (dados) {
      setClientes(JSON.parse(dados));
    }

  }, []);

  return (

    <main className={styles.container}>

      {/* TOPO */}

      <div className={styles.topo}>

        <div>
          <h1>CLIENTES</h1>
          <p>Gerencie todos os clientes da ótica.</p>
        </div>

        <Link
          href="/admin/clientes/novo"
          className={styles.botaoNovo}
        >
          + Novo Cliente
        </Link>

      </div>

      {/* CARDS */}

      <section className={styles.cards}>

        <div className={styles.card}>
          <h2>{clientes.length}</h2>
          <p>Total de Clientes</p>
        </div>

        <div className={styles.card}>
          <h2>
            {
              clientes.filter(
                cliente => cliente.status === 'Ativo'
              ).length
            }
          </h2>
          <p>Clientes Ativos</p>
        </div>

        <div className={styles.card}>
          <h2>
            {
              clientes.filter(
                cliente => cliente.tipo === 'Premium'
              ).length
            }
          </h2>
          <p>Clientes Premium</p>
        </div>

      </section>

      {/* FILTROS */}

      <section className={styles.filtros}>

        <input
          type="text"
          placeholder="Buscar cliente..."
        />

        <select>
          <option>Todos</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>

      </section>

      {/* TABELA */}

      <section className={styles.tabelaContainer}>

        <table className={styles.tabela}>

          <thead>

            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>

          </thead>

          <tbody>

            {clientes.map((cliente) => (

              <tr key={cliente.id}>

                <td>
                  <strong>{cliente.nome}</strong>
                </td>

                <td>{cliente.telefone}</td>

                <td>{cliente.email}</td>

                <td>{cliente.tipo}</td>

                <td>

                  <span
                    className={`${styles.status} ${
                      styles[cliente.status.toLowerCase()]
                    }`}
                  >
                    {cliente.status}
                  </span>

                </td>

                <td className={styles.acoes}>

                  <button>Ver Perfil</button>

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