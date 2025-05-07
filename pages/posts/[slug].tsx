import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, getPostBySlug, PostMeta } from '../../lib/posts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Avvvatars from 'avvvatars-react';
import { FaRegHandPaper, FaRegComment, FaRegBookmark, FaRegPlayCircle, FaShareAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function PostPage({ meta, mdxSource }: { meta: PostMeta, mdxSource: MDXRemoteSerializeResult }) {
  const [claps, setClaps] = useState(1100);
  const handleComingSoon = () => alert('Coming soon');

  return (
    <>
      <Head>
        <title>{meta.title} - ArtGptAgents</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        {/* You can add more meta tags here, e.g., for images, author, etc. */}
      </Head>
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
        <article className="post-content">
          <header style={{ marginBottom: 40, paddingBottom: 20 }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
              {meta.title}
            </h1>
            <div style={{ height: 12 }} />
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
              {meta.tags && meta.tags.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {meta.tags.map(tag => (
                    <span key={tag} style={{ background: '#f3f3f3', color: '#555', borderRadius: 4, padding: '2px 8px', fontSize: '0.85rem', marginLeft: 4 }}>{tag}</span>
                  ))}
                </span>
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
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { meta, content } = getPostBySlug(params!.slug as string);
  const mdxSource = await serialize(content);
  return {
    props: {
      meta,
      mdxSource,
    },
  };
}; 