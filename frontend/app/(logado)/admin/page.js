export default function DashboardPage() {
  const reservas = [
    { id: '#001', cliente: 'Bento Guilherme Gomes Oliveira', receita: 'PDF', status: 'Em andamento' },
    { id: '#002', cliente: 'Lorenna Meneses de Almeida', receita: 'PNG', status: 'Cancelada' },
    { id: '#003', cliente: 'Lettycia Vitória Melo de França', receita: 'JPEG', status: 'Em andamento' },
    { id: '#004', cliente: 'Anna Beatriz dos Santos Silva', receita: 'PDF', status: 'Cancelada' },
    { id: '#005', cliente: 'Gabriella Theophilo Lacerda Roma', receita: 'JPG', status: 'Em andamento' },
  ];

  const exames = [
    { id: '#001', nome: 'Bento Guilherme Gomes Oliveira', data: '22/04/2026 às 13:00', status: 'Em andamento' },
    { id: '#002', nome: 'Lorenna Meneses de Almeida', data: '23/04/2026 às 14:00', status: 'Em andamento' },
    { id: '#003', nome: 'Lettycia Vitória Melo de França', data: '24/04/2026 às 15:00', status: 'Em andamento' },
  ];

  // Estilos inline para forçar o layout se o CSS travar
  const styles = {
    container: { width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Times New Roman, serif' },
    title: { color: '#965A3E', fontSize: '36px', fontWeight: '400', marginBottom: '40px' },
    cardsContainer: { display: 'flex', gap: '40px', marginBottom: '50px' },
    card: { backgroundColor: '#FFFFFF', padding: '24px 40px', minWidth: '200px', boxShadow: '0px 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    cardTitle: { color: '#965A3E', fontSize: '14px', letterSpacing: '2px', margin: '0 0 16px 0', textTransform: 'uppercase' },
    cardValue: { color: '#5C331E', fontSize: '48px', fontWeight: '400', margin: '0 0 8px 0' },
    cardSub: { color: '#2F7A4A', fontSize: '12px', margin: 0 },
    sectionBlock: { backgroundColor: '#FFFFFF', border: '1px solid rgba(150, 90, 62, 0.2)', padding: '30px 40px', marginBottom: '40px' },
    sectionTitle: { color: '#965A3E', fontSize: '28px', fontWeight: '400', textAlign: 'center', margin: '0 0 30px 0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { color: '#965A3E', fontSize: '11px', fontWeight: '400', letterSpacing: '2px', textTransform: 'uppercase', paddingBottom: '12px', borderBottom: '1px solid #965A3E' },
    td: { padding: '16px 0', color: '#5C331E', fontSize: '13px', borderBottom: '1px solid rgba(150, 90, 62, 0.1)' },
    badge: { display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', textAlign: 'center' },
    emAndamento: { backgroundColor: '#EBF7EE', color: '#2F7A4A', border: '1px solid rgba(47, 122, 74, 0.2)' },
    cancelada: { backgroundColor: '#FDF0F0', color: '#D32F2F', border: '1px solid rgba(211, 47, 47, 0.2)' },
    agendado: { backgroundColor: '#EBF3F9', color: '#1976D2', border: '1px solid rgba(25, 118, 210, 0.2)' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      
      {/* SEÇÃO DOS CARDS */}
      <section style={styles.cardsContainer}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Reservas Ativas</h3>
          <p style={styles.cardValue}>13</p>
          <span style={styles.cardSub}>5 novas hoje</span>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Exames Agendados</h3>
          <p style={styles.cardValue}>5</p>
          <span style={styles.cardSub}>2 novos hoje</span>
        </div>
      </section>

      {/* TABELA: ÚLTIMAS RESERVAS */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionTitle}>Últimas reservas</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Pedido</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Receita</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((item) => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{item.id}</td>
                  <td style={styles.td}>{item.cliente}</td>
                  <td style={styles.td}>{item.receita}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.badge, 
                      ...(item.status === 'Em andamento' ? styles.emAndamento : styles.cancelada) 
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TABELA: ÚLTIMOS EXAMES */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionTitle}>Últimos exames</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>N° Exame</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {exames.map((item) => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{item.id}</td>
                  <td style={styles.td}>{item.nome}</td>
                  <td style={styles.td}>{item.data}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...styles.agendado }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}