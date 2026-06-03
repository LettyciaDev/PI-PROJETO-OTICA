'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './cadastro.module.css';
import { useToast } from '../../components/Toast/toast';

function formatarErros(data) {
  const mensagens = {
    email: 'Este e-mail já está em uso.',
    username: 'Este e-mail já está em uso.',
    full_name: 'Nome inválido.',
    password: 'Senha inválida.',
    non_field_errors: null, 
  };

  for (const campo in data) {
    const erros = data[campo];
    const msgs = Array.isArray(erros) ? erros : [erros];

    if (mensagens[campo] !== undefined) {
      return mensagens[campo] ?? msgs[0];
    }

    return msgs[0]; 
  }

  return 'Erro ao realizar cadastro. Tente novamente.';
}

export default function CadastroPage() {
  const mostrarToast = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      mostrarToast('Informe seu nome completo.', 'aviso');
      return;
    }
    if (!formData.email.trim()) {
      mostrarToast('Informe um e-mail válido.', 'aviso');
      return;
    }
    if (formData.password.length < 6) {
      mostrarToast('A senha deve ter pelo menos 6 caracteres.', 'aviso');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          username: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarToast('Conta criada com sucesso!', 'sucesso');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500); 
      } else {
        mostrarToast(formatarErros(data), 'erro');
      }
    } catch {
      mostrarToast('Não foi possível conectar ao servidor.', 'erro');
    } finally {
      setCarregando(false);
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
              autoComplete="name"
            />

            <label className={styles.label}>E-MAIL</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <label className={styles.label}>SENHA</label>
            <div className={styles.senhaWrapper}>
              <input
                className={`${styles.input} ${styles.inputSenha}`}
                type={senhaVisivel ? 'text' : 'password'}
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
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
                  alt={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
                  width={22}
                  height={22}
                />
              </button>
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={carregando}
              style={carregando ? { cursor: 'not-allowed', pointerEvents: 'all' } : {}}
            >
              {carregando ? 'CADASTRANDO...' : 'CADASTRAR'}
            </button>

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