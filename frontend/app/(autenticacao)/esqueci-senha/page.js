'use client';
import { useState } from 'react';
import { useToast } from '../../components/Toast/toast';
import styles from './esqueci-senha.module.css';

export default function EsqueciSenhaPage() {
  const mostrarToast = useToast();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      mostrarToast('Informe seu e-mail.', 'aviso');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch('http://localhost:8000/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEnviado(true);
      } else {
        mostrarToast('Erro ao enviar. Tente novamente.', 'erro');
      }
    } catch {
      mostrarToast('Não foi possível conectar ao servidor.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  if (enviado) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Verifique seu e-mail</h1>
          <p className={styles.texto}>
            Se existe uma conta com esse e-mail, você receberá um link para redefinir sua senha em instantes.
            <br></br>
            <br></br>
            Se não achou, verifique o seu spam!
          </p>
          <a href="/login" className={styles.link}>Voltar para o login</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Esqueceu a senha?</h1>
        <p className={styles.texto}>
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>E-MAIL</label>
          <input
            className={styles.input}
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button
            type="submit"
            className={styles.button}
            disabled={carregando}
          >
            {carregando ? 'ENVIANDO...' : 'ENVIAR LINK'}
          </button>
        </form>
        <a href="/login" className={styles.link}>Voltar para o login</a>
      </div>
    </div>
  );
}