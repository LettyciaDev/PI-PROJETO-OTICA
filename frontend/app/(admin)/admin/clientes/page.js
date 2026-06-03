'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import styles from './clientes.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClientesAdmin() {
  const router       = useRouter();
  const mostrarToast = useToast();

  const [clientes,     setClientes]     = useState([]);
  const [carregando,   setCarregando]   = useState(true);
  const [modalVer,     setModalVer]     = useState(null);
  const [modalEditar,  setModalEditar]  = useState(null);
  const [salvando,     setSalvando]     = useState(false);

  const [editNome,     setEditNome]     = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEmail,    setEditEmail]    = useState('');
  const [editStatus,   setEditStatus]   = useState('');

  const [busca,        setBusca]        = useState('');
  const [buscando,     setBuscando]     = useState(false);
  const [pagina,       setPagina]       = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [counts,       setCounts]       = useState({ total: 0, ativos: 0, inativos: 0 });

  const abortRef = useRef(null);
  const buscaRef = useRef(busca);

  useEffect(() => {
    const buscaMudou = buscaRef.current !== busca;
    buscaRef.current = busca;

    if (buscaMudou) {
      setBuscando(true);
      const timer = setTimeout(() => {
        setPagina(1);
        fetchClientes(1, busca, true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      fetchClientes(pagina, busca, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, busca]);

  async function fetchClientes(pag = 1, search = '', silencioso = false) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!silencioso) setCarregando(true);

    try {
      const params = new URLSearchParams({ page: pag });
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`${API_URL}/clientes/?${params}`, {
        headers: authHeaders(),
        signal: controller.signal,
      });

      if (res.status === 401) { router.push('/login'); return; }

      const dados   = await res.json();
      const results = Array.isArray(dados) ? dados : (dados.results ?? []);
      const total   = dados.count ?? results.length;

      setClientes(results);
      setTotalPaginas(Math.ceil(total / 12) || 1);
      setCounts({
        total,
        ativos:   dados.count_ativos   ?? results.filter(c => c.status === 'Ativo').length,
        inativos: dados.count_inativos ?? results.filter(c => c.status === 'Inativo').length,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      mostrarToast('Erro ao carregar clientes.', 'erro');
    } finally {
      if (!silencioso) setCarregando(false);
      setBuscando(false);
    }
  }

  function abrirEditar(cliente) {
    setModalEditar(cliente);
    setEditNome(cliente.nome ?? '');
    setEditTelefone(cliente.telefone ?? '');
    setEditEmail(cliente.email ?? '');
    setEditStatus(cliente.status ?? 'Ativo');
  }

  async function salvarEdicao() {
    console.log('salvando...', { editNome, editTelefone, editEmail, editStatus });
    if (salvando) return;
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/clientes/${modalEditar.id}/`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:     editNome,
          telefone: editTelefone,
          email:    editEmail,
          status:   editStatus,
        }),
      });

      console.log('status da resposta:', res.status);

      if (!res.ok) {
        const erro = await res.json();
        console.log('erro do backend:', erro);
        mostrarToast(erro.erro ?? 'Erro ao salvar.', 'erro');
        return;
      }

      const atualizado = await res.json();
      console.log('resposta do backend:', atualizado);

      setClientes(prev => prev.map(c => c.id === atualizado.id ? atualizado : c));

      setCounts(prev => {
        if (editStatus === atualizado.status) return prev;
        const foiAtivar = atualizado.status === 'Ativo';
        return {
          ...prev,
          ativos:   prev.ativos   + (foiAtivar ? 1 : -1),
          inativos: prev.inativos + (foiAtivar ? -1 : 1),
        };
      });

      mostrarToast('Cliente atualizado!', 'sucesso');
      setModalEditar(null);
    } catch (err) {
      console.log('erro de conexão:', err);
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <p style={{ color: '#965A3E', fontFamily: 'Joan, serif', fontSize: '20px' }}>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>

      {/* TOPO */}
      <div className={styles.topo}>
        <div>
          <h1>CLIENTES</h1>
          <p>Gerencie todos os clientes da ótica.</p>
        </div>
        <button className={styles.botaoNovo} onClick={() => router.push('/admin/clientes/novo')}>
          + Novo Cliente
        </button>
      </div>

      {/* CARDS */}
      <section className={styles.cards}>
        <div className={styles.card}>
          <h2>{counts.total}</h2>
          <p>Total de Clientes</p>
        </div>
        <div className={styles.card}>
          <h2>{counts.ativos}</h2>
          <p>Clientes Ativos</p>
        </div>
        <div className={styles.card}>
          <h2>{counts.inativos}</h2>
          <p>Clientes Inativos</p>
        </div>
      </section>

      {/* BUSCA */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
        <input
          className={styles.inputBusca}
          type="text"
          placeholder="Buscar cliente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        {buscando && (
          <span style={{ fontSize: 12, color: '#965A3E', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>
            Buscando...
          </span>
        )}
      </div>

      {/* TABELA */}
      <section className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                  {busca ? 'Nenhum cliente encontrado para essa busca.' : 'Nenhum cliente cadastrado.'}
                </td>
              </tr>
            ) : clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td><strong>{cliente.nome}</strong></td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>
                  <span className={`${styles.status} ${styles[cliente.status?.toLowerCase()]}`}>
                    {cliente.status}
                  </span>
                </td>
                <td className={styles.acoes}>
                  <button onClick={() => setModalVer(cliente)}>Ver</button>
                  <button onClick={() => abrirEditar(cliente)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24, paddingBottom: 24 }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} className={styles.botaoPagina}>← Anterior</button>
            <span style={{ color: '#965A3E', fontSize: 13, fontFamily: 'Times New Roman, serif' }}>Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className={styles.botaoPagina}>Próxima →</button>
          </div>
        )}
      </section>

      {/* MODAL VER */}
      {modalVer && (
        <div className={styles.overlay} onClick={() => setModalVer(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalVer(null)}>✕</button>
            <h2 className={styles.modalTitulo}>{modalVer.nome}</h2>
            <div className={styles.modalGrid}>
              <Campo label="Telefone" valor={modalVer.telefone || '—'} />
              <Campo label="Email"    valor={modalVer.email || '—'} />
              <Campo label="Status"   valor={
                <span className={`${styles.statusVer} ${styles[modalVer.status?.toLowerCase()]}`}>
                  {modalVer.status}
                </span>
              } />
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className={styles.overlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalEditar(null)}>✕</button>
            <h2 className={styles.modalTitulo}>Editar cliente</h2>
            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>Nome</label>
              <input className={styles.inputModal} type="text" value={editNome} onChange={e => setEditNome(e.target.value)} />

              <label className={styles.modalLabel}>Telefone</label>
              <input className={styles.inputModal} type="text" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} />

              <label className={styles.modalLabel}>Email</label>
              <input className={styles.inputModal} type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />

              <label className={styles.modalLabel}>Status</label>
              <select className={styles.select} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>

              <button
                className={styles.botaoSalvar}
                onClick={salvarEdicao}
                disabled={salvando}
                style={{ opacity: salvando ? 0.6 : 1 }}
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Campo({ label, valor }) {
  return (
    <div className={styles.modalCampo}>
      <span className={styles.modalLabel}>{label}</span>
      <span className={styles.modalValor}>{valor}</span>
    </div>
  );
}