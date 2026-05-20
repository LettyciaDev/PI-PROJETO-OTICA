import Link from 'next/link';

export default function AdminLayout({ children }) {
  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F9F6F0',
    },
    sidebar: {
      width: '280px',
      minHeight: '100vh',
      backgroundColor: '#965A3E',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      fontFamily: 'Times New Roman, Times, serif',
    },
    logoContainer: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    logo: {
      maxWidth: '120px',
      height: 'auto',
    },
    titleContainer: {
      textAlign: 'center',
      color: '#FFFFFF',
      marginBottom: '50px',
    },
    mainTitle: {
      fontSize: '26px',
      fontWeight: '400',
      letterSpacing: '2px',
      margin: '0 0 4px 0',
    },
    subTitle: {
      fontSize: '12px',
      fontWeight: '300',
      letterSpacing: '1.5px',
      margin: '0',
      opacity: 0.9,
    },
    navMenu: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    navButton: {
      width: '100%',
      height: '54px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
      letterSpacing: '2px',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    activeButton: {
      backgroundColor: '#5C331E',
      border: '1px solid #FFFFFF',
      borderRadius: '8px',
    },
    rightArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    mainContent: {
      flex: 1,
      padding: '40px',
    },
    /* --- ESTILOS DO FOOTER --- */
    footer: {
      backgroundColor: '#965A3E',
      color: '#FFFFFF',
      fontFamily: 'Times New Roman, Times, serif',
      width: '100%',
      boxSizing: 'border-box',
    },
    footerMain: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '40px',
    },
    footerColAbout: {
      flex: 1.5,
      maxWidth: '350px',
    },
    footerLogoText: {
      fontSize: '32px',
      fontWeight: '400',
      letterSpacing: '2px',
      margin: '0 0 20px 0',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    footerDescription: {
      fontSize: '14px',
      lineHeight: '1.6',
      opacity: 0.8,
      margin: 0,
    },
    footerCol: {
      flex: 1,
    },
    footerColTitle: {
      fontSize: '16px',
      fontWeight: '400',
      letterSpacing: '2px',
      margin: '0 0 24px 0',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    footerUl: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    footerLi: {
      fontSize: '14px',
      opacity: 0.9,
    },
    footerBottom: {
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      opacity: 0.7,
    },
  };

  return (
    <div style={styles.layoutContainer}>
      
      {/* Injeta regras CSS nativas para tratar os hovers sem precisar de JS no servidor */}
      <style dangerouslySetInnerHTML={{__html: `
        .maps-footer-link {
          color: #FFFFFF;
          text-decoration: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }
        .maps-footer-link:hover {
          opacity: 1 !important;
          text-decoration: underline !important;
        }
      `}} />
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img src="/Navbar/logo.png" alt="Vizzo Ótica Logo" style={styles.logo} />
        </div>

        <div style={styles.titleContainer}>
          <h1 style={styles.mainTitle}>VIZZO ADMIN</h1>
          <p style={styles.subTitle}>PAINEL ADMINISTRATIVO</p>
        </div>

        <nav style={styles.navMenu}>
          <Link href="/admin/produtos" style={styles.navButton}>
            PRODUTOS
          </Link>
          <Link href="/admin/reservas" style={styles.navButton}>
            RESERVAS
          </Link>
          <Link href="/admin/agenda" style={styles.navButton}>
            AGENDA
          </Link>
          <Link href="/admin/clientes" style={styles.navButton}>
            CLIENTES
          </Link>
          <Link href="/admin" style={{ ...styles.navButton, ...styles.activeButton }}>
            DASHBOARD
          </Link>
        </nav>
      </aside>

      {/* ÁREA DA DIREITA (CONTEÚDO + FOOTER) */}
      <div style={styles.rightArea}>
        
        <main style={styles.mainContent}>
          {children}
        </main>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerMain}>
            
            <div style={styles.footerColAbout}>
              <h2 style={styles.footerLogoText}>VIZZO ÓTICA</h2>
              <p style={styles.footerDescription}>
                Especialistas em saúde ocular e óculos premium desde 2014.<br />
                Encontre o óculos perfeito para você.
              </p>
            </div>

            <div style={styles.footerCol}>
              <h3 style={styles.footerColTitle}>PRODUTOS</h3>
              <ul style={styles.footerUl}>
                <li style={styles.footerLi}>Armações Femininas</li>
                <li style={styles.footerLi}>Armações Masculinas</li>
                <li style={styles.footerLi}>Óculos Infantil</li>
                <li style={styles.footerLi}>Óculos Solar</li>
                <li style={styles.footerLi}>Lentes de Contato</li>
              </ul>
            </div>

            <div style={styles.footerCol}>
              <h3 style={styles.footerColTitle}>SERVIÇOS</h3>
              <ul style={styles.footerUl}>
                <li style={styles.footerLi}>Exame de Vista</li>
                <li style={styles.footerLi}>Manutenção de Óculos</li>
                <li style={styles.footerLi}>Adaptação de Lentes</li>
                <li style={styles.footerLi}>Convênio</li>
              </ul>
            </div>

            <div style={styles.footerCol}>
              <h3 style={styles.footerColTitle}>CONTATO</h3>
              <ul style={styles.footerUl}>
                <li style={styles.footerLi}>
                  {/* Link com a classe CSS limpa e segura para Server Components */}
                  <a 
                    href="https://www.google.com/local/place/fid/0x7ab1901f3ae1483:0xa52930b3e12fe520/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DRbUEf5SvZolwPT5y7n69QQ%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D355.13858%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFlJiVUVmNVN2Wm9sd1BUNXk3bjY5UVE%3D&sa=X&ved=2ahUKEwjmyOjwkMeUAxXipZUCHeMLE44Qpx96BAgYEBE" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="maps-footer-link"
                  >
                    Parnamirim
                  </a>
                </li>
                <li style={styles.footerLi}>(81) 98438-4624</li>
              </ul>
            </div>

          </div>

          <div style={styles.footerBottom}>
            <span>2026 Vizzo Ótica - Todos os direitos reservados</span>
            <span>Política de privacidade . Termos de Uso</span>
          </div>
        </footer>

      </div>
    </div>
  );
}