'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../../lib/api';
import { useToast } from '../../../../components/Toast/toast';
import styles from './novo.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NovoCliente() {
  const router       = useRouter();
  const mostrarToast = useToast();

  const [nome,     setNome]     = useState('');
  const [telefone, setTelefone] = useState('');
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState('Ativo');
  const [salvando, setSalvando] = useState(false);

  async function salvarCliente(e) {
    e.preventDefault();
    if (salvando) return;
    setSalvando(true);

    try {
      const res = await fetch(`${API_URL}/clientes/novo/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone, email, status }),
      });

      if (!res.ok) {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Erro ao cadastrar cliente.', 'erro');
        return;
      }

      mostrarToast('Cliente cadastrado com sucesso!', 'sucesso');
      router.push('/admin/clientes');
    } catch {
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>NOVO CLIENTE</h1>
        <p>Cadastre um novo cliente da ótica.</p>
      </div>

      <form className={styles.form} onSubmit={salvarCliente}>
        <div className={styles.grid}>

          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input
              type="text"
              placeholder="(81) 99999-9999"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

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
            disabled={salvando}
            style={{ opacity: salvando ? 0.6 : 1 }}
          >
            {salvando ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </main>
  );
}