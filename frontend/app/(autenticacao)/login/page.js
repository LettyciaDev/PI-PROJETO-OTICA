'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { useToast } from '../../components/Toast/toast';

export default function LoginPage() {
  const mostrarToast = useToast();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      mostrarToast('Informe seu e-mail.', 'aviso');
      return;
    }
    if (!password) {
      mostrarToast('Informe sua senha.', 'aviso');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          full_name: data.full_name,
          is_staff: data.is_staff,
        }));
        mostrarToast('Login realizado com sucesso!', 'sucesso');
        setTimeout(() => router.push('/'), 1000);
      } else {
        if (response.status === 401 || response.status === 400) {
          mostrarToast('E-mail ou senha incorretos.', 'erro');
        } else {
          mostrarToast('Erro ao fazer login. Tente novamente.', 'erro');
        }
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

        <div className={styles.formSide}>
          <h1 className={styles.title}>Acessar sua conta</h1>
          <form onSubmit={handleLogin}>

            <label className={styles.label}>E-MAIL</label>
            <input
              className={styles.input}
              type="email"
              placeholder="exemplo@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
            />

            <label className={styles.label}>SENHA</label>
            <div className={styles.senhaWrapper}>
              <input
                className={`${styles.input} ${styles.inputSenha}`}
                type={senhaVisivel ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.olhoBtn}
                onClick={() => setSenhaVisivel((v) => !v)}
                aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Image
                  src={senhaVisivel ? '/cadastro/aberto.svg' : '/cadastro/fechado.svg'}
                  alt={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
                  width={22}
                  height={22}
                />
              </button>
            </div>

            <a href="/esqueci-senha" className={styles.forgot}>Esqueceu a senha?</a>

            <button
              type="submit"
              className={styles.button}
              disabled={carregando}
            >
              {carregando ? 'ENTRANDO...' : 'ENTRAR'}
            </button>

          </form>
          <p className={styles.redirect}>
            Não tem conta?{' '}
            <a href="/cadastro" className={styles.link}>Cadastre-se</a>
          </p>
        </div>

        <div className={styles.imageSide}>
          <div className={styles.logoOverlay}>
            <img src="/login/logo.png" alt="Vizzo Ótica" className={styles.logo} />
          </div>
          <img src="/login/foto-login.png" alt="Modelo" className={styles.photo} />
        </div>

      </div>
    </div>
  );
}