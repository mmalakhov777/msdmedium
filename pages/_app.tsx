import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .site-header-artgptagents { display: none !important; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="site-header-artgptagents" style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eee', padding: '18px 0', marginBottom: 32, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.01)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#222', textDecoration: 'none', letterSpacing: '-1px' }}>
              ArtGptAgents
            </a>
            <a href="https://discord.gg/v8PB2Zkj" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              padding: '12px 32px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              borderRadius: 100,
              background: 'var(--Monochrome-Black, #232323)',
              color: 'var(--Monochrome-White, #FFF)',
              textAlign: 'center',
              fontFeatureSettings: '"ss04" on',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '24px',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
              marginLeft: 16
            }}>
              Get Instant Help
            </a>
          </div>
        </header>
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
        <footer style={{ width: '100%', background: '#fafafa', borderTop: '1px solid #eee', padding: '24px 0', marginTop: 48, textAlign: 'center', color: '#888', fontSize: 15 }}>
          © {new Date().getFullYear()} ArtGptAgents. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default MyApp; 