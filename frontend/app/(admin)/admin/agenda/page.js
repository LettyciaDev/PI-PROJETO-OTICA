'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import styles from './agenda.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_LABELS = {
  pendente:   'Pendente',
  confirmado: 'Confirmado',
  cancelado:  'Cancelado',
  concluido:  'Concluído',
};

const STATUS_OPTIONS = ['pendente', 'confirmado', 'cancelado', 'concluido'];

const PERIODO_LABELS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  qualquer: 'Qualquer',
};

export default function AgendaAdmin() {
  const router       = useRouter();
  const mostrarToast = useToast();

  const [exames,      setExames]      = useState([]);
  const [carregando,  setCarregando]  = useState(true);
  const [modalVer,    setModalVer]    = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [salvando,    setSalvando]    = useState(false);

  const [editStatus,        setEditStatus]        = useState('');
  const [editDataConfirm,   setEditDataConfirm]   = useState('');
  const [editHorarioConfirm,setEditHorarioConfirm]= useState('');
  const [editObsAdmin,      setEditObsAdmin]      = useState('');
  const [editRetorno,       setEditRetorno]       = useState('');

  const [busca,        setBusca]        = useState('');
  const [buscando,     setBuscando]     = useState(false);
  const [pagina,       setPagina]       = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [counts,       setCounts]       = useState({
    total: 0, pendente: 0, confirmado: 0, concluido: 0, cancelado: 0,
  });

  const abortRef = useRef(null);
  const buscaRef = useRef(busca);

  useEffect(() => {
    const buscaMudou = buscaRef.current !== busca;
    buscaRef.current = busca;

    if (buscaMudou) {
      setBuscando(true);
      const timer = setTimeout(() => {
        setPagina(1);
        fetchExames(1, busca, true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      fetchExames(pagina, busca, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, busca]);

  async function fetchExames(pag = 1, search = '', silencioso = false) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!silencioso) setCarregando(true);

    try {
      const params = new URLSearchParams({ page: pag });
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`${API_URL}/exames/?${params}`, {
        headers: authHeaders(),
        signal: controller.signal,
      });

      if (res.status === 401) { router.push('/login'); return; }

      const dados   = await res.json();
      const results = Array.isArray(dados) ? dados : (dados.results ?? []);
      const total   = dados.count ?? results.length;

      setExames(results);
      setTotalPaginas(Math.ceil(total / 12) || 1);
      setCounts({
        total,
        pendente:   dados.count_pendente   ?? results.filter(e => e.status === 'pendente').length,
        confirmado: dados.count_confirmado ?? results.filter(e => e.status === 'confirmado').length,
        concluido:  dados.count_concluido  ?? results.filter(e => e.status === 'concluido').length,
        cancelado:  dados.count_cancelado  ?? results.filter(e => e.status === 'cancelado').length,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      mostrarToast('Erro ao carregar exames.', 'erro');
    } finally {
      if (!silencioso) setCarregando(false);
      setBuscando(false);
    }
  }

  function abrirEditar(exame) {
    setModalEditar(exame);
    setEditStatus(exame.status);
    setEditDataConfirm(exame.data_confirmada ?? '');
    setEditHorarioConfirm(exame.horario_confirmado?.slice(0, 5) ?? '');
    setEditObsAdmin(exame.observacoes_admin ?? '');
    setEditRetorno(exame.retorno_cliente ?? '');
  }

  async function salvarEdicao() {
    if (salvando) return;
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/exames/${modalEditar.id}/status/`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status:           editStatus,
          data_confirmada:  editDataConfirm  || null,
          horario_confirmado: editHorarioConfirm || null,
          observacoes_admin: editObsAdmin,
          retorno_cliente:  editRetorno,
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Erro ao salvar.', 'erro');
        return;
      }

      const atualizado = await res.json();
      setExames(prev => prev.map(e => e.id === atualizado.id ? atualizado : e));
      mostrarToast('Exame atualizado!', 'sucesso');

      // Se veio link de WhatsApp, abre numa nova aba
      if (atualizado.whatsapp_url) {
        window.open(atualizado.whatsapp_url, '_blank');
      }

      setModalEditar(null);
      fetchExames(pagina, busca, true);
    } catch {
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  const badgeClass = (s) => {
    if (s === 'pendente')   return styles.pendente;
    if (s === 'confirmado') return styles.confirmado;
    if (s === 'cancelado')  return styles.cancelado;
    return styles.concluido;
  };

  if (carregando) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <p style={{ color: '#965A3E', fontFamily: 'Joan, serif', fontSize: '20px' }}>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.title}>Agenda de Exames</h1>
        <button className={styles.botaoNovo} onClick={() => router.push('/admin/agenda/novo')}>
          + Novo Agendamento
        </button>
      </div>

      {/* CARDS */}
      <section className={styles.cardsContainer}>
        <div className={styles.card}><div className={styles.cardTitle}>Total</div><div className={styles.cardValue}>{counts.total}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Pendentes</div><div className={styles.cardValue}>{counts.pendente}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Confirmados</div><div className={styles.cardValue}>{counts.confirmado}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Concluídos</div><div className={styles.cardValue}>{counts.concluido}</div></div>
      </section>

      {/* BUSCA */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
        <input
          className={styles.inputBusca}
          type="text"
          placeholder="Buscar por nome do cliente..."
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
      <section className={styles.section}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Preferência</th>
              <th>Período</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exames.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                  {busca ? 'Nenhum exame encontrado para essa busca.' : 'Nenhum exame agendado.'}
                </td>
              </tr>
            ) : exames.map((e) => (
              <tr key={e.id}>
                <td>#{String(e.id).padStart(3, '0')}</td>
                <td>{e.nome_cliente}</td>
                <td>{e.data_preferencia}</td>
                <td>{PERIODO_LABELS[e.periodo_preferido] ?? e.periodo_preferido}</td>
                <td>
                  <span className={`${styles.badge} ${badgeClass(e.status)}`}>
                    {STATUS_LABELS[e.status] ?? e.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => setModalVer(e)}>Ver</button>
                  <button onClick={() => abrirEditar(e)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
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
            <h2 className={styles.modalTitulo}>Exame #{String(modalVer.id).padStart(3, '0')}</h2>

            <div className={styles.modalGrid}>
              <Campo label="Cliente"   valor={modalVer.nome_cliente} />
              <Campo label="Telefone"  valor={modalVer.telefone_whatsapp} />
              <Campo label="Convênio"  valor={modalVer.convenio || '—'} />
              <Campo label="Preferência" valor={`${modalVer.data_preferencia} · ${PERIODO_LABELS[modalVer.periodo_preferido] ?? modalVer.periodo_preferido}`} />
              <Campo label="Status"    valor={
                <span className={`${styles.badge} ${badgeClass(modalVer.status)}`}>
                  {STATUS_LABELS[modalVer.status] ?? modalVer.status}
                </span>
              } />
              {modalVer.data_confirmada && (
                <Campo label="Data confirmada" valor={`${modalVer.data_confirmada}${modalVer.horario_confirmado ? ' às ' + modalVer.horario_confirmado.slice(0,5) : ''}`} />
              )}
              {modalVer.observacoes && (
                <Campo label="Obs. do cliente" valor={modalVer.observacoes} fullWidth />
              )}
              {modalVer.observacoes_admin && (
                <Campo label="Obs. internas"   valor={modalVer.observacoes_admin} fullWidth />
              )}
              {modalVer.retorno_cliente && (
                <Campo label="Retorno ao cliente" valor={modalVer.retorno_cliente} fullWidth />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className={styles.overlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalEditar(null)}>✕</button>
            <h2 className={styles.modalTitulo}>Editar exame #{String(modalEditar.id).padStart(3, '0')}</h2>

            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>Status</label>
              <select className={styles.select} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>

              <label className={styles.modalLabel}>Data confirmada</label>
              <input className={styles.inputModal} type="date" value={editDataConfirm} onChange={e => setEditDataConfirm(e.target.value)} />

              <label className={styles.modalLabel}>Horário confirmado</label>
              <input className={styles.inputModal} type="time" value={editHorarioConfirm} onChange={e => setEditHorarioConfirm(e.target.value)} />

              <label className={styles.modalLabel}>Observações internas</label>
              <textarea className={styles.textarea} rows={3} value={editObsAdmin} onChange={e => setEditObsAdmin(e.target.value)} placeholder="Anotações internas..." />

              <label className={styles.modalLabel}>Retorno ao cliente</label>
              <textarea className={styles.textarea} rows={3} value={editRetorno} onChange={e => setEditRetorno(e.target.value)} placeholder="Mensagem que será enviada por WhatsApp..." />

              <p style={{ fontSize: 11, color: '#999', fontFamily: 'Poppins, sans-serif', marginTop: -8 }}>
                Preencher este campo abre link de WhatsApp.
              </p>

              <button className={styles.botaoSalvar} onClick={salvarEdicao} disabled={salvando} style={{ opacity: salvando ? 0.6 : 1 }}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Campo({ label, valor, fullWidth }) {
  return (
    <div className={`${styles.modalCampo} ${fullWidth ? styles.fullWidth : ''}`}>
      <span className={styles.modalLabel}>{label}</span>
      <span className={styles.modalValor}>{valor}</span>
    </div>
  );
}