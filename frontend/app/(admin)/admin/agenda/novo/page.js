'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './novo.module.css';

export default function NovoEvento() {

  const router = useRouter();

  const [form, setForm] = useState({
    titulo: '',
    tipo: 'CONSULTA',
    nome: '',
    telefone: '',
    data: '',
    horario: '',
    status: 'Pendente'
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function salvar() {

    const dadosAntigos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    const novoEvento = {
      id: Date.now(),
      ...form
    };

    localStorage.setItem(
      'agendamentos',
      JSON.stringify([...dadosAntigos, novoEvento])
    );

    router.push('/admin/agenda');
  }

  return (
    <main className={styles.container}>

      <h1 className={styles.titulo}>Novo Evento</h1>

      <div className={styles.form}>

        <input
          className={styles.input}
          name="titulo"
          placeholder="Título do evento"
          onChange={handleChange}
        />

        <select
          className={styles.input}
          name="tipo"
          onChange={handleChange}
          value={form.tipo}
        >
          <option value="CONSULTA">Consulta</option>
          <option value="VISITA_TECNICA">Visita Técnica</option>
          <option value="BOLETO">Boleto</option>
          <option value="ESTOQUE">Reposição de Estoque</option>
          <option value="OUTRO">Outro</option>
        </select>

        <input
          className={styles.input}
          name="nome"
          placeholder="Nome (opcional)"
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="telefone"
          placeholder="Telefone (opcional)"
          onChange={handleChange}
        />

        <input
          className={styles.input}
          type="date"
          name="data"
          onChange={handleChange}
        />

        <input
          className={styles.input}
          type="time"
          name="horario"
          onChange={handleChange}
        />

        <button
          className={styles.botao}
          onClick={salvar}
        >
          Salvar Evento
        </button>

      </div>

    </main>
  );
}