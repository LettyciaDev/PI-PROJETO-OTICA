import ProdutoCliente from './ProdutoCliente';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getOculos(modelo) {
  const res = await fetch(`${API_BASE}/produtos/${modelo}/`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProdutoModelo({ params }) {
  const { modelo } = await params;
  const oculos = await getOculos(modelo);
  if (!oculos) return <div>Produto não encontrado.</div>;

  return <ProdutoCliente oculos={oculos} />;
}