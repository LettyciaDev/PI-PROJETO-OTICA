import ProdutoCliente from './ProdutoCliente';

async function getOculos(modelo) {
  const res = await fetch(`http://localhost:8000/api/produtos/${modelo}/`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProdutoModelo({ params }) {
  const { modelo } = await params;
  const oculos = await getOculos(modelo);
  if (!oculos) return <div>Produto não encontrado.</div>;

  return <ProdutoCliente oculos={oculos} />;
}