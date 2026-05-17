"use client";
import { useState, useRef, useCallback } from "react";
import styles from "./produtos.module.css";

function getFotoPrincipal(variante) {
  if (!variante?.imagens?.length) return null;
  const principal = variante.imagens.find((img) => img.e_principal);
  return (principal ?? variante.imagens[0]).imagem;
}

const COR_PARA_HEX = {
  preto:          { solid: "#1a1a1a" },
  branco:         { solid: "#c0c0c0" },
  cinza:          { solid: "#808080" },
  "cinza escuro": { solid: "#404040" },
  "cinza claro":  { solid: "#a0a0a0" },
  prata:          { solid: "#a0a0a0" },
  dourado:        { solid: "#c8a84b" },
  ouro:           { solid: "#c8a84b" },
  bronze:         { solid: "#8c5e2a" },
  cobre:          { solid: "#b87333" },
  vermelho:       { solid: "#c0392b" },
  vinho:          { solid: "#6d1a2a" },
  rosa:           { solid: "#d4507a" },
  "rosa claro":   { solid: "#e07090" },
  coral:          { solid: "#e8785a" },
  laranja:        { solid: "#e67e22" },
  amarelo:        { solid: "#c8a000" },
  azul:           { solid: "#2980b9" },
  "azul escuro":  { solid: "#1a3a5c" },
  "azul claro":   { solid: "#3a8ec0" },
  "azul marinho": { solid: "#0d2137" },
  turquesa:       { solid: "#1abc9c" },
  verde:          { solid: "#27ae60" },
  "verde escuro": { solid: "#1a5c2a" },
  esmeralda:      { solid: "#2ecc71" },
  marrom:         { solid: "#6d4c41" },
  caramelo:       { solid: "#c8841a" },
  bege:           { solid: "#b89870" },
  nude:           { solid: "#c8a070" },
  tartaruga:      { solid: "#5c3d1e" },
  "vinho e rosa":    { solid: "#6d1a2a", bg: "linear-gradient(135deg, #6d1a2a 50%, #d4507a 50%)" },
  "preto e dourado": { solid: "#1a1a1a", bg: "linear-gradient(135deg, #1a1a1a 50%, #c8a84b 50%)" },
  "preto e prata":   { solid: "#1a1a1a", bg: "linear-gradient(135deg, #1a1a1a 50%, #c0c0c0 50%)" },
  "azul e prata":    { solid: "#2980b9", bg: "linear-gradient(135deg, #2980b9 50%, #c0c0c0 50%)" },
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function getCorBackground(nomeCor) {
  return COR_PARA_HEX[nomeCor?.toLowerCase().trim()] ?? null;
}

/* ─── Zoom com lupa ─── */
const ZOOM_FACTOR = 2.5;

function ImagemComZoom({ src, alt, className }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState({ ativo: false, x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ ativo: true, x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setZoom({ ativo: false, x: 0, y: 0 });
  }, []);

  if (!src) return <div className={styles.semFoto}>Sem imagem</div>;

  return (
    <div
      ref={containerRef}
      className={styles.zoomContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: zoom.ativo ? "crosshair" : "zoom-in" }}
    >
      <img
        key={src}
        src={src}
        alt={alt}
        className={[className, styles.imgOculos].join(" ")}
        style={
          zoom.ativo
            ? {
                transform: `scale(${ZOOM_FACTOR})`,
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
              }
            : undefined
        }
        draggable={false}
      />
      {zoom.ativo && (
        <div
          className={styles.zoomMira}
          style={{ left: `${zoom.x}%`, top: `${zoom.y}%` }}
        />
      )}
    </div>
  );
}

