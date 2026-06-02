'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import { Datas } from '../../../components/Datas/Datas';
import styles from './reservas.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_LABELS = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const STATUS_OPTIONS = ['pendente', 'confirmada', 'concluida', 'cancelada'];

// ─── Hook tipo arquivo ─────────────────────────────
function useContentType(url) {
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    if (!url) return setTipo(null);

    let cancelled = false;

    async function detectar() {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (cancelled) return;

        const ct = res.headers.get('content-type') || '';
        if (ct.includes('pdf')) setTipo('pdf');
        else if (ct.startsWith('image/')) setTipo('imagem');
        else setTipo('outro');
      } catch {
        if (!cancelled) setTipo('outro');
      }
    }

    detectar();
    return () => (cancelled = true);
  }, [url]);

  return tipo;
}

export default function ReservasPage() {
  const router = useRouter();
  const toast = useToast();

  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);

  const [counts, setCounts] = useState({
    total: 0,
    pendente: 0,
    confirmada: 0,
    concluida: 0,
    cancelada: 0,
  });

  const abortRef = useRef(null);

  // ─── FETCH ─────────────────────────────
  async function fetchReservas(page = 1, search = '') {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setCarregando(true);

    try {
      const params = new URLSearchParams({ page });
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`${API_URL}/reservas/?${params}`, {
        headers: authHeaders(),
        signal: controller.signal,
      });

      if (res.status === 401) return router.push('/login');

      const data = await res.json();

      const results = Array.isArray(data) ? data : (data.results ?? []);

      setReservas(results);

      setCounts({
        total: data.count ?? results.length,
        pendente: data.count_pendente ?? 0,
        confirmada: data.count_confirmada ?? 0,
        concluida: data.count_concluida ?? 0,
        cancelada: data.count_cancelada ?? 0,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast('Erro ao carregar reservas', 'erro');
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchReservas(pagina, busca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, busca]);

  // ─── AÇÕES ─────────────────────────────
  function abrirVer(r) {
    setModalVer(r);
  }

  function abrirEditar(r) {
    setModalEditar(r);
  }

  const badgeClass = (s) => {
    if (s === 'pendente' || s === 'confirmada') return styles.andamento;
    if (s === 'cancelada') return styles.cancelada;
    return styles.concluida;
  };

  if (carregando) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        Carregando...
      </main>
    );
  }

  const andamento = counts.pendente + counts.confirmada;

  return (
    <main className={styles.container}>

      <h1>RESERVAS</h1>

      {/* CARDS */}
      <section className={styles.stats}>
        <div><h2>{counts.total}</h2><p>Total</p></div>
        <div><h2>{andamento}</h2><p>Em andamento</p></div>
        <div><h2>{counts.cancelada}</h2><p>Canceladas</p></div>
        <div><h2>{counts.concluida}</h2><p>Concluídas</p></div>
      </section>

      {/* BUSCA */}
      <input
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPagina(1);
        }}
        placeholder="Buscar cliente..."
      />

      {/* TABELA */}
      <table className={styles.tabela}>
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
          {reservas.length === 0 ? (
            <tr>
              <td colSpan={5}>Nenhuma reserva encontrada</td>
            </tr>
          ) : (
            reservas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.cliente}</td>
                <td>{r.data}</td>

                <td>
                  <span className={`${styles.status} ${badgeClass(r.status)}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>

                <td>
                  <button onClick={() => abrirVer(r)}>Ver</button>
                  <button onClick={() => abrirEditar(r)}>Editar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAIS */}
      {modalVer && (
        <div onClick={() => setModalVer(null)} className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes</h2>
            <p>Cliente: {modalVer.cliente}</p>
            <p>Data: {modalVer.data}</p>
          </div>
        </div>
      )}

      {modalEditar && (
        <div onClick={() => setModalEditar(null)} className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Editar</h2>
            <p>ID: {modalEditar.id}</p>
          </div>
        </div>
      )}
    </main>
  );
}