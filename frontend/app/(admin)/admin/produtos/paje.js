'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/api';
import { useToast } from '../../../components/Toast/toast';
import styles from './produtos.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProdutosAdmin() {
  const toast = useToast();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');

  async function carregarProdutos() {
    try {
      const res = await fetch(`${API_URL}/oculos/`, {
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

  useEffect(() => {
    carregarProdutos();
  }, []);

  function abrirEditar(produto) {
    setModalEditar(produto);
    setEditNome(produto.nome);
    setEditPreco(produto.preco);
  }

  async function salvarEdicao() {
    try {
      const res = await fetch(
        `${API_URL}/oculos/${modalEditar.id}/`,
        {
          method: 'PATCH',
          headers: {
            ...authHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: editNome,
            preco: editPreco,
          }),
        }
      );

      if (!res.ok) {
        toast('Erro ao atualizar produto', 'erro');
        return;
      }

      toast('Produto atualizado!', 'sucesso');

      setModalEditar(null);

      carregarProdutos();
    } catch {
      toast('Erro de conexão', 'erro');
    }
  }

  async function excluirProduto(id) {
    if (!confirm('Deseja excluir este produto?')) return;

    try {
      const res = await fetch(`${API_URL}/oculos/${id}/`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!res.ok) {
        toast('Erro ao excluir produto', 'erro');
        return;
      }

      setProdutos((prev) =>
        prev.filter((produto) => produto.id !== id)
      );

      toast('Produto removido!', 'sucesso');
    } catch {
      toast('Erro de conexão', 'erro');
    }
  }

  if (carregando) {
    return (
      <main className={styles.container}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <div>
          <h1>PRODUTOS</h1>
          <p>Gerencie os óculos cadastrados.</p>
        </div>
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
                  <button
                    onClick={() => setModalVer(produto)}
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => abrirEditar(produto)}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      excluirProduto(produto.id)
                    }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {modalVer && (
        <div
          className={styles.overlay}
          onClick={() => setModalVer(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{modalVer.nome}</h2>

            <p>
              <strong>Código:</strong>{' '}
              {modalVer.codigo_referencia}
            </p>

            <p>
              <strong>Marca:</strong>{' '}
              {modalVer.marca}
            </p>

            <p>
              <strong>Material:</strong>{' '}
              {modalVer.material}
            </p>

            <p>
              <strong>Formato:</strong>{' '}
              {modalVer.formato}
            </p>

            <p>
              <strong>Preço:</strong> R${' '}
              {modalVer.preco}
            </p>
          </div>
        </div>
      )}

      {modalEditar && (
        <div
          className={styles.overlay}
          onClick={() => setModalEditar(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Editar Produto</h2>

            <input
              className={styles.inputModal}
              value={editNome}
              onChange={(e) =>
                setEditNome(e.target.value)
              }
            />

            <input
              className={styles.inputModal}
              value={editPreco}
              onChange={(e) =>
                setEditPreco(e.target.value)
              }
            />

            <button
              className={styles.botaoSalvar}
              onClick={salvarEdicao}
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}