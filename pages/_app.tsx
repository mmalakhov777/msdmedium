import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { FaDiscord } from 'react-icons/fa';
import { LiaTwitter } from 'react-icons/lia';
import { CopyLinkIcon } from '../icons/CopyLinkIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { XIcon } from '../icons/XIcon';
import DynamicLogo from '../icons/DynamicLogo';
import { getCategoryConfig } from '../lib/categoryConfig';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  // Get the current category from environment variable
  const currentCategory = process.env.NEXT_PUBLIC_CATEGORY || '';
  // Get category-specific configuration
  const config = getCategoryConfig(currentCategory);
  // Extract tags from pageProps if available
  const tags = pageProps?.meta?.tags || ["AI", "Agents", "Jobs", "Automation"];
  // Get current URL for sharing
  const isBrowser = typeof window !== 'undefined';
  const currentUrl = isBrowser ? window.location.href : '';
  // Copy link handler
  const handleCopyLink = () => {
    if (isBrowser) {
      navigator.clipboard.writeText(currentUrl);
      alert('Link copied!');
    }
  };
  return (
    <>
      <Head>
        {pageProps?.meta?.title && <title>{pageProps.meta.title} - {config.siteName}</title>}
        {pageProps?.meta?.meta_description && <meta name="description" content={pageProps.meta.meta_description} />}
        {pageProps?.meta?.meta_title && <meta property="og:title" content={pageProps.meta.meta_title} />}
        {pageProps?.meta?.meta_description && <meta property="og:description" content={pageProps.meta.meta_description} />}
        {pageProps?.meta?.image && <meta property="og:image" content={pageProps.meta.image} />}
        {pageProps?.meta?.keywords && <meta name="keywords" content={pageProps.meta.keywords.join(', ')} />}
      </Head>
      <style>{`
        @media (max-width: 600px) {
          .site-header-artgptagents { display: none !important; }
        }
        html, body { margin: 0; padding: 0; background: #fff; }
      `}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', marginTop: 0, paddingTop: 0 }}>
        <header className="site-header-artgptagents" style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eee', padding: '18px 0', marginBottom: 0, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.01)' }}>
          <div style={{ width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#222', textDecoration: 'none', letterSpacing: '-1px' }}>
              <DynamicLogo style={{ display: 'block', height: 36, width: 145 }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <a href="/login" style={{
                color: config.accentColor,
                textAlign: 'center',
                fontFeatureSettings: '"ss04" on',
                fontFamily: 'Aeonik Pro, Inter, sans-serif',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: 100,
                background: 'none',
                border: 'none',
                transition: 'background 0.2s'
              }}>Login</a>
              <a href="https://discord.gg/v8PB2Zkj" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                padding: '12px 24px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                borderRadius: 100,
                background: config.buttonColor,
                color: config.buttonTextColor,
                textAlign: 'center',
                fontFeatureSettings: '"ss04" on',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                transition: 'background 0.2s'
              }}>
                {config.tagline}
              </a>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, width: '100%' }}>
          <Component {...pageProps} />
        </main>
        <footer style={{ width: '100%', background: '#fafafa', borderTop: '1px solid #eee', padding: '24px 0', marginTop: 48, textAlign: 'center', color: '#888', fontSize: 15 }}>
          © {new Date().getFullYear()} {config.siteName}. All rights reserved.
        </footer>
        <Analytics />
      </div>
      {/* Responsive CSS for right sidebar */}
      <style>{`
        @media (min-width: 1100px) {
          .right-sidebar-artgptagents { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default MyApp; 