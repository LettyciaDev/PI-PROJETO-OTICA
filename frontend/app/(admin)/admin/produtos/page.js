'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import styles from './produtos.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MARCAS = ['rayban', 'oakley', 'chilli', 'outro'];
const MATERIAIS = ['metal', 'acetato', 'policarbonato', 'titanio', 'outro'];
const FORMATOS = ['redondo', 'quadrado', 'retangular', 'gatinho', 'aviador', 'outro'];
const GENEROS = ['masculino', 'feminino', 'infantil', 'unissex'];

const campoVazio = {
  nome: '',
  codigo_referencia: '',
  marca: 'outro',
  material: 'metal',
  formato: 'redondo',
  genero: 'unissex',
  medida_aro: '',
  medida_ponte: '',
  medida_haste: '',
  preco: '',
};

function FormularioProduto({ form, onChange, onSubmit, salvando, titulo, onFechar }) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onFechar}>✕</button>
        <h2 className={styles.modalTitulo}>{titulo}</h2>
        <div className={styles.modalForm}>

          <label className={styles.modalLabel}>Nome</label>
          <input className={styles.inputModal} name="nome" value={form.nome} onChange={onChange} placeholder="Ex: Ray-Ban Aviador" />

          <label className={styles.modalLabel}>Código de Referência</label>
          <input className={styles.inputModal} name="codigo_referencia" type="number" value={form.codigo_referencia} onChange={onChange} placeholder="Ex: 10001" />

          <label className={styles.modalLabel}>Marca</label>
          <select className={styles.select} name="marca" value={form.marca} onChange={onChange}>
            {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <label className={styles.modalLabel}>Material</label>
          <select className={styles.select} name="material" value={form.material} onChange={onChange}>
            {MATERIAIS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <label className={styles.modalLabel}>Formato</label>
          <select className={styles.select} name="formato" value={form.formato} onChange={onChange}>
            {FORMATOS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <label className={styles.modalLabel}>Gênero</label>
          <select className={styles.select} name="genero" value={form.genero} onChange={onChange}>
            {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <label className={styles.modalLabel}>Medida Aro (mm)</label>
          <input className={styles.inputModal} name="medida_aro" type="number" value={form.medida_aro} onChange={onChange} placeholder="Ex: 52" />

          <label className={styles.modalLabel}>Medida Ponte (mm)</label>
          <input className={styles.inputModal} name="medida_ponte" type="number" value={form.medida_ponte} onChange={onChange} placeholder="Ex: 18" />

          <label className={styles.modalLabel}>Medida Haste (mm)</label>
          <input className={styles.inputModal} name="medida_haste" type="number" value={form.medida_haste} onChange={onChange} placeholder="Ex: 140" />

          <label className={styles.modalLabel}>Preço (R$)</label>
          <input className={styles.inputModal} name="preco" type="number" step="0.01" value={form.preco} onChange={onChange} placeholder="Ex: 299.90" />

          <button className={styles.botaoSalvar} onClick={onSubmit} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProdutosAdmin() {
  const toast = useToast();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);

  const [editForm, setEditForm] = useState(campoVazio);
  const [novoForm, setNovoForm] = useState(campoVazio);
  const [salvando, setSalvando] = useState(false);

  async function carregarProdutos() {
    try {
      const res = await fetch(`${API_URL}/oculos/?t=${Date.now()}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : data.results || []);
    } catch {
      toast('Erro ao carregar produtos', 'erro');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarProdutos(); }, []);

  function abrirEditar(produto) {
    setModalEditar(produto);
    setEditForm({
      nome: produto.nome || '',
      codigo_referencia: produto.codigo_referencia || '',
      marca: produto.marca || 'outro',
      material: produto.material || 'metal',
      formato: produto.formato || 'redondo',
      genero: produto.genero || 'unissex',
      medida_aro: produto.medida_aro || '',
      medida_ponte: produto.medida_ponte || '',
      medida_haste: produto.medida_haste || '',
      preco: produto.preco || '',
    });
  }

  async function salvarEdicao() {
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/oculos/${modalEditar.id}/`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const e = await res.json(); toast(JSON.stringify(e), 'erro'); return; }
      toast('Produto atualizado!', 'sucesso');
      setModalEditar(null);
      carregarProdutos();
    } catch { toast('Erro de conexão', 'erro'); }
    finally { setSalvando(false); }
  }

  async function criarProduto() {
    if (!novoForm.nome || !novoForm.codigo_referencia || !novoForm.preco) {
      toast('Preencha nome, código e preço.', 'aviso');
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/oculos/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(novoForm),
      });
      if (!res.ok) { const e = await res.json(); toast(JSON.stringify(e), 'erro'); return; }
      toast('Produto criado com sucesso!', 'sucesso');
      setModalNovo(false);
      setNovoForm(campoVazio);
      carregarProdutos();
    } catch { toast('Erro de conexão', 'erro'); }
    finally { setSalvando(false); }
  }

  async function excluirProduto(id) {
    if (!confirm('Deseja excluir este produto?')) return;
    try {
      const res = await fetch(`${API_URL}/oculos/${id}/`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) { toast('Erro ao excluir produto', 'erro'); return; }
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      toast('Produto removido!', 'sucesso');
    } catch { toast('Erro de conexão', 'erro'); }
  }

  if (carregando) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <p style={{ color: '#965A3E', fontFamily: 'Joan, serif', fontSize: '20px' }}>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os óculos cadastrados.</p>
        </div>
        <button className={styles.botaoNovo} style={{ marginTop: 10 }} onClick={() => { setNovoForm(campoVazio); setModalNovo(true); }}>
          + Novo Produto
        </button>
      </div>

      <section className={styles.cards}>
        <div className={styles.card}>
          <h2>{produtos.length}</h2>
          <p>Total de Produtos</p>
        </div>
      </section>

      <section className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Marca</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.codigo_referencia}</td>
                <td>{produto.nome}</td>
                <td>{produto.marca}</td>
                <td>R$ {produto.preco}</td>
                <td className={styles.acoes}>
                  <button onClick={() => setModalVer(produto)}>Ver</button>
                  <button onClick={() => abrirEditar(produto)}>Editar</button>
                  <button onClick={() => excluirProduto(produto.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MODAL VER */}
      {modalVer && (
        <div className={styles.overlay} onClick={() => setModalVer(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.fechar} onClick={() => setModalVer(null)}>✕</button>
            <h2 className={styles.modalTitulo}>{modalVer.nome}</h2>
            <div className={styles.modalGrid}>
              {[
                ['Código', modalVer.codigo_referencia],
                ['Marca', modalVer.marca],
                ['Material', modalVer.material],
                ['Formato', modalVer.formato],
                ['Gênero', modalVer.genero],
                ['Preço', `R$ ${modalVer.preco}`],
              ].map(([label, valor]) => (
                <div key={label} className={styles.modalCampo}>
                  <span className={styles.modalLabel}>{label}</span>
                  <span className={styles.modalValor}>{valor}</span>
                </div>
              ))}
              <div className={styles.modalCampo}>
                <span className={styles.modalLabel}>Medidas (aro / ponte / haste)</span>
                <span className={styles.modalValor}>
                  {modalVer.medida_aro}mm / {modalVer.medida_ponte}mm / {modalVer.medida_haste}mm
                </span>
              </div>
              {modalVer.variantes?.length > 0 && (
                <div className={styles.modalCampo}>
                  <span className={styles.modalLabel}>Variantes</span>
                  {modalVer.variantes.map((v) => (
                    <span key={v.id} className={styles.modalValor}>
                      {v.cor} — estoque: {v.quantidade_estoque}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <FormularioProduto
          titulo="Editar Produto"
          form={editForm}
          onChange={(e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
          onSubmit={salvarEdicao}
          salvando={salvando}
          onFechar={() => setModalEditar(null)}
        />
      )}

      {/* MODAL NOVO */}
      {modalNovo && (
        <FormularioProduto
          titulo="Novo Produto"
          form={novoForm}
          onChange={(e) => setNovoForm({ ...novoForm, [e.target.name]: e.target.value })}
          onSubmit={criarProduto}
          salvando={salvando}
          onFechar={() => setModalNovo(false)}
        />
      )}
    </main>
  );
}