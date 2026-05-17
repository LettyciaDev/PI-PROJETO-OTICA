'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './carrinho.module.css';

const oculosIniciais = [
  {
    id: 1,
    nome: 'Gatinho Ray-Ban',
    cor: 'Rose Gold',
    lente: 'Antireflexo',
    quantidade: 2,
    emoji: '🕶️',
  },
  {
    id: 2,
    nome: 'Sport Titanium',
    cor: 'Azul',
    lente: 'Fotossensível',
    quantidade: 1,
    emoji: '😎',
  },
  {
    id: 3,
    nome: 'Aviador Polarizado',
    cor: 'Preto',
    lente: 'Multifocal, Filtro de Luz azul e Antirisco',
    quantidade: 3,
    emoji: '🕶️',
  },
  {
    id: 4,
    nome: 'Kids Flexível',
    cor: 'Azul',
    lente: 'Bifocal',
    quantidade: 1,
    emoji: '😎',
  },
];

export default function Page() {
  const [oculos, setOculos] = useState(oculosIniciais);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('09:00');
  const [observacao, setObservacao] = useState('');
  const formularioRef = useRef(null);

  function aumentar(id) {
    setOculos(oculos.map((item) =>
      item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
    ));
  }

  function diminuir(id) {
    setOculos(oculos.map((item) =>
      item.id === id && item.quantidade > 0
        ? { ...item, quantidade: item.quantidade - 1 }
        : item
    ));
  }

  function abrirFormulario() {
    setMostrarFormulario(true);
  }

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

  return (
    <div className={styles.pagina}>

      {/* SEÇÃO 1: lista de óculos + botão confirmar no rodapé */}
      <div className={styles.secaoLista}>
        <h1 className={styles.titulo}>Reserve seus óculos</h1>

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
                <button
                  className={styles.botaoQtd}
                  onClick={() => diminuir(item.id)}
                  aria-label={`Diminuir quantidade de ${item.nome}`}
                >
                  −
                </button>
                <span className={styles.quantidade}>{item.quantidade}</span>
                <button
                  className={styles.botaoQtd}
                  onClick={() => aumentar(item.id)}
                  aria-label={`Aumentar quantidade de ${item.nome}`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.rodape}>
          <button className={styles.botaoConfirmar} onClick={abrirFormulario}>
            Confirmar
          </button>
        </div>
      </div>
        
      {/* SECAO 2*/}
      {mostrarFormulario && (
        <div className={styles.secaoFormulario} ref={formularioRef}>
          <div className={styles.painelDuplo}>

            {/* PAINEL ESQUERDO: resumo dos óculos */}
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
              {oculos.filter((i) => i.quantidade > 0).length === 0 && (
                <p className={styles.vazio}>Nenhum óculos selecionado.</p>
              )}
            </div>

            {/* PAINEL DIREITO: formulário */}
            <div className={styles.painelFormulario}>
              <h2 className={styles.tituloFormulario}>Insira seus dados</h2>

              <label className={styles.rotulo}>NOME COMPLETO</label>
              <input
                className={styles.campo}
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <label className={styles.rotulo}>TELEFONE / WHATSAPP</label>
              <input
                className={styles.campo}
                type="tel"
                placeholder="(+__) __ _ ____-____"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <div className={styles.linhaData}>
                <div className={styles.grupoData}>
                  <label className={styles.rotulo}>DATA DE VISITA</label>
                  <input
                    className={styles.campo}
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
                <div className={styles.grupoHorario}>
                  <label className={styles.rotulo}>HORÁRIO</label>
                  <input
                    className={styles.campo}
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  />
                </div>
              </div>

              <label className={styles.rotulo}>OBSERVAÇÕES</label>
              <textarea
                className={styles.campoTextarea}
                placeholder="Observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />

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