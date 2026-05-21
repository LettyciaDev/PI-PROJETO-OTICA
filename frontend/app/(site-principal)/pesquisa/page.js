"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./pesquisa.module.css";

// ─── utilitários ────────────────────────────────────────
const capitalize = (t) => t ? t.charAt(0).toUpperCase() + t.slice(1) : "";

const COR_PARA_HEX = {
  preto: "#1a1a1a", branco: "#c0c0c0", cinza: "#808080",
  prata: "#a0a0a0", dourado: "#c8a84b", ouro: "#c8a84b",
  vermelho: "#c0392b", vinho: "#6d1a2a", rosa: "#d4507a",
  laranja: "#e67e22", amarelo: "#c8a000", azul: "#2980b9",
  "azul escuro": "#1a3a5c", "azul marinho": "#0d2137",
  turquesa: "#1abc9c", verde: "#27ae60", marrom: "#6d4c41",
  caramelo: "#c8841a", bege: "#b89870", nude: "#c8a070",
};

function getCorHex(cor) {
  return COR_PARA_HEX[cor?.toLowerCase().trim()] ?? "#9B5C42";
}

function getFotoPrincipal(variantes) {
  if (!variantes?.length) return null;
  const v = variantes[0];
  if (!v?.imagens?.length) return null;
  const principal = v.imagens.find((img) => img.e_principal);
  return (principal ?? v.imagens[0]).imagem;
}

// ─── Skeleton card ───────────────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: "70%" }} />
        <div className={styles.skeletonLine} style={{ width: "45%" }} />
        <div className={styles.skeletonLine} style={{ width: "55%", marginTop: 12 }} />
      </div>
    </div>
  );
}

// ─── Card de produto ─────────────────────────────────────
function CardProduto({ oculos }) {
  const foto = getFotoPrincipal(oculos.variantes);
  const cores = oculos.variantes?.map((v) => v.cor).filter(Boolean) ?? [];
  const preco = parseFloat(oculos.preco).toFixed(2).replace(".", ",");
  const temEstoque = oculos.variantes?.some((v) => v.quantidade_estoque > 0);

  return (
    <a href={`/produtos/${oculos.slug}`} className={styles.card} tabIndex={0}>
      <div className={styles.cardImg}>
        {foto
          ? <img src={foto} alt={oculos.nome} className={styles.cardFoto} />
          : <div className={styles.cardSemFoto}><span>🕶️</span></div>
        }
        {!temEstoque && <span className={styles.badgeSemEstoque}>Esgotado</span>}
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardMarca}>{capitalize(oculos.marca)}</p>
        <h3 className={styles.cardNome}>{capitalize(oculos.nome)}</h3>

        {cores.length > 0 && (
          <div className={styles.cardCores}>
            {cores.slice(0, 5).map((cor) => (
              <span
                key={cor}
                className={styles.bolinha}
                style={{ background: getCorHex(cor) }}
                title={capitalize(cor)}
              />
            ))}
            {cores.length > 5 && (
              <span className={styles.maisCoores}>+{cores.length - 5}</span>
            )}
          </div>
        )}

        <p className={styles.cardPreco}>R$ {preco}</p>
      </div>
    </a>
  );
}

// ─── Componente principal ────────────────────────────────
export default function PesquisaPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const inputRef = useRef(null);

  // foca o input ao montar
  useEffect(() => { inputRef.current?.focus(); }, []);

  // debounce de 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  // busca ao mudar debouncedQuery
  useEffect(() => {
    if (!debouncedQuery) {
      setResultados([]);
      setBuscou(false);
      return;
    }
    buscar(debouncedQuery);
  }, [debouncedQuery]);

  async function buscar(q) {
    setCarregando(true);
    setBuscou(false);
    try {
      const res = await fetch(
        `http://localhost:8000/api/produtos/?search=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      // suporta paginação DRF ({ results: [...] }) ou lista direta
      setResultados(Array.isArray(data) ? data : (data.results ?? []));
    } catch {
      setResultados([]);
    } finally {
      setCarregando(false);
      setBuscou(true);
    }
  }

  function limpar() {
    setQuery("");
    setResultados([]);
    setBuscou(false);
    inputRef.current?.focus();
  }

  const mostraEmpty  = buscou && !carregando && resultados.length === 0;
  const mostraGrid   = !carregando && resultados.length > 0;
  const mostraSkeleton = carregando;

  return (
    <div className={styles.root}>
      <main className={styles.pagina}>

        {/* ── Topo ── */}
        <div className={styles.topo}>
          <h1 className={styles.titulo}>O que você procura?</h1>
          <p className={styles.subtitulo}>Busque por nome, modelo ou marca</p>
        </div>

        {/* ── Barra de busca ── */}
        <div className={styles.barraWrap}>
          <div className={styles.barra}>
            <svg className={styles.icone} width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>

            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Ex: ray-ban, gatinho, marrom..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") limpar(); }}
              aria-label="Buscar óculos"
              autoComplete="off"
              spellCheck="false"
            />

            {query && (
              <button className={styles.btnLimpar} onClick={limpar} aria-label="Limpar busca">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* contador */}
          {mostraGrid && (
            <p className={styles.contador}>
              {resultados.length} resultado{resultados.length !== 1 ? "s" : ""} para{" "}
              <strong>"{debouncedQuery}"</strong>
            </p>
          )}
        </div>

        {/* ── Estado inicial ── */}
        {!debouncedQuery && !carregando && (
          <div className={styles.estadoInicial}>
            <span className={styles.estadoIcone}>🕶️</span>
            <p>Digite algo para encontrar seu próximo óculos</p>
          </div>
        )}

        {/* ── Skeleton ── */}
        {mostraSkeleton && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Grid de resultados ── */}
        {mostraGrid && (
          <div className={styles.grid}>
            {resultados.map((oc) => (
              <CardProduto key={oc.id ?? oc.slug} oculos={oc} />
            ))}
          </div>
        )}

        {/* ── Sem resultados ── */}
        {mostraEmpty && (
          <div className={styles.semResultados}>
            <span className={styles.estadoIcone}>😕</span>
            <p>Nenhum óculos encontrado para <strong>"{debouncedQuery}"</strong></p>
            <p className={styles.dica}>Tente outro nome ou verifique a ortografia</p>
          </div>
        )}
      </main>
    </div>
  );
}