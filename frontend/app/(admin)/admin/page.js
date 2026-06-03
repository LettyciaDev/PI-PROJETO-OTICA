'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [exames, setExames] = useState([]);
  const [totalReservasAtivas, setTotalReservasAtivas] = useState(0);
  const [totalExames, setTotalExames] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      try {
        const headers = authHeaders();

        const [resReservas, resExames] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservas/`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/exames/`, { headers }),
        ]);

        if (resReservas.status === 401 || resExames.status === 401) {
          router.push('/login');
          return;
        }

        const dadosReservas = await resReservas.json();
        const dadosExames = await resExames.json();

        const listaReservas = Array.isArray(dadosReservas) ? dadosReservas : (dadosReservas.results ?? []);
        const listaExames = Array.isArray(dadosExames) ? dadosExames : (dadosExames.results ?? []);

        // Cards
        const ativas = listaReservas.filter(r => r.status === 'pendente' || r.status === 'confirmada');
        setTotalReservasAtivas(ativas.length);
        setTotalExames(listaExames.length);

        // Tabelas — 5 mais recentes (já vêm ordenados por -criado_em do backend)
        setReservas(listaReservas.slice(0, 5));
        setExames(listaExames.slice(0, 5));

      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setCarregando(false);
      }
    }

    fetchDados();
  }, []);

  const statusReservaStyle = (status) => {
    if (status === 'pendente' || status === 'confirmada') return styles.emAndamento;
    if (status === 'cancelada') return styles.cancelada;
    return styles.agendado;
  };

  const statusReservaLabel = (status) => {
    const map = { pendente: 'Pendente', confirmada: 'Confirmada', concluida: 'Concluída', cancelada: 'Cancelada' };
    return map[status] ?? status;
  };

  const statusExameLabel = (status) => {
    const map = { pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado' };
    return map[status] ?? status;
  };

  const statusExameStyle = (status) => {
    if (status === 'confirmado') return styles.emAndamento;
    if (status === 'cancelado') return styles.cancelada;
    return styles.agendado;
  };

  const styles = {
    container: { width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Times New Roman, serif' },
    title: { color: '#965A3E', fontSize: '36px', fontWeight: '400', marginBottom: '40px' },
    cardsContainer: { display: 'flex', gap: '40px', marginBottom: '50px' },
    card: { backgroundColor: '#FFFFFF', padding: '24px 40px', minWidth: '200px', boxShadow: '0px 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '12px' },
    cardTitle: { color: '#965A3E', fontSize: '15px', letterSpacing: '2px', margin: '0 0 16px 0', textTransform: 'uppercase', fontFamily: 'Jomolhari, serif', fontWeight: 'normal'},
    cardValue: { color: '#5C331E', fontSize: '48px', fontWeight: '400', margin: '0 0 8px 0' },
    cardSub: { color: '#2F7A4A', fontSize: '12px', margin: 0, fontFamily: 'Poppins, sans-serif' },
    sectionBlock: { backgroundColor: '#FFFFFF', border: '1px solid rgba(150, 90, 62, 0.2)', padding: '30px 40px', marginBottom: '40px', borderRadius: '12px'},
    sectionTitle: { color: '#965A3E', fontSize: '28px', fontWeight: '400', textAlign: 'center', margin: '0 0 30px 0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { color: '#965A3E', fontSize: '15px', fontWeight: '400', letterSpacing: '2px', textTransform: 'uppercase', paddingBottom: '12px', borderBottom: '1px solid #965A3E' },
    td: { padding: '16px 0', color: '#5C331E', fontSize: '13px', borderBottom: '1px solid rgba(150, 90, 62, 0.1)', fontFamily: 'Poppins, sans-serif' },
    badge: { display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', textAlign: 'center' },
    emAndamento: { backgroundColor: '#EBF7EE', color: '#2F7A4A', border: '1px solid rgba(47, 122, 74, 0.2)' },
    cancelada: { backgroundColor: '#FDF0F0', color: '#D32F2F', border: '1px solid rgba(211, 47, 47, 0.2)' },
    agendado: { backgroundColor: '#EBF3F9', color: '#1976D2', border: '1px solid rgba(25, 118, 210, 0.2)' },
    vazio: { color: '#999', fontSize: '13px', textAlign: 'center', padding: '24px 0' },
  };

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <p style={{ color: '#965A3E', fontFamily: 'Joan, serif', fontSize: '20px' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* CARDS */}
      <section style={styles.cardsContainer}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Reservas Ativas</h3>
          <p style={styles.cardValue}>{totalReservasAtivas}</p>
          <span style={styles.cardSub}>pendentes + confirmadas</span>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Exames Agendados</h3>
          <p style={styles.cardValue}>{totalExames}</p>
          <span style={styles.cardSub}>total cadastrado</span>
        </div>
      </section>

      {/* TABELA RESERVAS */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionTitle}>Últimas reservas</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {reservas.length === 0 ? (
            <p style={styles.vazio}>Nenhuma reserva encontrada.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Pedido</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Data de visita</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>#{String(item.id).padStart(3, '0')}</td>
                    <td style={styles.td}>{item.nome_cliente}</td>
                    <td style={styles.td}>{item.data_visita} às {item.horario_visita?.slice(0, 5)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusReservaStyle(item.status) }}>
                        {statusReservaLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* TABELA EXAMES */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionTitle}>Últimos exames</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {exames.length === 0 ? (
            <p style={styles.vazio}>Nenhum exame encontrado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>N° Exame</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Data preferida</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {exames.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>#{String(item.id).padStart(3, '0')}</td>
                    <td style={styles.td}>{item.nome_cliente}</td>
                    <td style={styles.td}>{item.data_preferencia}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusExameStyle(item.status) }}>
                        {statusExameLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}