'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '../../../../components/Toast/toast';
import styles from './reset-password.module.css';

export default function ResetPasswordPage() {
  const mostrarToast = useToast();
  const router = useRouter();
  const { uid, token } = useParams();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      mostrarToast('A senha deve ter pelo menos 6 caracteres.', 'aviso');
      return;
    }
    if (novaSenha !== confirmar) {
      mostrarToast('As senhas não coincidem.', 'aviso');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch('http://localhost:8000/api/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: novaSenha }),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarToast('Senha redefinida com sucesso!', 'sucesso');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        // Link expirado ou inválido
        const erro = data?.detail || data?.error || 'Link inválido ou expirado.';
        mostrarToast(erro, 'erro');
        setCarregando(false);
      }
    } catch {
      mostrarToast('Não foi possível conectar ao servidor.', 'erro');
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Redefinir senha</h1>
        <form onSubmit={handleSubmit}>

          <label className={styles.label}>NOVA SENHA</label>
          <div className={styles.senhaWrapper}>
            <input
              className={`${styles.input} ${styles.inputSenha}`}
              type={senhaVisivel ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.olhoBtn}
              onClick={() => setSenhaVisivel((v) => !v)}
              aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Image
                src={senhaVisivel ? '/cadastro/aberto.svg' : '/cadastro/fechado.svg'}
                alt=""
                width={22}
                height={22}
              />
            </button>
          </div>

          <label className={styles.label}>CONFIRMAR SENHA</label>
          <input
            className={styles.input}
            type={senhaVisivel ? 'text' : 'password'}
            placeholder="Repita a nova senha"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className={styles.button}
            disabled={carregando}
          >
            {carregando ? 'SALVANDO...' : 'REDEFINIR SENHA'}
          </button>

        </form>
      </div>
    </div>
  );
}