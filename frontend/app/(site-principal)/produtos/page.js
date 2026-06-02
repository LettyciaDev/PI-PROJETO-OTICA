'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import styles from './produto.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const ESTRELAS = [1, 2, 3, 4, 5];

function StarRating({ rating = 4, count = 0 }) {
  return (
    <div className={styles.stars}>
      {ESTRELAS.map((s) => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
      {count > 0 && <span className={styles.starCount}>({count})</span>}
    </div>
  );
}

function ProdutoCard({ oculos }) {
  // Pega a primeira imagem principal disponível entre as variantes
  const imagemPrincipal = useMemo(() => {
    for (const variante of oculos.variantes || []) {
      const principal = variante.imagens?.find((img) => img.e_principal);
      if (principal) return principal.imagem;
      if (variante.imagens?.length) return variante.imagens[0].imagem;
    }
    return null;
  }, [oculos.variantes]);

  const marcaLabel = oculos.marca?.toUpperCase() || 'VIZZO';
  const generoLabel = oculos.genero
    ? oculos.genero.charAt(0).toUpperCase() + oculos.genero.slice(1)
    : '';

  const preco = parseFloat(oculos.preco || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Link href={`/produtos/${oculos.slug}`} className={styles.card}>
      <div className={styles.cardImgWrap}>
        {imagemPrincipal ? (
          <img src={imagemPrincipal} alt={oculos.nome} className={styles.cardImg} />
        ) : (
          <div className={styles.cardImgPlaceholder}>
            <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="36">
              <rect x="2" y="8" width="28" height="20" rx="10" stroke="#9C5B35" strokeWidth="2.5" fill="none"/>
              <rect x="50" y="8" width="28" height="20" rx="10" stroke="#9C5B35" strokeWidth="2.5" fill="none"/>
              <path d="M30 18 Q40 12 50 18" stroke="#9C5B35" strokeWidth="2.5" fill="none"/>
              <path d="M2 18 Q-4 18 -6 14" stroke="#9C5B35" strokeWidth="2" fill="none"/>
              <path d="M78 18 Q84 18 86 14" stroke="#9C5B35" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardMarca}>
          {marcaLabel} — {generoLabel.toUpperCase()}
        </p>
        <h3 className={styles.cardNome}>{oculos.nome}</h3>
        <p className={styles.cardPreco}>{preco}</p>
        <StarRating rating={4} count={20} />
      </div>
    </Link>
  );
}

function CheckboxFiltro({ label, checked, onChange }) {
  return (
    <label className={styles.checkLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkInput}
      />
      <span className={styles.checkBox} />
      <span className={styles.checkText}>{label}</span>
    </label>
  );
}

const CATEGORIAS = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'unissex', label: 'Unissex' },
];

const MATERIAIS = [
  { value: 'metal', label: 'Metal' },
  { value: 'acetato', label: 'Acetato' },
  { value: 'policarbonato', label: 'Policarbonato' },
  { value: 'titanio', label: 'Titânio' },
];

const FORMATOS = [
  { value: 'redondo', label: 'Redondo' },
  { value: 'quadrado', label: 'Quadrado' },
  { value: 'retangular', label: 'Retangular' },
  { value: 'gatinho', label: 'Gatinho' },
  { value: 'aviador', label: 'Aviador' },
];

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [busca, setBusca] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const params = busca ? `?search=${encodeURIComponent(busca)}` : '';
        const res = await fetch(`${API_BASE}/api/produtos/${params}`);
        if (!res.ok) throw new Error('Erro ao carregar produtos');
        const data = await res.json();
        // suporte a paginação ou array direto
        setProdutos(Array.isArray(data) ? data : data.results || []);
      } catch (e) {
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [busca]);

  const toggleFiltro = useCallback((lista, setLista, valor) => {
    setLista((prev) =>
      prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]
    );
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      if (categorias.length && !categorias.includes(p.genero)) return false;
      if (materiais.length && !materiais.includes(p.material)) return false;
      if (formatos.length && !formatos.includes(p.formato)) return false;
      const preco = parseFloat(p.preco);
      if (precoMin && preco < parseFloat(precoMin)) return false;
      if (precoMax && preco > parseFloat(precoMax)) return false;
      return true;
    });
  }, [produtos, categorias, materiais, formatos, precoMin, precoMax]);

  const limparFiltros = () => {
    setCategorias([]);
    setMateriais([]);
    setFormatos([]);
    setPrecoMin('');
    setPrecoMax('');
    setBusca('');
  };

  const temFiltro =
    categorias.length || materiais.length || formatos.length || precoMin || precoMax || busca;

  return (
    <div className={styles.pagina}>
      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.breadcrumbSep}>&gt;</span>
        <span className={styles.breadcrumbAtual}>Produtos</span>
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR FILTROS */}
        <aside className={styles.sidebar}>
          {/* Busca */}
          <div className={styles.buscaWrap}>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.buscaInput}
            />
          </div>

          <div className={styles.filtroGrupo}>
            <h4 className={styles.filtroTitulo}>CATEGORIA:</h4>
            {CATEGORIAS.map((c) => (
              <CheckboxFiltro
                key={c.value}
                label={c.label}
                checked={categorias.includes(c.value)}
                onChange={() => toggleFiltro(categorias, setCategorias, c.value)}
              />
            ))}
          </div>

          <div className={styles.filtroGrupo}>
            <h4 className={styles.filtroTitulo}>MATERIAL:</h4>
            {MATERIAIS.map((m) => (
              <CheckboxFiltro
                key={m.value}
                label={m.label}
                checked={materiais.includes(m.value)}
                onChange={() => toggleFiltro(materiais, setMateriais, m.value)}
              />
            ))}
          </div>

          <div className={styles.filtroGrupo}>
            <h4 className={styles.filtroTitulo}>FORMATO:</h4>
            {FORMATOS.map((f) => (
              <CheckboxFiltro
                key={f.value}
                label={f.label}
                checked={formatos.includes(f.value)}
                onChange={() => toggleFiltro(formatos, setFormatos, f.value)}
              />
            ))}
          </div>

          <div className={styles.filtroGrupo}>
            <h4 className={styles.filtroTitulo}>PREÇO:</h4>
            <div className={styles.precoRange}>
              <span className={styles.precoLabel}>R$</span>
              <input
                type="number"
                placeholder="Min"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                className={styles.precoInput}
              />
              <span className={styles.precoSep}>-</span>
              <input
                type="number"
                placeholder="Máx"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                className={styles.precoInput}
              />
            </div>
          </div>

          {temFiltro && (
            <button onClick={limparFiltros} className={styles.btnLimpar}>
              Limpar filtros
            </button>
          )}
        </aside>

        {/* GRID PRODUTOS */}
        <main className={styles.conteudo}>
          {loading && (
            <div className={styles.estado}>
              <div className={styles.spinner} />
              <p>Carregando produtos...</p>
            </div>
          )}

          {!loading && erro && (
            <div className={styles.estado}>
              <p className={styles.erroMsg}>Erro ao carregar produtos. Verifique se o servidor está ativo.</p>
            </div>
          )}

          {!loading && !erro && produtosFiltrados.length === 0 && (
            <div className={styles.estado}>
              <p>Nenhum produto encontrado com os filtros selecionados.</p>
              {temFiltro && (
                <button onClick={limparFiltros} className={styles.btnLimpar}>
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          {!loading && !erro && produtosFiltrados.length > 0 && (
            <>
              <p className={styles.resultadoCount}>
                {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
              </p>
              <div className={styles.grid}>
                {produtosFiltrados.map((p) => (
                  <ProdutoCard key={p.id} oculos={p} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}