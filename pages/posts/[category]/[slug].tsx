import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, getPostBySlug, PostMeta } from '../../../lib/posts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Avvvatars from 'avvvatars-react';
import { FaRegHandPaper, FaRegComment, FaRegBookmark, FaRegPlayCircle, FaShareAlt } from 'react-icons/fa';
import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from '@mui/material';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CopyLinkIcon } from '../../../icons/CopyLinkIcon';
import { LinkedInIcon } from '../../../icons/LinkedInIcon';
import { XIcon } from '../../../icons/XIcon';
import { BackArrow } from '../../../icons/BackArrow';
import { FaDiscord } from 'react-icons/fa';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import MDXImage from '../../../components/MDXImage';

// Import Lottie with dynamic loading to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react').then(mod => mod.default), { ssr: false });
// @ts-ignore - JSON import
import lottieData from '../../../icons/Lottie Gradient.json';

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
  
  // Share block reference and newsletter CTA state
  const shareBlockRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [newsletterFixed, setNewsletterFixed] = useState(false);
  const [fixedCtaStyle, setFixedCtaStyle] = useState({
    position: 'fixed' as 'fixed',
    bottom: '40px',
    right: '40px'
  });

  useEffect(() => {
    const updatePosition = () => {
      if (sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const centerX = sidebarRect.left + (sidebarRect.width / 2);
        const rightDistance = window.innerWidth - centerX - 125; // 125 is half the width of the CTA (250px/2)
        
        setFixedCtaStyle({
          position: 'fixed',
          bottom: '40px',
          right: `${Math.max(20, rightDistance)}px`
        });
      }
    };

    const onScroll = () => {
      setShowCta(window.scrollY > 120);
      
      // Handle newsletter CTA positioning
      if (shareBlockRef.current) {
        const shareBlockBottom = shareBlockRef.current.getBoundingClientRect().bottom;
        // Make newsletter fixed when share block is scrolled out of view
        setNewsletterFixed(shareBlockBottom < 100);
      }
      updatePosition();
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updatePosition);
    // Initialize position
    updatePosition();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updatePosition);
    };
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
          }}
        >
          {/* All Articles Button */}
          <a
            href="/"
            style={{
              display: 'flex',
              padding: '12px 16px',
              alignItems: 'center',
              gap: 4,
              borderRadius: 8,
              border: '1px solid var(--Monochrome-Light, #E8E8E5)',
              color: 'var(--Monochrome-Black, #232323)',
              textAlign: 'center',
              fontFeatureSettings: '"ss04" on',
              fontFamily: 'Aeonik Pro, Inter, sans-serif',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '24px',
              textDecoration: 'none',
              marginBottom: 18,
              background: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#f0f0ed')}
            onMouseOut={e => (e.currentTarget.style.background = '#fff')}
          >
            <BackArrow style={{ width: 20, height: 20, marginRight: 4 }} />
            All Articles
          </a>
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
          gap: 16,
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
              <span style={{ 
                              color: 'var(--Monochrome-Black, #232323)',
              textAlign: 'center',
              fontFeatureSettings: '"ss04" on',
              fontFamily: 'Aeonik Pro, Inter, sans-serif',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
              }}>{meta.author}</span>
              <span style={{ 
                color: 'var(--Monochrome-Black, #232323)',
                textAlign: 'center',
                fontFeatureSettings: '"ss04" on',
                fontFamily: 'Aeonik Pro, Inter, sans-serif',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
              }}>• {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {/* Article image below author/date */}
            {meta.image && (
              <img 
                src={meta.image} 
                alt={meta.title} 
                style={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 16,
                  margin: '18px 0 0 0',
                  display: 'block',
                }}
              />
            )}
          </header>
          <MDXRemote 
            {...mdxSource} 
            components={{
              h1: () => null,
              img: MDXImage
            }}
          />
        </article>
        {/* Right Sidebar (only on content page) */}
        <aside ref={sidebarRef} className="right-sidebar-artgptagents" style={{
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
          
          {/* Share Block */}
          <div ref={shareBlockRef} style={{ marginBottom: 32, width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#222' }}>Share</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'flex',
                  padding: '14px 10px',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#232323',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'flex-start',
                  transition: 'background 0.2s',
                  border: 'none',
                  borderBottom: '1px solid var(--Monochrome-Light, #E8E8E5)',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0f0ed')}
                onMouseOut={e => (e.currentTarget.style.background = '#fff')}
              >
                <CopyLinkIcon style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 15 }}>Copy link</span>
              </button>
              
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(meta.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  padding: '14px 10px',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#232323',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'flex-start',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid var(--Monochrome-Light, #E8E8E5)',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0f0ed')}
                onMouseOut={e => (e.currentTarget.style.background = '#fff')}
              >
                <XIcon style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 15 }}>Share on X</span>
              </a>
              
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  padding: '14px 10px',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#232323',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'flex-start',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid var(--Monochrome-Light, #E8E8E5)',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0f0ed')}
                onMouseOut={e => (e.currentTarget.style.background = '#fff')}
              >
                <LinkedInIcon style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 15 }}>Share on LinkedIn</span>
              </a>
              
              <a
                href={`https://discord.com/channels/@me`}
                onClick={handleComingSoon}
                style={{
                  display: 'flex',
                  padding: '14px 10px',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#232323',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'flex-start',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0f0ed')}
                onMouseOut={e => (e.currentTarget.style.background = '#fff')}
              >
                <FaDiscord style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 15 }}>Share on Discord</span>
              </a>
            </div>
          </div>
        </aside>
      </main>
      
      {/* Fixed Newsletter CTA - Shows only when scrolled past share block */}
      {newsletterFixed && (
        <div className="fixed-newsletter-cta" style={{
          ...fixedCtaStyle,
          display: 'flex',
          width: 250,
          padding: 24,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          borderRadius: 20,
          border: '1px solid var(--Monochrome-Light, #E8E8E5)',
          background: '#FFF',
          boxShadow: '0px 15px 40px 0px rgba(203, 203, 203, 0.25)',
          zIndex: 10,
          overflow: 'hidden',
        }}>
          <div className="lottie-background-sidebar" style={{
            position: 'absolute',
            top: 'auto',
            left: 0,
            right: 0,
            bottom: -30,
            height: '120px',
            zIndex: 0,
            overflow: 'hidden',
            opacity: 0.7,
          }}>
            {typeof Lottie !== 'undefined' && (
              <Lottie 
                animationData={lottieData}
                loop={true}
                style={{ width: '120%', height: '100%', position: 'absolute', left: '-10%' }}
              />
            )}
          </div>
          <div style={{ 
            color: '#000',
            textAlign: 'center',
            fontFamily: '"Aeonik Pro", Inter, sans-serif',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '28px',
            marginBottom: 0,
            zIndex: 1,
          }}>
            AI that gets the job done
          </div>
          <div style={{ 
            color: '#000',
            textAlign: 'center',
            fontFamily: '"Aeonik Pro", Inter, sans-serif',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '20px',
            marginBottom: 16,
            zIndex: 1,
          }}>
            Get early access to our AI-powered platform for smart content creation
          </div>
          <a
            href={
              meta?.scenarioId && meta.scenarioId.trim() !== ''
                ? `https://mystylus.ai/chat-agents?scenario=${encodeURIComponent(meta.scenarioId)}`
                : 'https://mystylus.ai/chat-agents'
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#232323',
              color: '#FFF',
              border: 'none',
              borderRadius: 100,
              padding: '10px 24px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
              letterSpacing: '-0.5px',
              zIndex: 1,
              textDecoration: 'none',
            }}
          >
            Get Instant Help
          </a>
        </div>
      )}

      {/* Overlay CTA */}
      {showCta && !ctaClosed && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            background: '#fff',
            padding: '36px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s',
            borderTop: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <div className="lottie-background" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
          }}>
            {typeof Lottie !== 'undefined' && (
              <Lottie 
                animationData={lottieData}
                loop={true}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
              />
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            borderRadius: 18,
            padding: '32px 48px',
            maxWidth: 700,
            width: '90%',
            position: 'relative',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ 
              color: '#000',
              textAlign: 'center',
              fontFamily: '"Aeonik Pro", Inter, sans-serif',
              fontSize: 36,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '42px',
              marginBottom: 0,
            }}>
              AI that gets the job done
            </div>
            <div style={{ 
              color: '#000',
              textAlign: 'center',
              fontFamily: '"Aeonik Pro", Inter, sans-serif',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '24px',
              marginBottom: 24,
            }}>
              Get early access to our AI-powered platform for smart content creation
            </div>
            <a
              href={
                meta?.scenarioId && meta.scenarioId.trim() !== ''
                  ? `https://mystylus.ai/chat-agents?scenario=${encodeURIComponent(meta.scenarioId)}`
                  : 'https://mystylus.ai/chat-agents'
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
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
                marginBottom: 16,
                cursor: 'pointer',
                transition: 'background 0.2s',
                letterSpacing: '-0.5px',
                textDecoration: 'none',
              }}
            >
              Get Instant Help
            </a>
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
                marginTop: -10,
                padding: 0,
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
          .fixed-newsletter-cta { display: none !important; }
        }
        .lottie-background {
          opacity: 0.7;
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
      remarkPlugins: [remarkGfm],
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