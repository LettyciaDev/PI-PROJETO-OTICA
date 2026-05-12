"use client";
import { useState } from "react";
import styles from "./produtos.module.css";
import Image from "next/image";

export default function ProdutoModelo() {
  const [corSelecionada, setCorSelecionada] = useState("Preto");
  const [lentes, setLentes] = useState({
    Antirreflexo: false,
    Antirrisco: false,
    "Blue Control": false,
    Fotossensível: false,
    "Proteção UV": false,
    "Hard Coat": false,
  });
  const [thumbAtiva, setThumbAtiva] = useState(0);

  const cores = [
    { cor: "#6B0000", label: "Vinho" },
    { cor: "#B22222", label: "Vermelho" },
    { cor: "#1B4D1B", label: "Verde" },
    { cor: "#C8C820", label: "Amarelo" },
    { cor: "#AAAAAA", label: "Cinza" },
    { cor: "#111111", label: "Preto" },
  ];

  const avaliacoes = [
    { inicial: "J", nome: "João", texto: "Ameiiii!!" },
    { inicial: "G", nome: "Gabriella", texto: "Óculos lindo demais <3" },
    { inicial: "L", nome: "Lorenna", texto: "MARAVILHOSOO" },
  ];

  const toggleLente = (nome) =>
    setLentes((prev) => ({ ...prev, [nome]: !prev[nome] }));

  return (
    <div className={styles.root}>

      <main className={styles.pagina}>
        <section className={styles.produtoContainer}>

          <div className={styles.colunaImagem}>
            <div className={styles.imagemPrincipal}>
              <Image src="/produtos/oculos.jpg" alt="Acetato Reserva" className={styles.imgOculos} width={100} height={100}/>
              <button className={styles.favorito} aria-label="favoritar">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className={styles.thumbnails}>
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${thumbAtiva === i ? styles.thumbAtiva : ""}`}
                  onClick={() => setThumbAtiva(i)}
                />
              ))}
            </div>
          </div>

          <div className={styles.colunaDetalhes}>
            <h1 className={styles.nomeProduto}>Acetato Reserva</h1>
            <p className={styles.preco}>R$ 349,90</p>
            <p className={styles.parcelas}>ou 3x de R$ 116,63 sem juros</p>

            <div className={styles.divider} />

            <div className={styles.secaoCor}>
              <p className={styles.labelSecao}>
                Cor: <strong>{corSelecionada}</strong>
              </p>
              <div className={styles.cores}>
                {cores.map((item) => (
                  <button
                    key={item.label}
                    className={`${styles.bolinha} ${corSelecionada === item.label ? styles.bolinhaAtiva : ""}`}
                    style={{ backgroundColor: item.cor }}
                    aria-label={item.label}
                    onClick={() => setCorSelecionada(item.label)}
                  />
                ))}
              </div>
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

            <p className={styles.armacao}>Armação: <strong>Metal</strong></p>

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
              <button className={styles.btnWishlist}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Favoritar
              </button>
            </div>
          </div>
        </section>

        <section className={styles.especificacoes}>
          <div className={styles.colEspec}>
            <p className={styles.EspecTitulo}>DESCRIÇÃO DA ARMAÇÃO</p>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Formato da armação</span>
              <span>Redondo</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Tipo de material</span>
              <span>Metal</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Cor da haste</span>
              <span>Preto</span>
            </div>
          </div>
          <div className={styles.colEspec}>
            <p className={styles.EspecTitulo}>TAMANHO DO PRODUTO</p>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Tamanho</span>
              <span>50 22 mm</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Altura da lente</span>
              <span>41.2 mm</span>
            </div>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Comprimento da haste</span>
              <span>150 mm</span>
            </div>
          </div>
          <div className={styles.colEspec}>
            <p className={styles.EspecTitulo}>COBERTURA FACIAL</p>
            <div className={styles.EspecLinha}>
              <span className={styles.EspecLabel}>Cobertura facial</span>
              <span>Padrão</span>
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