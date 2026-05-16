'use client';

import { useState } from 'react';
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

  function confirmar() {
    const resumo = oculos
      .filter((item) => item.quantidade > 0)
      .map((item) => `${item.nome} x${item.quantidade}`)
      .join('\n');

    if (resumo) {
      alert(`Reserva confirmada!\n\n${resumo}`);
    } else {
      alert('Nenhum item selecionado.');
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
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
          <button className={styles.botaoConfirmar} onClick={confirmar}>
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  );
}