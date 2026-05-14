"use client";
import { useState } from "react";
import styles from "./produtos.module.css";
import Image from "next/image";

export default function ProdutoCliente({ oculos }) {
  const [lentes, setLentes] = useState({
    Antirreflexo: false,
    Antirrisco: false,
    "Blue Control": false,
    Fotossensível: false,
    "Proteção UV": false,
    "Hard Coat": false,
  });

  const avaliacoes = [
    { inicial: "J", nome: "João", texto: "Ameiiii!!" },
    { inicial: "G", nome: "Gabriella", texto: "Óculos lindo demais <3" },
    { inicial: "L", nome: "Lorenna", texto: "MARAVILHOSOO" },
  ];

  const toggleLente = (nome) =>
    setLentes((prev) => ({ ...prev, [nome]: !prev[nome] }));

  const capitalize = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  return (
    <div className={styles.root}>

      <main className={styles.pagina}>
        <section className={styles.produtoContainer}>

          <div className={styles.colunaImagem}>
            <div className={styles.imagemPrincipal}>
              <Image src="/produtos/oculos.jpg" alt="Foto do Oculos" className={styles.imgOculos} width={100} height={100}/>
            </div>
          </div>

          <div className={styles.colunaDetalhes}>
            <h1 className={styles.nomeProduto}>{capitalize(oculos.nome)}</h1>
            <p className={styles.preco}>R$ {oculos.preco}</p>

            <div className={styles.divider} />

            <div className={styles.secaoCor}>
              <p className={styles.labelSecao}>
                Cor: {capitalize(oculos.cor)}
              </p>
            </div>
            <div className={styles.secaoLente}>
              <p className={styles.labelSecao}>Personalize sua lente</p>
              <div className={styles.gridLentes}>
                {Object.keys(lentes).map((nome) => (
                  <label key={nome} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={lentes[nome]}
                      onChange={() => toggleLente(nome)}
                    />
                    <span>{nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className={styles.armacao}>Armação: <strong>{capitalize(oculos.material)}</strong></p>

            <div className={styles.divider} />

            <div className={styles.garantia}>
              <span className={styles.estrelinha}>★</span>
              <div>
                <p className={styles.garantiaTitulo}>6 meses de garantia</p>
                <p className={styles.garantiaSubtitulo}>
                  Valorizamos a qualidade em cada detalhe para garantir a sua satisfação.
                </p>
              </div>
            </div>

            <div className={styles.ctas}>
              <button className={styles.btnComprar}>Adicionar à sacola</button>
            </div>
          </div>
        </section>

        <section className={styles.especificacoes}>
          <div className={styles.colEspec}>
            <p className={styles.EspecTitulo}>DESCRIÇÃO DA ARMAÇÃO</p>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Formato da armação</span>
              <span>{capitalize(oculos.formato)}</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Tipo de material</span>
              <span>{capitalize(oculos.material)}</span>
            </div>
          </div>
          <div className={styles.colEspec}>
            <p className={styles.EspecTitulo}>TAMANHO DO PRODUTO</p>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Comprimento do aro</span>
              <span>{oculos.medida_aro} mm</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Comprimento da ponte</span>
              <span>{oculos.medida_ponte} mm</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Comprimento da haste</span>
              <span>{oculos.medida_haste} mm</span>
            </div>
          </div>
        </section>

        <section className={styles.avaliacoes}>
          <div className={styles.avaliacoesHeader}>
            <h2 className={styles.avaliacoesTitulo}>AVALIAÇÕES</h2>
            <div className={styles.mediaAvaliacoes}>
              <span className={styles.nota}>5.0</span>
              <span className={styles.estrelasMedia}>★★★★★</span>
              <span className={styles.totalAv}>(3 avaliações)</span>
            </div>
          </div>
          <div className={styles.gridAvaliacoes}>
            {avaliacoes.map((av) => (
              <div key={av.nome} className={styles.card}>
                <div className={styles.cardImagem}>
                  <span className={styles.cardImagemTexto}>IMAGEM<br />ÓCULOS</span>
                </div>
                <div className={styles.cardCorpo}>
                  <div className={styles.estrelas}>★★★★★</div>
                  <div className={styles.cardUsuario}>
                    <span className={styles.avatar}>{av.inicial}</span>
                    <span className={styles.nomeUsuario}>{av.nome}</span>
                  </div>
                  <p className={styles.comentario}>{av.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}