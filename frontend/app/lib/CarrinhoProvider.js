'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authHeaders } from './api';

const CarrinhoCtx = createContext(null);

export function CarrinhoProvider({ children }) {
  const [quantidade, setQuantidade] = useState(0);
  const [shake, setShake]           = useState(false);

  const recarregar = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrinho/`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const total = (data.results ?? data).reduce(
        (acc, item) => acc + (item.quantidade ?? 1), 0
      );
      setQuantidade(total);
      // dispara o shake
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } catch { }
  }, []);

  useEffect(() => { recarregar(); }, [recarregar]);

  return (
    <CarrinhoCtx.Provider value={{ quantidade, shake, recarregar }}>
      {children}
    </CarrinhoCtx.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error('useCarrinho precisa estar dentro de <CarrinhoProvider>');
  return ctx;
}