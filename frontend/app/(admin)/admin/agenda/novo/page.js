'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../../lib/api';
import { useToast } from '../../../../components/Toast/toast';
import styles from './novo.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NovoExame() {
  const router       = useRouter();
  const mostrarToast = useToast();
  const [salvando,   setSalvando]   = useState(false);

  const [form, setForm] = useState({
    nome_cliente:      '',
    telefone_whatsapp: '',
    convenio:          '',
    data_preferencia:  '',
    periodo_preferido: 'qualquer',
    observacoes:       '',
  });

  // Campos de controle interno (admin já preenche na criação se quiser)
  const [interno, setInterno] = useState({
    status:            'pendente',
    data_confirmada:   '',
    horario_confirmado:'',
    observacoes_admin: '',
    retorno_cliente:   '',
  });

  function handleForm(e)     { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleInterno(e)  { setInterno({ ...interno, [e.target.name]: e.target.value }); }

  async function salvar() {
    if (!form.nome_cliente || !form.telefone_whatsapp || !form.data_preferencia) {
      mostrarToast('Preencha nome, telefone e data de preferência.', 'erro');
      return;
    }
    if (salvando) return;
    setSalvando(true);

    try {
      // 1. Cria o agendamento
      const res = await fetch(`${API_URL}/exames/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const erro = await res.json();
        const msg  = typeof erro === 'object'
          ? Object.values(erro).flat().join(' ')
          : 'Erro ao criar agendamento.';
        mostrarToast(msg, 'erro');
        return;
      }

      const criado = await res.json();

      // 2. Se o admin preencheu campos internos, aplica via PATCH
      const temInterno = interno.status !== 'pendente'
        || interno.data_confirmada
        || interno.horario_confirmado
        || interno.observacoes_admin
        || interno.retorno_cliente;

      if (temInterno) {
        await fetch(`${API_URL}/exames/${criado.id}/status/`, {
          method: 'PATCH',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status:             interno.status,
            data_confirmada:    interno.data_confirmada    || null,
            horario_confirmado: interno.horario_confirmado || null,
            observacoes_admin:  interno.observacoes_admin,
            retorno_cliente:    interno.retorno_cliente,
          }),
        });
      }

      mostrarToast('Agendamento criado!', 'sucesso');
      router.push('/admin/agenda');
    } catch {
      mostrarToast('Erro de conexão.', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.titulo}>Novo Agendamento de Exame</h1>

      <div className={styles.form}>
        <h2 className={styles.secao}>Dados do cliente</h2>

        <label className={styles.label}>Nome do cliente *</label>
        <input className={styles.input} name="nome_cliente" placeholder="Nome completo" value={form.nome_cliente} onChange={handleForm} />

        <label className={styles.label}>Telefone / WhatsApp *</label>
        <input className={styles.input} name="telefone_whatsapp" placeholder="(81) 99999-9999" value={form.telefone_whatsapp} onChange={handleForm} />

        <label className={styles.label}>Convênio</label>
        <input className={styles.input} name="convenio" placeholder="Ex: Unimed, SulAmérica... (opcional)" value={form.convenio} onChange={handleForm} />

        <label className={styles.label}>Data de preferência *</label>
        <input className={styles.input} type="date" name="data_preferencia" value={form.data_preferencia} onChange={handleForm} />

        <label className={styles.label}>Período preferido</label>
        <select className={styles.input} name="periodo_preferido" value={form.periodo_preferido} onChange={handleForm}>
          <option value="qualquer">Qualquer</option>
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
        </select>

        <label className={styles.label}>Observações do cliente</label>
        <textarea className={styles.textarea} name="observacoes" rows={3} placeholder="Informações relevantes para o atendimento..." value={form.observacoes} onChange={handleForm} />

        <hr className={styles.divisor} />
        <h2 className={styles.secao}>Controle interno</h2>

        <label className={styles.label}>Status</label>
        <select className={styles.input} name="status" value={interno.status} onChange={handleInterno}>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>

        <label className={styles.label}>Data confirmada pela ótica</label>
        <input className={styles.input} type="date" name="data_confirmada" value={interno.data_confirmada} onChange={handleInterno} />

        <label className={styles.label}>Horário confirmado</label>
        <input className={styles.input} type="time" name="horario_confirmado" value={interno.horario_confirmado} onChange={handleInterno} />

        <label className={styles.label}>Observações internas</label>
        <textarea className={styles.textarea} name="observacoes_admin" rows={3} placeholder="Anotações internas (não visíveis ao cliente)..." value={interno.observacoes_admin} onChange={handleInterno} />

        <label className={styles.label}>Mensagem de retorno ao cliente</label>
        <textarea className={styles.textarea} name="retorno_cliente" rows={3} placeholder="Será enviada por WhatsApp ao salvar..." value={interno.retorno_cliente} onChange={handleInterno} />

        <button className={styles.botao} onClick={salvar} disabled={salvando} style={{ opacity: salvando ? 0.6 : 1 }}>
          {salvando ? 'Salvando...' : 'Criar agendamento'}
        </button>
      </div>
    </main>
  );
}