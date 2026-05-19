'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './carrinho.module.css';
import { authHeaders } from '../../lib/api';

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

  useEffect(() => {
    // Se não tiver token, manda pro login
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

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
        setOculos((dados.results ?? dados).map((item) => ({
          id:        item.id,
          oculosId:  item.oculos,
          nome:      item.nome,
          cor:       item.cor,
          lente:     item.lentes?.join(', ') || 'Padrão',
          quantidade: item.quantidade,
          precoUnit: parseFloat(item.preco_unit),
          imagem:    item.imagem,
          emoji:     '🕶️',
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

    await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantidade: item.quantidade + 1 }),
    });

    setOculos(oculos.map((i) =>
      i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
    ));
  }

  async function diminuir(id) {
    const item = oculos.find((i) => i.id === id);
    if (!item) return;

    if (item.quantidade === 1) {
      await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      setOculos(oculos.filter((i) => i.id !== id));
      return;
    }

    await fetch(`http://localhost:8000/api/carrinho/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantidade: item.quantidade - 1 }),
    });

    setOculos(oculos.map((i) =>
      i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i
    ));
  }

  function abrirFormulario() { setMostrarFormulario(true); }

  useEffect(() => {
    if (mostrarFormulario && formularioRef.current) {
      formularioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrarFormulario]);

  function enviarReserva() {
    if (!nome.trim() || !telefone.trim() || !data.trim()) {
      alert('Por favor, preencha nome, telefone e data de visita.');
      return;
    }
    const itens = oculos
      .filter((item) => item.quantidade > 0)
      .map((item) => `${item.nome} x${item.quantidade}`)
      .join('\n');
    alert(`Reserva confirmada por 48h!\n\nCliente: ${nome}\nTelefone: ${telefone}\nData: ${data} às ${horario}\n\nÓculos:\n${itens}${observacao ? `\n\nObservações: ${observacao}` : ''}`);
  }

  if (carregando) return <p style={{ padding: 32 }}>Carregando carrinho...</p>;

  return (
    <div className={styles.pagina}>
      <div className={styles.secaoLista}>
        <h1 className={styles.titulo}>Reserve seus óculos</h1>

        {oculos.length === 0 ? (
          <p style={{ padding: '32px 0', color: '#999', textAlign: 'center' }}>
            Seu carrinho está vazio.
          </p>
        ) : (
          <ul className={styles.lista}>
            {oculos.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.iconeOculos}>{item.emoji}</div>
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

        <div className={styles.rodape}>
          <button
            className={styles.botaoConfirmar}
            onClick={abrirFormulario}
            disabled={oculos.length === 0}
          >
            Confirmar
          </button>
        </div>
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
                    <span className={styles.qtdResumo}>×{item.quantidade}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.painelFormulario}>
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
    </div>
  );
}