'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './novo.module.css';

export default function NovoCliente() {

  const router = useRouter();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [observacoes, setObservacoes] = useState('');

  function salvarCliente(e) {

    e.preventDefault();

    const novoCliente = {
      id: Date.now(),
      nome,
      telefone,
      email,
      cpf,
      tipo,
      status,
      observacoes
    };

    const clientes =
      JSON.parse(localStorage.getItem('clientes')) || [];

    clientes.push(novoCliente);

    localStorage.setItem(
      'clientes',
      JSON.stringify(clientes)
    );

    router.push('/admin/clientes');
  }

  return (

    <main className={styles.container}>

      <div className={styles.header}>

        <h1>NOVO CLIENTE</h1>

        <p>
          Cadastre um novo cliente da ótica.
        </p>

      </div>

      <form
        className={styles.form}
        onSubmit={salvarCliente}
      >

        <div className={styles.grid}>

          <div className={styles.inputGroup}>
            <label>Nome</label>

            <input
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>

            <input
              type="text"
              placeholder="(81) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>CPF</label>

            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Tipo de Cliente</label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option>Premium</option>
              <option>Padrão</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>

        </div>

        <div className={styles.inputGroup}>

          <textarea
            placeholder="Informações adicionais..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <div className={styles.botoes}>

          <button
            type="button"
            className={styles.cancelar}
            onClick={() => router.push('/admin/clientes')}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={styles.confirmar}
          >
            Salvar Cliente
          </button>

        </div>

      </form>

    </main>

  );
}