'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
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
    logoutButton: {
      marginTop: '20px',
      width: '100%',
      height: '54px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
      borderRadius: '8px',
      letterSpacing: '2px',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.layoutContainer}>

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
        .admin-logout:hover {
          background-color: #5C331E  !important;
          border-color: #FFFFFF !important;
        }
      `}} />

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside style={styles.sidebar}>

        <div style={styles.titleContainer}>
          <h1 style={styles.mainTitle}>VIZZO ADMIN</h1>
          <p style={styles.subTitle}>PAINEL ADMINISTRATIVO</p>
        </div>

        <nav style={styles.navMenu}>
          <Link href="/admin/produtos" style={{ ...styles.navButton, ...(isActive('/admin/produtos') ? styles.activeButton : {}) }}>
            PRODUTOS
          </Link>
          <Link href="/admin/reservas" style={{ ...styles.navButton, ...(isActive('/admin/reservas') ? styles.activeButton : {}) }}>
            RESERVAS
          </Link>
          <Link href="/admin/agenda" style={{ ...styles.navButton, ...(isActive('/admin/agenda') ? styles.activeButton : {}) }}>
            AGENDA
          </Link>
          <Link href="/admin/clientes" style={{ ...styles.navButton, ...(isActive('/admin/clientes') ? styles.activeButton : {}) }}>
            CLIENTES
          </Link>
          <Link href="/admin" style={{ ...styles.navButton, ...(isActive('/admin') ? styles.activeButton : {}) }}>
            DASHBOARD
          </Link>
          <button
            className="admin-logout"
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('user');
              document.cookie = 'access=; path=/; max-age=0';
              window.location.href = '/';
            }}
            style={{ ...styles.logoutButton }}
          >
            SAIR
          </button>
        </nav>
      </aside>

      {/* ÁREA DA DIREITA (CONTEÚDO + FOOTER) */}
      <div style={styles.rightArea}>

        <main style={styles.mainContent}>
          {children}
        </main>

      </div>
    </div>
  );
}