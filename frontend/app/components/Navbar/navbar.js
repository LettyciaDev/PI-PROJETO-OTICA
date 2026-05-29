'use client';

import { useState, useEffect } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { LiaUserSolid } from 'react-icons/lia';
import { IoIosSearch } from 'react-icons/io';
import { IoBagOutline } from 'react-icons/io5';
import { useCarrinho } from '../../lib/CarrinhoProvider';

const capitalize = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export default function Navbar() {
  const [logado, setLogado] = useState(false);
  const [carregou, setCarregou] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const { quantidade, shake } = useCarrinho();

  useEffect(() => {
    function lerUsuario() {
      const token = localStorage.getItem('access');
      setLogado(!!token);

      if (!token) {
        setNomeUsuario('');
        setCarregou(true);
        return; 
      }

      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setNomeUsuario(user.full_name || user.username || '');
          setCarregou(true);
          return;
        } catch { }
      }

      setNomeUsuario(
        localStorage.getItem('full_name') ||
        localStorage.getItem('username') || ''
      );
      setCarregou(true);
    }

    lerUsuario();

    window.addEventListener('storage', lerUsuario);
    return () => window.removeEventListener('storage', lerUsuario);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInterna}>

        <div className={styles.esquerda}>
          <Link href="/">
            <Image
              src="/Navbar/vizzologo.png"
              className={styles.logo}
              width={200} height={200}
              alt="Vizzo Logo"
              priority
            />
          </Link>
        </div>

        <div className={styles.centro}>
          <Link href="/" className={styles.linkNav}>HOME</Link>
          <Link href="/produtos" className={styles.linkNav}>PRODUTOS</Link>
          <Link href="/#agendamento" className={styles.linkNav}>AGENDAR EXAMES</Link>
          <Link href="/#contato" className={styles.linkNav}>CONTATO</Link>
        </div>

        <div className={styles.direita}>
          <Link href="/pesquisa" className={styles.linkNavIcone}>
            <div className={styles.containerIcone}>
              <IoIosSearch size={32} />
            </div>
          </Link>

          {carregou && (
            logado ? (
              <>
                <Link href="/carrinho" className={styles.linkNavIcone}>
                  <div className={`${styles.containerIcone} ${styles.sacola} ${shake ? styles.shake : ''}`}>
                    <IoBagOutline size={50} />
                    {quantidade > 0 && (
                      <span className={styles.badge}>
                        {quantidade > 99 ? '99+' : quantidade}
                      </span>
                    )}
                  </div>
                </Link>

                <div className={styles.usuarioWrapper}>
                  <Link href="/perfil" className={styles.linkNavIcone}>
                    <div className={styles.containerIcone}>
                      <LiaUserSolid size={55} />
                    </div>
                  </Link>
                  {nomeUsuario && (
                    <span className={styles.meuNome}>
                      Oi! {capitalize(nomeUsuario.split(' ')[0])}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.cadlog}>ENTRAR</Link>
                <Link href="/cadastro" className={styles.cadlog}>CADASTRAR</Link>
              </>
            )
          )}
        </div>

      </div>
    </nav>
  );
}