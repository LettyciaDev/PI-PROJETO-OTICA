'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import { Datas } from '../../../components/Datas/Datas';
import styles from './reservas.module.css';

// ─── Constantes ───────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_LABELS = {
  pendente:   'Pendente',
  confirmada: 'Confirmada',
  concluida:  'Concluída',
  cancelada:  'Cancelada',
};

const STATUS_OPTIONS = ['pendente', 'confirmada', 'concluida', 'cancelada'];

// ─── Hook: detecta tipo do arquivo via HEAD (com fallback GET) ────────────────
function useContentType(url) {
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    if (!url) { setTipo(null); return; }

    let cancelled = false;

    async function detectar() {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!cancelled) {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('pdf'))          setTipo('pdf');
          else if (ct.startsWith('image/')) setTipo('imagem');
          else                              setTipo('outro');
        }
        return;
      } catch {/* HEAD falhou */}

      try {
        const res = await fetch(url, { headers: { Range: 'bytes=0-0' } });
        if (!cancelled) {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('pdf'))          setTipo('pdf');
          else if (ct.startsWith('image/')) setTipo('imagem');
          else                              setTipo('outro');
        }
      } catch {
        if (!cancelled) setTipo('outro');
      }
    }

    detectar();
    return () => { cancelled = true; };
  }, [url]);

  return tipo;
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ReservasPage() {
  const router       = useRouter();
  const mostrarToast = useToast();

  const [reservas,    setReservas]    = useState([]);
  const [carregando,  setCarregando]  = useState(true);
  const [modalVer,    setModalVer]    = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [salvando,    setSalvando]    = useState(false);

  const [editStatus,   setEditStatus]   = useState('');
  const [editObsAdmin, setEditObsAdmin] = useState('');
  const [editData,     setEditData]     = useState('');
  const [editHorario,  setEditHorario]  = useState('09:00');

  const [busca,        setBusca]        = useState('');
  const [pagina,       setPagina]       = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [buscando, setBuscando] = useState(false);

  // Contagens globais vindas do backend
  const [counts, setCounts] = useState({
    total: 0, pendente: 0, confirmada: 0, concluida: 0, cancelada: 0,
  });

  const abortRef  = useRef(null);
  const buscaRef  = useRef(busca); // rastreia se foi a busca ou a página que mudou

  // ── Único useEffect de controle ────────────────────────────────────────────
  // Quando a busca muda: debounce de 400ms, busca silenciosa (sem tela de loading)
  // Quando só a página muda: busca imediata com loading normal
  useEffect(() => {
    const buscaMudou = buscaRef.current !== busca;
    buscaRef.current = busca;

    if (buscaMudou) {
      setBuscando(true);
      const timer = setTimeout(() => {
        setPagina(1);
        fetchReservas(1, busca, true); // silencioso=true: não joga na tela de loading
      }, 400);
      return () => clearTimeout(timer);
    } else {
      fetchReservas(pagina, busca, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, busca]);

  // ── Fetch principal ────────────────────────────────────────────────────────
  async function fetchReservas(pag = 1, search = '', silencioso = false) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Modo silencioso: a tabela continua visível enquanto busca no fundo
    if (!silencioso) setCarregando(true);

    try {
      const params = new URLSearchParams({ page: pag });
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`${API_URL}/reservas/?${params}`, {
        headers: authHeaders(),
        signal: controller.signal,
      });

      if (res.status === 401) { router.push('/login'); return; }

      const dados   = await res.json();
      const results = Array.isArray(dados) ? dados : (dados.results ?? []);
      const total   = dados.count ?? results.length;

      setReservas(results);
      setTotalPaginas(Math.ceil(total / 12) || 1);
      setCounts({
        total,
        pendente:   dados.count_pendente   ?? 0,
        confirmada: dados.count_confirmada ?? 0,
        concluida:  dados.count_concluida  ?? 0,
        cancelada:  dados.count_cancelada  ?? 0,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      mostrarToast('Erro ao carregar reservas.', 'erro');
    } finally {
      if (!silencioso) setCarregando(false);
      setBuscando(false);
    }
  }

  function abrirVer(reserva)    { setModalVer(reserva); }

  function abrirEditar(reserva) {
    setModalEditar(reserva);
    setEditStatus(reserva.status);
    setEditObsAdmin(reserva.observacoes_admin ?? '');
    setEditData(reserva.data_visita ?? '');
    setEditHorario(reserva.horario_visita?.slice(0, 5) ?? '09:00');
  }

  async function salvarEdicao() {
    if (salvando) return;
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/reservas/${modalEditar.id}/status/`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status:            editStatus,
          observacoes_admin: editObsAdmin,
          data_visita:       editData,
          horario_visita:    editHorario,
        }),
      });
      if (!res.ok) {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Erro ao salvar.', 'erro');
        return;
      }
      const atualizada = await res.json();
      setReservas(prev => prev.map(r => r.id === atualizada.id ? atualizada : r));
      mostrarToast('Reserva atualizada!', 'sucesso');
      setModalEditar(null);
      fetchReservas(pagina, busca, true); // atualiza contagens silenciosamente
    } catch {
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  const badgeClass = (s) => {
    if (s === 'pendente' || s === 'confirmada') return styles.andamento;
    if (s === 'cancelada')                      return styles.cancelada;
    return styles.concluida;
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
      <h1 className={styles.title}>Reservas</h1>

      {/* CARDS — valores globais do backend */}
      <section className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total</div>
          <div className={styles.cardValue}>{counts.total}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Ativas</div>
          <div className={styles.cardValue}>{counts.pendente + counts.confirmada}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Canceladas</div>
          <div className={styles.cardValue}>{counts.cancelada}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Concluídas</div>
          <div className={styles.cardValue}>{counts.concluida}</div>
        </div>
      </section>

      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
        <input
          className={styles.inputBusca}
          type="text"
          placeholder="Buscar por nome do cliente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        {buscando && (
          <span style={{
            fontSize: 12,
            color: '#965A3E',
            fontFamily: 'Poppins, sans-serif',
            whiteSpace: 'nowrap',
          }}>
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
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                  {busca ? 'Nenhuma reserva encontrada para essa busca.' : 'Nenhuma reserva encontrada.'}
                </td>
              </tr>
            ) : reservas.map((r) => (
              <tr key={r.id}>
                <td>#{String(r.id).padStart(3, '0')}</td>
                <td>{r.nome_cliente}</td>
                <td>{r.data_visita} às {r.horario_visita?.slice(0, 5)}</td>
                <td>
                  <span className={`${styles.badge} ${badgeClass(r.status)}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => abrirVer(r)}>Ver</button>
                  <button onClick={() => abrirEditar(r)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className={styles.botaoPagina}
            >
              ← Anterior
            </button>
            <span style={{ color: '#965A3E', fontSize: 13, fontFamily: 'Times New Roman, serif' }}>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className={styles.botaoPagina}
            >
              Próxima →
            </button>
          </div>
        )}
      </section>

      {/* MODAL VER */}
      {modalVer && (
        <ModalVer
          reserva={modalVer}
          onFechar={() => setModalVer(null)}
          badgeClass={badgeClass}
        />
      )}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className={styles.overlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalEditar(null)}>✕</button>
            <h2 className={styles.modalTitulo}>
              Editar reserva #{String(modalEditar.id).padStart(3, '0')}
            </h2>

            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>Status</label>
              <select
                className={styles.select}
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>

              <Datas
                value={editData}
                onChange={(d) => {
                  if (!d) return;
                  const ano = d.getFullYear();
                  const mes = String(d.getMonth() + 1).padStart(2, '0');
                  const dia = String(d.getDate()).padStart(2, '0');
                  setEditData(`${ano}-${mes}-${dia}`);
                }}
                horario={editHorario}
                onHorarioChange={setEditHorario}
                label="Data da visita"
              />

              <label className={styles.modalLabel}>Observações do admin</label>
              <textarea
                className={styles.textarea}
                rows={4}
                value={editObsAdmin}
                onChange={e => setEditObsAdmin(e.target.value)}
                placeholder="Anotações internas sobre essa reserva..."
              />

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

// ─── Modal Ver ────────────────────────────────────────────────────────────────
function ModalVer({ reserva, onFechar, badgeClass }) {
  const receitaUrl = reserva.receita_url ?? null;
  const tipo       = useContentType(receitaUrl);

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onFechar}>✕</button>
        <h2 className={styles.modalTitulo}>
          Reserva #{String(reserva.id).padStart(3, '0')}
        </h2>

        <div className={styles.modalGrid}>
          <div className={styles.modalCampo}>
            <span className={styles.modalLabel}>Cliente</span>
            <span className={styles.modalValor}>{reserva.nome_cliente}</span>
          </div>
          <div className={styles.modalCampo}>
            <span className={styles.modalLabel}>Telefone</span>
            <span className={styles.modalValor}>{reserva.telefone_whatsapp}</span>
          </div>
          <div className={styles.modalCampo}>
            <span className={styles.modalLabel}>Data da visita</span>
            <span className={styles.modalValor}>
              {reserva.data_visita} às {reserva.horario_visita?.slice(0, 5)}
            </span>
          </div>
          <div className={styles.modalCampo}>
            <span className={styles.modalLabel}>Status</span>
            <span className={`${styles.badge} ${badgeClass(reserva.status)}`}>
              {STATUS_LABELS[reserva.status] ?? reserva.status}
            </span>
          </div>
          {reserva.observacoes && (
            <div className={`${styles.modalCampo} ${styles.fullWidth}`}>
              <span className={styles.modalLabel}>Observações do cliente</span>
              <span className={styles.modalValor}>{reserva.observacoes}</span>
            </div>
          )}
          {reserva.observacoes_admin && (
            <div className={`${styles.modalCampo} ${styles.fullWidth}`}>
              <span className={styles.modalLabel}>Observações do admin</span>
              <span className={styles.modalValor}>{reserva.observacoes_admin}</span>
            </div>
          )}
        </div>

        {reserva.itens?.length > 0 && (
          <div className={styles.itensBloco}>
            <span className={styles.modalLabel}>Óculos reservados</span>
            <ul className={styles.itensList}>
              {reserva.itens.map((item, i) => (
                <li key={i} className={styles.itemLinha}>
                  <span>{item.nome}</span>
                  <span style={{ color: '#999', fontSize: 12 }}>
                    Cor: {item.cor} — x{item.quantidade}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.receitaBloco}>
          <span className={styles.modalLabel}>Receita médica</span>

          {!receitaUrl ? (
            <p
              className={styles.modalValor}
              style={{ color: '#999', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}
            >
              Nenhuma receita anexada.
            </p>
          ) : (
            <>
              {tipo === null && (
                <p style={{ fontSize: 13, color: '#965A3E', fontFamily: 'Poppins, sans-serif' }}>
                  Carregando visualização...
                </p>
              )}
              {tipo === 'imagem' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={receitaUrl}
                  alt="Receita médica"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid rgba(150,90,62,0.15)',
                    marginBottom: 8,
                  }}
                />
              )}
              {tipo === 'pdf' && (
                <p
                  style={{
                    fontSize: 13,
                    color: '#666',
                    background: '#fdf8f5',
                    padding: '12px 14px',
                    borderRadius: 8,
                    marginBottom: 8,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Visualização de PDF não disponível no navegador. Use o botão abaixo para baixar.
                </p>
              )}
              {tipo === 'outro' && (
                <p style={{ fontSize: 13, color: '#666', marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>
                  Tipo de arquivo não suportado para pré-visualização.
                </p>
              )}
              <a
                href={receitaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkReceita}
              >
                Baixar receita
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}