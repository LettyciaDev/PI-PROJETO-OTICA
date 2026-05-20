'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './carrinho.module.css';
import { authHeaders } from '../../lib/api';
import { useToast } from '../../components/Toast/toast';

export default function Page() {
  const [oculos, setOculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('09:00');
  const [observacao, setObservacao] = useState('');
  const formularioRef = useRef(null);
  const router = useRouter();
  const mostrarToast = useToast();
  const [modalExcluir, setModalExcluir] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    const nomeUsuario = localStorage.getItem('full_name') ?? '';
    setNome(nomeUsuario); 

    async function fetchCarrinho() {
      try {
        const res = await fetch('http://localhost:8000/api/carrinho/', {
          headers: authHeaders(),
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const dados = await res.json();

        const lista = Array.isArray(dados) ? dados : (dados.results ?? []);

        setOculos(lista.map((item) => ({
          id:         item.id,
          oculosId:   item.oculos,
          nome:       item.nome,
          cor:        item.cor,
          lente: Array.isArray(item.lentes) && item.lentes.length > 0 ? item.lentes.join(', ') : 'Nenhuma escolhida',
          quantidade: item.quantidade,
          precoUnit:  parseFloat(item.preco_unit),
          imagem:     item.imagem_url,
          emoji:      '🕶️',
        })));
      } catch (err) {
        console.error('Erro ao buscar carrinho:', err);
      } finally {
        setCarregando(false);
      }
    }

    fetchCarrinho();
  }, []);

  async function aumentar(id) {
    const item = oculos.find((i) => i.id === id);
    if (!item) return;

    const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantidade: item.quantidade + 1 }),
    });

    if (res.ok) {
      setOculos(oculos.map((i) =>
        i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
      ));
    } else {
      const erro = await res.json();
      mostrarToast(erro.erro ?? 'Não foi possível aumentar.', 'aviso');
    }
  }

  async function diminuir(id) {
    const item = oculos.find((i) => i.id === id);
    if (!item) return;

    if (item.quantidade === 1) {
      pedirConfirmacaoExcluir(id);
      return;
    }

    const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantidade: item.quantidade - 1 }),
    });

    if (res.ok) {
      setOculos(oculos.map((i) =>
        i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i
      ));
    }
  }

  function abrirFormulario() { setMostrarFormulario(true); }

  useEffect(() => {
    if (mostrarFormulario && formularioRef.current) {
      formularioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrarFormulario]);

  async function enviarReserva() {
    if (!nome.trim() || !telefone.trim() || !data.trim()) {
      mostrarToast('Preencha nome, telefone e data de visita.', 'erro');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reservas/', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          nome_cliente: nome,
          telefone_whatsapp: telefone,
          data_visita: data,
          horario_visita: horario,
          observacoes: observacao,
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Erro ao confirmar reserva.', 'erro');
        return;
      }

      setOculos([]);
      setMostrarFormulario(false);
      setNome(''); setTelefone(''); setData(''); setHorario('09:00'); setObservacao('');
      mostrarToast('Reserva confirmada por 48h!', 'sucesso');

    } catch {
      mostrarToast('Erro de conexão. Tente novamente.', 'erro');
    }
  }

  function pedirConfirmacaoExcluir(id) {
    setModalExcluir(id);
  }

  async function confirmarExcluir() {
    const id = modalExcluir;
    setModalExcluir(null);
    const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) setOculos(oculos.filter((i) => i.id !== id));
  }

  if (carregando) {
    return (
      <div className={styles.containerCarregando}>
        <div className={styles.spinner}></div>
        <p className={styles.textoCarregando}>Buscando suas escolhas...</p>
      </div>
    );
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.secaoLista}>
        <h1 className={styles.titulo}>Reserve seus óculos</h1>

        {oculos.length === 0 ? (
          // FIX 2: carrinho vazio → botão para produtos
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: '20px' }}>
            <p style={{ color: '#999', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
              Seu carrinho está vazio.
            </p>
            <button
              className={styles.botaoConfirmar}
              onClick={() => router.push('/produtos')}
            >
              Ver novos produtos
            </button>
          </div>
        ) : (
          <ul className={styles.lista}>
            {oculos.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.iconeOculos}>
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className={styles.fotinha}
                    />
                  ) : (
                    <span>🕶️</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <p className={styles.nomeItem}>{item.nome}</p>
                  <p className={styles.detalhesItem}>
                    Cor: {item.cor} — Lente: {item.lente}
                  </p>
                </div>
                <div className={styles.controles}>
                  <button className={styles.botaoQtd} onClick={() => diminuir(item.id)}>−</button>
                  <span className={styles.quantidade}>{item.quantidade}</span>
                  <button className={styles.botaoQtd} onClick={() => aumentar(item.id)}>+</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* FIX 1: botão confirmar só aparece se tiver itens */}
        {oculos.length > 0 && (
          <div className={styles.rodape}>
            <button className={styles.botaoConfirmar} onClick={abrirFormulario}>
              Confirmar
            </button>
          </div>
        )}
      </div>

      {mostrarFormulario && (
        <div className={styles.secaoFormulario} ref={formularioRef}>
          <div className={styles.painelDuplo}>
            <div className={styles.painelResumo}>
              <h2 className={styles.tituloResumo}>Resumo da reserva</h2>
              <ul className={styles.listaResumo}>
                {oculos.filter((item) => item.quantidade > 0).map((item) => (
                  <li key={item.id} className={styles.itemResumo}>
                    <div className={styles.infoResumo}>
                      <span className={styles.nomeResumo}>{item.nome}</span>
                      <span className={styles.detalhesResumo}>Cor: {item.cor}</span>
                      <span className={styles.detalhesResumo}>Lente: {item.lente}</span>
                    </div>
                    <span className={styles.qtdResumo}>x{item.quantidade}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.painelFormulario}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 className={styles.tituloFormulario} style={{ margin: 0 }}>Insira seus dados</h2>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1.5rem', color: '#6b4c2a', lineHeight: 1, padding: 4,
                  }}
                  aria-label="Fechar formulário"
                >
                  ✕
                </button>
              </div>
              <h2 className={styles.tituloFormulario}>Insira seus dados</h2>

              <label className={styles.rotulo}>NOME COMPLETO</label>
              <input className={styles.campo} type="text" placeholder="Seu nome"
                value={nome} onChange={(e) => setNome(e.target.value)} />

              <label className={styles.rotulo}>TELEFONE / WHATSAPP</label>
              <input className={styles.campo} type="tel" placeholder="(+__) __ _ ____-____"
                value={telefone} onChange={(e) => setTelefone(e.target.value)} />

              <div className={styles.linhaData}>
                <div className={styles.grupoData}>
                  <label className={styles.rotulo}>DATA DE VISITA</label>
                  <input className={styles.campo} type="date"
                    value={data} onChange={(e) => setData(e.target.value)} />
                </div>
                <div className={styles.grupoHorario}>
                  <label className={styles.rotulo}>HORÁRIO</label>
                  <input className={styles.campo} type="time"
                    value={horario} onChange={(e) => setHorario(e.target.value)} />
                </div>
              </div>

              <label className={styles.rotulo}>OBSERVAÇÕES</label>
              <textarea className={styles.campoTextarea} placeholder="Observação"
                value={observacao} onChange={(e) => setObservacao(e.target.value)} />

              <button className={styles.botaoEnviar} onClick={enviarReserva}>
                CONFIRMAR RESERVA
              </button>
            </div>
          </div>
        </div>
      )}
      {modalExcluir !== null && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <span className={styles.emoji}>🗑️</span>
            <h2 className={styles.tituloModal}>
              Remover do carrinho?
            </h2>
            <p className={styles.descricaoModal}>
              {(() => {
                const item = oculos.find(i => i.id === modalExcluir);
                return item ? `${item.nome} — ${item.cor}` : '';
              })()}
            </p>
            <div className={styles.acoesModal}>
              <button
                onClick={() => setModalExcluir(null)}
                className={styles.botaoCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExcluir}
                className={styles.botaoRemover}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}