/* ─── Botão Compartilhar ─── */
function BotaoCompartilhar({ nomeProduto }) {
  const [estado, setEstado] = useState("idle"); // idle | copiado | menu

  function toggleMenu() {
    setEstado((s) => (s === "menu" ? "idle" : "menu"));
  }

  function compartilharWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const texto = encodeURIComponent(`Olha esse óculos: ${nomeProduto} 🕶️`);
    window.open(`https://wa.me/?text=${texto}%20${url}`, "_blank");
    setEstado("idle");
  }

  function copiarLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setEstado("copiado");
      setTimeout(() => setEstado("idle"), 2000);
    });
  }

  return (
    <div className={styles.compartilharWrapper}>
      <button
        className={styles.btnCompartilhar}
        onClick={toggleMenu}
        aria-label="Compartilhar produto"
        title="Compartilhar"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Compartilhar
      </button>

      {(estado === "menu" || estado === "copiado") && (
        <div className={styles.compartilharDropdown}>
          <button className={styles.compartilharOpcao} onClick={compartilharWhatsApp}>
            {/* ícone WhatsApp */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar no WhatsApp
          </button>
          <button className={styles.compartilharOpcao} onClick={copiarLink}>
            {estado === "copiado" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Link copiado!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copiar link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProdutoCliente({ oculos }) {
  const variantes = oculos.variantes ?? [];
  const [varianteSelecionada, setVarianteSelecionada] = useState(variantes[0] ?? null);

  const todasImagens = varianteSelecionada?.imagens ?? [];
  const [indexFotoAtiva, setIndexFotoAtiva] = useState(0);

  function selecionarVariante(v) {
    setVarianteSelecionada(v);
    const idxPrincipal = v.imagens?.findIndex((img) => img.e_principal) ?? 0;
    setIndexFotoAtiva(idxPrincipal >= 0 ? idxPrincipal : 0);
  }

  const fotoAtual = todasImagens[indexFotoAtiva]?.imagem ?? null;

  const [quantidade, setQuantidade] = useState(1);
  const estoqueAtual = varianteSelecionada?.quantidade_estoque ?? 0;
  const temEstoque = estoqueAtual > 0;

  function incrementar() { setQuantidade((q) => Math.min(q + 1, estoqueAtual)); }
  function decrementar() { setQuantidade((q) => Math.max(q - 1, 1)); }

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

  const toggleLente = (nome) => setLentes((prev) => ({ ...prev, [nome]: !prev[nome] }));

  const capitalize = (texto) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const precoBase = parseFloat(oculos.preco) || 0;
  const precoAdicional = parseFloat(varianteSelecionada?.preco_adicional) || 0;
  const precoFinal = (precoBase + precoAdicional).toFixed(2).replace(".", ",");

  const bgCorAtual = getCorBackground(varianteSelecionada?.cor);

  return (
    <div className={styles.root}>
      <main className={styles.pagina}>
        <section className={styles.produtoContainer}>

          {/* ── Coluna da imagem + galeria ── */}
          <div className={styles.colunaImagem}>
            <div className={styles.imagemPrincipal}>
              <ImagemComZoom
                src={fotoAtual}
                alt={`Óculos ${capitalize(varianteSelecionada?.cor ?? "")}`}
              />
            </div>

            {todasImagens.length > 1 && (
              <div className={styles.galeriaThumbs}>
                {todasImagens.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    onClick={() => setIndexFotoAtiva(idx)}
                    className={[
                      styles.thumbBtn,
                      idx === indexFotoAtiva ? styles.thumbBtnAtivo : "",
                    ].join(" ")}
                    style={
                      idx === indexFotoAtiva && bgCorAtual
                        ? { borderColor: bgCorAtual.solid }
                        : undefined
                    }
                  >
                    <img src={img.imagem} alt={`Foto ${idx + 1}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Coluna de detalhes ── */}
          <div className={styles.colunaDetalhes}>
            {/* Cabeçalho: nome + botão compartilhar */}
            <div className={styles.produtoHeader}>
              <h1 className={styles.nomeProduto}>{capitalize(oculos.nome)}</h1>
              <BotaoCompartilhar nomeProduto={capitalize(oculos.nome)} />
            </div>

            <p className={styles.preco}>
              R$ {precoFinal}
              {precoAdicional > 0 && (
                <span className={styles.precoAdicional}>
                  (+ R$ {precoAdicional.toFixed(2).replace(".", ",")} pela cor)
                </span>
              )}
            </p>

            <div className={styles.divider} />

            {variantes.length > 0 && (
              <div className={styles.secaoCor}>
                <p className={styles.labelSecao}>
                  Cor:{" "}
                  <strong>{capitalize(varianteSelecionada?.cor ?? "")}</strong>
                  {!temEstoque && (
                    <span className={styles.semEstoque}> — Sem estoque</span>
                  )}
                  {temEstoque && estoqueAtual <= 3 && (
                    <span className={styles.poucoEstoque}>
                      {" "}— Últimas {estoqueAtual} unidade{estoqueAtual > 1 ? "s" : ""}!
                    </span>
                  )}
                </p>

                <div className={styles.gridCores}>
                  {variantes.map((v) => {
                    const semEstoque = v.quantidade_estoque === 0;
                    const ativo = varianteSelecionada?.cor === v.cor;
                    const bgCor = getCorBackground(v.cor);
                    return (
                      <button
                        key={v.cor}
                        title={semEstoque ? `${capitalize(v.cor)} — Sem estoque` : capitalize(v.cor)}
                        onClick={() => selecionarVariante(v)}
                        className={[
                          styles.botaoCor,
                          ativo ? styles.botaoCorAtivo : "",
                          semEstoque ? styles.botaoCorSemEstoque : "",
                        ].join(" ")}
                        style={
                          bgCor
                            ? ativo
                              ? {
                                  borderColor: bgCor.solid,
                                  background: `rgba(${hexToRgb(bgCor.solid)}, 0.1)`,
                                  color: bgCor.solid,
                                }
                              : semEstoque
                              ? { borderColor: bgCor.solid, color: bgCor.solid }
                              : undefined
                            : undefined
                        }
                      >
                        {bgCor && (
                          <span
                            className={styles.bolinhaCor}
                            style={{ background: bgCor.bg ?? bgCor.solid }}
                            aria-hidden="true"
                          />
                        )}
                        {capitalize(v.cor)}
                        {semEstoque && (
                          <span className={styles.riscoBotaoCor} aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.divider} />

            <div className={styles.secaoLente}>
              <p className={styles.labelSecao}><b>Personalize sua lente</b></p>
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

            <p className={styles.armacao}>
              Armação: <strong>{capitalize(oculos.material)}</strong>
            </p>

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

            <div className={styles.compraRow}>
              <div
                className={styles.quantidade}
                style={
                  bgCorAtual && temEstoque
                    ? { borderColor: bgCorAtual.solid }
                    : undefined
                }
              >
                <button className={styles.qtdBtn} onClick={decrementar} disabled={!temEstoque || quantidade <= 1} aria-label="Diminuir quantidade">−</button>
                <span className={styles.qtdValor}>{temEstoque ? quantidade : 0}</span>
                <button className={styles.qtdBtn} onClick={incrementar} disabled={!temEstoque || quantidade >= estoqueAtual} aria-label="Aumentar quantidade">+</button>
              </div>

              <button
                className={styles.btnComprar}
                disabled={!temEstoque}
                title={!temEstoque ? "Produto sem estoque nesta cor" : ""}
                style={
                  bgCorAtual && temEstoque
                    ? { background: bgCorAtual.solid }
                    : !temEstoque && bgCorAtual
                    ? { background: `rgba(${hexToRgb(bgCorAtual.solid)}, 0.35)`, cursor: "not-allowed" }
                    : undefined
                }
              >
                {temEstoque ? "Adicionar ao carrinho" : "Indisponível nesta cor"}
              </button>
            </div>
          </div>
        </section>

        {/* Especificações */}
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

        {/* Avaliações */}
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