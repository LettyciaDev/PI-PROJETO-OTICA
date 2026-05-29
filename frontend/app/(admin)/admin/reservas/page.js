'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import { Datas } from '../../../components/Datas/Datas';
import styles from './reservas.module.css';

const STATUS_LABELS = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const STATUS_OPTIONS = ['pendente', 'confirmada', 'concluida', 'cancelada'];

// igual ao perfil
function useContentType(url) {
  const [tipo, setTipo] = useState(null);
  useEffect(() => {
    if (!url) return;
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('pdf')) setTipo('pdf');
        else if (ct.startsWith('image/')) setTipo('imagem');
        else setTipo('outro');
      })
      .catch(() => setTipo('outro'));
  }, [url]);
  return tipo;
}

export default function ReservasPage() {
  const router = useRouter();
  const mostrarToast = useToast();

  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [editStatus, setEditStatus] = useState('');
  const [editObsAdmin, setEditObsAdmin] = useState('');
  const [editData, setEditData] = useState('');
  const [editHorario, setEditHorario] = useState('09:00');

  useEffect(() => { fetchReservas(); }, []);

  async function fetchReservas() {
    try {
      const res = await fetch('http://localhost:8000/api/reservas/', { headers: authHeaders() });
      if (res.status === 401) { router.push('/login'); return; }
      const dados = await res.json();
      setReservas(Array.isArray(dados) ? dados : (dados.results ?? []));
    } catch {
      mostrarToast('Erro ao carregar reservas.', 'erro');
    } finally {
      setCarregando(false);
    }
  }

  function abrirVer(reserva) { setModalVer(reserva); }

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
      const res = await fetch(`http://localhost:8000/api/reservas/${modalEditar.id}/status/`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          observacoes_admin: editObsAdmin,
          data_visita: editData,
          horario_visita: editHorario,
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
    } catch {
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  const badgeClass = (status) => {
    if (status === 'pendente' || status === 'confirmada') return styles.andamento;
    if (status === 'cancelada') return styles.cancelada;
    return styles.concluida;
  };

  const total     = reservas.length;
  const ativas    = reservas.filter(r => r.status === 'pendente' || r.status === 'confirmada').length;
  const canceladas = reservas.filter(r => r.status === 'cancelada').length;
  const concluidas = reservas.filter(r => r.status === 'concluida').length;

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

      {/* CARDS */}
      <section className={styles.cardsContainer}>
        <div className={styles.card}><div className={styles.cardTitle}>Total</div><div className={styles.cardValue}>{total}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Ativas</div><div className={styles.cardValue}>{ativas}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Canceladas</div><div className={styles.cardValue}>{canceladas}</div></div>
        <div className={styles.card}><div className={styles.cardTitle}>Concluídas</div><div className={styles.cardValue}>{concluidas}</div></div>
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
            {reservas.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#999' }}>Nenhuma reserva encontrada.</td></tr>
            ) : reservas.map((r) => (
              <tr key={r.id}>
                <td>#{String(r.id).padStart(3, '0')}</td>
                <td>{r.nome_cliente}</td>
                <td>{r.data_visita} às {r.horario_visita?.slice(0, 5)}</td>
                <td><span className={`${styles.badge} ${badgeClass(r.status)}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                <td className={styles.actions}>
                  <button onClick={() => abrirVer(r)}>Ver</button>
                  <button onClick={() => abrirEditar(r)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MODAL VER */}
      {modalVer && <ModalVer reserva={modalVer} onFechar={() => setModalVer(null)} badgeClass={badgeClass} />}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className={styles.overlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalEditar(null)}>✕</button>
            <h2 className={styles.modalTitulo}>Editar reserva #{String(modalEditar.id).padStart(3, '0')}</h2>

            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>Status</label>
              <select className={styles.select} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>

              {/* componente Datas igual ao carrinho */}
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

// ── Modal Ver separado pra usar o hook useContentType limpo ──
function ModalVer({ reserva, onFechar, badgeClass }) {
  const receitaUrl = reserva.receita_url ?? null;
  const tipo = useContentType(receitaUrl);

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onFechar}>✕</button>
        <h2 className={styles.modalTitulo}>Reserva #{String(reserva.id).padStart(3, '0')}</h2>

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
            <span className={styles.modalValor}>{reserva.data_visita} às {reserva.horario_visita?.slice(0, 5)}</span>
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

        {/* Óculos reservados */}
        {reserva.itens?.length > 0 && (
          <div className={styles.itensBloco}>
            <span className={styles.modalLabel}>Óculos reservados</span>
            <ul className={styles.itensList}>
              {reserva.itens.map((item, i) => (
                <li key={i} className={styles.itemLinha}>
                  <span>{item.nome}</span>
                  <span style={{ color: '#999', fontSize: 12 }}>Cor: {item.cor} — x{item.quantidade}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Receita — igual ao perfil */}
        <div className={styles.receitaBloco}>
          <span className={styles.modalLabel}>Receita médica</span>

          {!receitaUrl ? (
            <p className={styles.modalValor} style={{ color: '#999', fontStyle: 'italic', fontFamily: 'Poppins, sans-serif' }}>
              Nenhuma receita anexada.
            </p>
          ) : (
            <>
              {tipo === null && (
                <p style={{ fontSize: 13, color: '#965A3E', fontFamily: 'Poppins, sans-serif' }}>Carregando visualização...</p>
              )}
              {tipo === 'imagem' && (
                <img
                  src={receitaUrl}
                  alt="Receita médica"
                  style={{ width: '100%', borderRadius: 8, border: '1px solid rgba(150,90,62,0.15)', marginBottom: 8 }}
                />
              )}
              {tipo === 'pdf' && (
                <p style={{ fontSize: 13, color: '#666', background: '#fdf8f5', padding: '12px 14px', borderRadius: 8, marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>
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