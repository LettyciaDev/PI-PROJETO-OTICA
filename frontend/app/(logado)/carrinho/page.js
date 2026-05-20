'use client';
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import styles from './carrinho.module.css';
import { authHeaders } from '../../lib/api';
import { useToast } from '../../components/Toast/toast';
import { Datas } from '../../components/Datas/Datas';

export default function Page() {
  const [oculos, setOculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [formularioEstado, setFormularioEstado] = useState('fechado'); 
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('09:00');
  const [receita, setReceita] = useState(null);
  const [observacao, setObservacao] = useState('');
  const formularioRef = useRef(null);
  const router = useRouter();
  const inputReceitaRef = useRef(null);
  const topoListaRef = useRef(null);
  const mostrarToast = useToast();
  const [enviando, setEnviando] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(null);
  const [loadingItem, setLoadingItem] = useState(null);

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
    if (loadingItem !== null) return; 
    const item = oculos.find((i) => i.id === id);
    if (!item) return;

    setLoadingItem(id);
    try {
      const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ quantidade: item.quantidade + 1 }),
      });

      if (res.status === 401) { router.push('/login'); return; }

      if (res.ok) {
        setOculos(oculos.map((i) =>
          i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
        ));
      } else {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Não foi possível aumentar.', 'aviso');
      }
    } catch {
      mostrarToast('Erro de conexão. Tente novamente.', 'erro');
    } finally {
      setLoadingItem(null);
    }
  }

  async function diminuir(id) {
    if (loadingItem !== null) return;
    const item = oculos.find((i) => i.id === id);
    if (!item) return;

    if (item.quantidade === 1) {
      pedirConfirmacaoExcluir(id);
      return;
    }

    setLoadingItem(id);
    try {
      const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ quantidade: item.quantidade - 1 }),
      });

      if (res.status === 401) { router.push('/login'); return; }

      if (res.ok) {
        setOculos(oculos.map((i) =>
          i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i
        ));
      } else {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Não foi possível diminuir.', 'aviso');
      }
    } catch {
      mostrarToast('Erro de conexão. Tente novamente.', 'erro');
    } finally {
      setLoadingItem(null);
    }
  }

  function abrirFormulario() { setFormularioEstado('aberto'); }

  useEffect(() => {
    if (formularioEstado === 'aberto' && formularioRef.current) {
      formularioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formularioEstado]);

  useEffect(() => {
    if (oculos.length === 0 && formularioEstado === 'aberto') {
      fecharFormulario();
    }
  }, [oculos, formularioEstado, fecharFormulario]);

  function fecharFormulario() {
    if (formularioEstado !== 'aberto') return;
    setFormularioEstado('saindo');
    setTimeout(() => {
      setFormularioEstado('fechado');
      const topo = topoListaRef.current?.getBoundingClientRect().top ?? 0;
      const alturaNavbar = 80;
      window.scrollTo({
        top: window.scrollY + topo - alturaNavbar,
        behavior: 'smooth',
      });
    }, 300);
  }

  async function enviarReserva() {
    if (enviando) return;

    if (!nome.trim() || !telefone.trim() || !data.trim()) {
      mostrarToast('Preencha nome, telefone e data de visita.', 'erro');
      return;
    }

    if (receita) {
      const extensoesPermitidas = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
      const nomeArquivo = receita.name.toLowerCase();
      const extensaoValida = extensoesPermitidas.some(ext => nomeArquivo.endsWith(ext));
      if (!extensaoValida) {
        mostrarToast('Formato inválido. Use PDF, DOC, DOCX, PNG ou JPG.', 'erro');
        return;
      }
    }

    setEnviando(true); 

    try {
      const formData = new FormData();
      formData.append('nome_cliente', nome);
      formData.append('telefone_whatsapp', telefone);
      formData.append('data_visita', data);
      formData.append('horario_visita', horario);
      formData.append('observacoes', observacao);
      if (receita) formData.append('receita', receita);

      const headers = authHeaders();
      delete headers['Content-Type'];

      const res = await fetch('http://localhost:8000/api/reservas/', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const erro = await res.json();
        mostrarToast(erro.erro ?? 'Erro ao confirmar reserva.', 'erro');
        return;
      }

      setOculos([]);
      setNome(''); setTelefone(''); setData(''); setHorario('09:00');
      setObservacao(''); setReceita(null);
      mostrarToast('Reserva confirmada por 48h!', 'sucesso');
      fecharFormulario();

    } catch {
      mostrarToast('Erro de conexão. Tente novamente.', 'erro');
    } finally {
      setEnviando(false); 
    }
  }

  function pedirConfirmacaoExcluir(id) {
    setModalExcluir(id);
  }

  async function confirmarExcluir() {
    const id = modalExcluir;
    setModalExcluir(null);
    try {
      const res = await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.status === 401) { router.push('/login'); return; }
      if (res.ok) {
        setOculos(oculos.filter((i) => i.id !== id));
      } else {
        mostrarToast('Não foi possível remover. Tente novamente.', 'erro');
      }
    } catch {
      mostrarToast('Erro de conexão ao remover item.', 'erro');
    }
  }

  function aplicarMascaraTelefone(valor) {
    const digits = valor.replace(/\D/g, '').slice(0, 13);

    let mascara = '';

    if (digits.length === 0) return '';

    if (digits.length <= 2) {
      mascara = `(+${digits}`;
    }
    else if (digits.length <= 4) {
      mascara = `(+${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    else if (digits.length <= 8) {
      mascara = `(+${digits.slice(0, 2)}) ${digits.slice(2, 4)} ${digits.slice(4)}`;
    } else if (digits.length <= 12) {
      mascara = `(+${digits.slice(0, 2)}) ${digits.slice(2, 4)} ${digits.slice(4, 8)}-${digits.slice(8)}`;
    } else {
      mascara = `(+${digits.slice(0, 2)}) ${digits.slice(2, 4)} ${digits.slice(4, 5)} ${digits.slice(5, 9)}-${digits.slice(9)}`;
    }

    return mascara;
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
      <div className={styles.secaoLista} ref={topoListaRef}>
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
                  <button 
                    className={styles.botaoQtd} 
                    onClick={() => diminuir(item.id)}
                    disabled={loadingItem !== null}
                    style={{ opacity: loadingItem === item.id ? 0.4 : 1 }}
                  >{item.quantidade === 1 
                    ? <Image 
                        className={styles.lixo} 
                        style={{ marginLeft: 1.1 }} 
                        src="/carrinho/lixo.svg" 
                        width={18} 
                        height={18} 
                        alt="Lixo" 
                      /> 
                    : <span style={{ marginTop: 2, marginLeft: 1 }}>−</span>
                  }
                  </button>
                  <span className={styles.quantidade}>{item.quantidade}</span>
                  <button
                    className={styles.botaoQtd}
                    onClick={() => aumentar(item.id)}
                    disabled={loadingItem !== null}
                    style={{ opacity: loadingItem === item.id ? 0.4 : 1 }}
                  >
                    <span style={{ marginTop: 2, marginLeft: 1 }}>+</span>
                  </button>
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

      {formularioEstado !== 'fechado' && (
        <div className={`${styles.secaoFormulario} ${formularioEstado === 'saindo' ? styles.secaoFormularioSaindo : ''}`} ref={formularioRef}>
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
              <h2 className={styles.tituloFormulario}>Insira seus dados</h2>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, marginTop: -60}}>
                <button
                  onClick={fecharFormulario}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1.5rem', color: '#6b4c2a', lineHeight: 1, padding: 4,
                  }}
                  aria-label="Fechar formulário"
                >
                  ✕
                </button>
              </div>
              <label className={styles.rotulo}>NOME COMPLETO <span style={{ color: 'red' }}>*</span></label>
              <input className={styles.campo} type="text" placeholder="Seu nome"
                value={nome} onChange={(e) => setNome(e.target.value)} />

              <label className={styles.rotulo}>TELEFONE / WHATSAPP <span style={{ color: 'red' }}>*</span></label>
              <input
                className={styles.campo}
                type="tel"
                placeholder="(+__) __ _ ____-____"
                value={telefone}
                onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
              />
              <Datas
                value={data}
                onChange={(d) => {
                  if (!d) return
                  const ano = d.getFullYear()
                  const mes = String(d.getMonth() + 1).padStart(2, '0')
                  const dia = String(d.getDate()).padStart(2, '0')
                  setData(`${ano}-${mes}-${dia}`)
                }}
                horario={horario}
                onHorarioChange={setHorario}
              />

              <label className={styles.rotulo}>RECEITA MÉDICA (opcional)</label>
              <div
                className={styles.campo}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px' }}
                onClick={() => inputReceitaRef.current?.click()}
              >
                <Image src="/carrinho/attach.svg" width={20} height={20} alt="Clipzin"/>
                <span style={{ color: receita ? '#f5ede0' : '#f5ede0', fontSize: '0.9rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {receita ? receita.name : 'Clique para anexar (PDF, DOC, PNG, JPG)'}
                </span>
                {receita && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setReceita(null); }}
                    style={{ fontSize: '1rem', color: '#f5ede0', cursor: 'pointer' }}
                  >✕</span>
                )}
              </div>
              <input
                ref={inputReceitaRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={(e) => setReceita(e.target.files[0] ?? null)}
              />

              <label className={styles.rotulo}>OBSERVAÇÕES (opcional)</label>
              <textarea className={styles.campoTextarea} placeholder="Observação"
                value={observacao} onChange={(e) => setObservacao(e.target.value)} />

              <button 
                className={styles.botaoEnviar} 
                onClick={enviarReserva}
                disabled={enviando}
                style={{ opacity: enviando ? 0.6 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
              >
                {enviando ? 'ENVIANDO...' : 'CONFIRMAR RESERVA'}
              </button>
            </div>
          </div>
        </div>
      )}
      {modalExcluir !== null && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <Image className={styles.lixo} src="/carrinho/lixo.svg" width={50} height={50} alt="Lixo" />
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