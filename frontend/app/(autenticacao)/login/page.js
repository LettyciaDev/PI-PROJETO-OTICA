'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);  
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error("Erro no login:", errorData);
        alert("Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
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
              type="text"
              placeholder="E-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className={styles.label}>SENHA</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.forgot}>Esqueceu a senha?</a>
            <button type="submit" className={styles.button}>ENTRAR</button>
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