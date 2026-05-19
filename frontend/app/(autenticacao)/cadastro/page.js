'use client';
import { useState } from 'react';
import styles from './cadastro.module.css';

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          username: formData.email
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = '/login';
      } else {
        console.error("Erro no cadastro:", data);
        alert(`Erro: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Não foi possível conectar ao servidor Django.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.imageSide}>
          <div className={styles.logoOverlay}>
            <img src="/login/logo.png" alt="Vizzo Ótica" className={styles.logo} />
          </div>
          <img src="/login/foto-cadastro.png" alt="Modelo" className={styles.photo} />
        </div>

        <div className={styles.formSide}>
          <h1 className={styles.title}>Crie sua conta</h1>
          <form onSubmit={handleRegister}>
            <label className={styles.label}>NOME COMPLETO</label>
            <input
              className={styles.input}
              type="text"
              name="full_name"
              placeholder="Seu nome completo"
              value={formData.full_name}
              onChange={handleChange}
            />
            <label className={styles.label}>E-MAIL</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="example@gmail.com.br"
              value={formData.email}
              onChange={handleChange}
            />
            <label className={styles.label}>SENHA</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className={styles.button}>CADASTRAR</button>
          </form>
          <p className={styles.redirect}>
            Já tem conta?{' '}
            <a href="/login" className={styles.link}>Faça login</a>
          </p>
        </div>

      </div>
    </div>
  );
  
}
