import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, getPostBySlug, PostMeta } from '../../../lib/posts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Avvvatars from 'avvvatars-react';
import { FaRegHandPaper, FaRegComment, FaRegBookmark, FaRegPlayCircle, FaShareAlt } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CopyLinkIcon } from '../../../icons/CopyLinkIcon';
import { LinkedInIcon } from '../../../icons/LinkedInIcon';
import { XIcon } from '../../../icons/XIcon';
import { FaDiscord } from 'react-icons/fa';

// Helper to extract headings from markdown
function extractHeadings(markdown: string) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [] as { level: number; text: string; id: string }[];
  let match;
  while ((match = headingRegex.exec(markdown))) {
    const level = match[1].length;
    const text = match[2].replace(/[#]+$/, '').trim();
    // Generate a slug/id for the heading
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, id });
  }
  return headings;
}

export default function PostPage({ meta, mdxSource, headings }: { meta: PostMeta, mdxSource: MDXRemoteSerializeResult, headings: { level: number, text: string, id: string }[] }) {
  const [claps, setClaps] = useState(1100);
  const handleComingSoon = () => alert('Coming soon');

  // Overlay CTA state
  const [showCta, setShowCta] = useState(false);
  const [ctaClosed, setCtaClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowCta(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Extract tags for right sidebar
  const tags = meta.tags || ["AI", "Agents", "Jobs", "Automation"];
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
        <title>{meta.title} - ArtGptAgents</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        {/* You can add more meta tags here, e.g., for images, author, etc. */}
      </Head>
      <main style={{ display: 'flex', width: '100%' }}>
        {/* Table of Contents Sidebar (hidden on mobile) */}
        <nav
          className="toc-sidebar"
          style={{
            borderRight: '1px solid var(--Monochrome-Light, #E8E8E5)',
            display: 'flex',
            width: 300,
            padding: 32,
            flexDirection: 'column',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            position: 'sticky',
            top: 80,
            minWidth: 180,
            maxWidth: 300,
            background: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#222' }}>Contents</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {headings
              .filter(h => h.level > 1 && h.text.toLowerCase() !== 'table of contents')
              .map(h => (
                <li
                  key={h.id}
                  style={{
                    display: 'flex',
                    padding: '12px 0px',
                    alignItems: 'flex-start',
                    gap: 4,
                    alignSelf: 'stretch',
                    borderBottom: '1px solid var(--Monochrome-Light, #E8E8E5)',
                    marginLeft: (h.level - 1) * 16,
                    marginBottom: 0,
                  }}
                >
                  <a href={`#${h.id}`} style={{ color: '#555', textDecoration: 'none', fontSize: 15 + (3 - h.level) * 1.5, fontWeight: h.level === 1 ? 600 : 400 }}>
                    {h.text}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        {/* Main Content */}
        <article className="post-content" style={{
          display: 'flex',
          width: 844,
          padding: '32px 80px 40px 80px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 32,
          flex: 1,
          background: '#fff',
        }}>
          <header style={{ marginBottom: 0, paddingBottom: 0 }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
              {meta.title}
            </h1>
       
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 10 }}>
              {meta.usepic ? (
                <img src={meta.usepic} alt={meta.author} style={{ width: 28, height: 28, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 28, height: 28 }}>
                  <Avvvatars value={meta.author || meta.title} style="shape" size={28} />
                </div>
              )}
              <span style={{ color: '#333', fontWeight: 500 }}>{meta.author}</span>
              <span style={{ color: '#888', fontSize: '0.95rem' }}>• {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {meta.category && (
                <span style={{ color: '#0070f3', fontWeight: 500 }}>• {meta.category}</span>
              )}
            </div>
            <div style={{ borderBottom: '1px solid #eee', marginBottom: 0, marginTop: 18 }} />
            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '18px 0', borderBottom: 'none', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 18, cursor: 'pointer' }} onClick={() => setClaps(claps + 1)}>
                <FaRegHandPaper />
                <span style={{ fontSize: 16, fontWeight: 500 }}>{claps.toLocaleString()}</span>
              </div>
              <a href="https://discord.gg/v8PB2Zkj" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 18, textDecoration: 'none' }}>
                <FaRegComment />
                <span style={{ fontSize: 16, fontWeight: 500 }}>14</span>
              </a>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <Tooltip title="Coming soon" arrow placement="top">
                  <span>
                    <FaRegBookmark style={{ color: '#888', fontSize: 20, cursor: 'pointer' }} />
                  </span>
                </Tooltip>
                <Tooltip title="Coming soon" arrow placement="top">
                  <span>
                    <FaRegPlayCircle style={{ color: '#888', fontSize: 20, cursor: 'pointer' }} />
                  </span>
                </Tooltip>
                <FaShareAlt style={{ color: '#888', fontSize: 20, cursor: 'pointer' }} />
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #eee' }} />
          </header>
          <MDXRemote {...mdxSource} />
        </article>
        {/* Right Sidebar (only on content page) */}
        <aside className="right-sidebar-artgptagents" style={{
          display: 'flex',
          width: 300,
          padding: 32,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 48,
          alignSelf: 'stretch',
          borderLeft: '1px solid var(--Monochrome-Light, #E8E8E5)',
          position: 'sticky',
          top: 80,
          background: '#fff',
          fontFamily: 'Inter, sans-serif',
        }}>
          {/* Tags Block */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#222' }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags && tags.length > 0 ? (
                tags.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      display: 'flex',
                      padding: '4px 10px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 10,
                      borderRadius: 6,
                      background: 'var(--Monochrome-Ultralight, #F8F8F3)',
                      color: '#555',
                      fontSize: 14,
                    }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span style={{ color: '#888', fontSize: 14 }}>No tags</span>
              )}
            </div>
          </div>
          {/* Share Block (screenshot style) */}
          <div style={{ width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, color: '#222' }}>Share article</div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {/* Copy link */}
              <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', padding: '12px 0', fontFamily: 'inherit', fontSize: 16, color: '#222', cursor: 'pointer', textAlign: 'left' }}>
                <CopyLinkIcon style={{ minWidth: 20 }} />
                <span>Copy link</span>
              </button>
              <div style={{ borderBottom: '1px solid #F0F0ED', width: '100%' }} />
              {/* LinkedIn */}
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 0', color: '#222', fontSize: 16, textDecoration: 'none', fontFamily: 'inherit' }}>
                <LinkedInIcon style={{ minWidth: 20 }} />
                <span>Share on LinkedIn</span>
              </a>
              <div style={{ borderBottom: '1px solid #F0F0ED', width: '100%' }} />
              {/* X (Twitter) */}
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 0', color: '#222', fontSize: 16, textDecoration: 'none', fontFamily: 'inherit' }}>
                <XIcon style={{ minWidth: 20 }} />
                <span>Share on X</span>
              </a>
              <div style={{ borderBottom: '1px solid #F0F0ED', width: '100%' }} />
              {/* Discord */}
              <a href="https://discord.gg/v8PB2Zkj" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 0', color: '#222', fontSize: 16, textDecoration: 'none', fontFamily: 'inherit' }}>
                <FaDiscord size={22} style={{ minWidth: 20 }} />
                <span>Join us on Discord</span>
              </a>
              <div style={{ borderBottom: '1px solid #F0F0ED', width: '100%' }} />
            </div>
          </div>
        </aside>
      </main>
      {/* Overlay CTA */}
      {showCta && !ctaClosed && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            background: 'linear-gradient(90deg, #fff 80%, #e0e7ff 100%)',
            padding: '36px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s',
            borderTop: '1.5px solid #e5e7eb',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 18,
            padding: '32px 48px',
            maxWidth: 700,
            width: '90%',
            position: 'relative',
            flexDirection: 'column',
            gap: 18,
          }}>
            <div style={{ fontWeight: 800, fontSize: 32, marginBottom: 4, color: '#1a1a1a', textAlign: 'center' }}>
              Let AI Agents create your job!
            </div>
            <div style={{ fontSize: 20, color: '#444', marginBottom: 12, textAlign: 'center' }}>
              Get early access to our AI-powered job creation platform.
            </div>
            <button
              style={{
                background: '#232323',
                color: '#FFF',
                border: 'none',
                borderRadius: 100,
                padding: '12px 32px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
                textAlign: 'center',
                marginBottom: 10,
                cursor: 'pointer',
                transition: 'background 0.2s',
                letterSpacing: '-0.5px',
              }}
              onClick={() => alert('Coming soon!')}
            >
              Get Instant Help
            </button>
            <button
              onClick={() => setCtaClosed(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: 15,
                fontWeight: 400,
                cursor: 'pointer',
                textDecoration: 'none',
                marginTop: 10,
                alignSelf: 'center',
                transition: 'color 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
              aria-label="Continue Reading"
            >
              Continue reading
            </button>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .toc-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  return {
    paths: posts.map(post => ({ params: { category: post.category, slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { meta, content } = getPostBySlug(params!.category as string, params!.slug as string);
  const headings = extractHeadings(content);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    },
  });
  return {
    props: {
      meta,
      mdxSource,
      headings,
    },
  };
};

// Add responsive CSS for the sidebar
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (min-width: 900px) {
      .toc-sidebar { display: flex !important; }
    }
  `;
  document.head.appendChild(style);
} 