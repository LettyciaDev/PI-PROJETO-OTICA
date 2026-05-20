'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import styles from './toast.module.css';

const ToastContext = createContext(null);

const icons = { sucesso: '✓', erro: '✕', aviso: '!' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Ref para guardar os timers ativos e podermos limpá-los se o usuário fechar antes
  const timersRef = useRef({});

  const remover = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Limpa o timer da memória para evitar vazamento
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const mostrarToast = useCallback((msg, tipo = 'sucesso') => {
    // Gerador de ID robusto nativo do navegador
    const id = typeof window !== 'undefined' ? crypto.randomUUID() : Date.now().toString();

    setToasts((prev) => [...prev, { id, msg, tipo }]);

    // Guarda o timer usando o ID como chave
    timersRef.current[id] = setTimeout(() => {
      remover(id);
    }, 3800);
  }, [remover]);

  return (
    <ToastContext.Provider value={mostrarToast}>
      {children}
      {/* aria-live avisa os leitores de tela quando um toast aparece */}
      <div className={styles.wrap} role="alert" aria-live="assertive">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.tipo]}`}>
            <span className={styles.icone} aria-hidden="true">{icons[t.tipo]}</span>
            <span className={styles.msg}>{t.msg}</span>
            <button 
              className={styles.fechar} 
              onClick={() => remover(t.id)}
              aria-label="Fechar notificação"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}