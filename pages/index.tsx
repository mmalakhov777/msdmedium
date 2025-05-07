import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getAllPosts, PostMeta } from '../lib/posts';

export default function Home({ posts }: { posts: PostMeta[] }) {
  return (
    <>
      <Head>
        <title>ArtGptAgents - Articles</title>
        <meta name="description" content="A collection of articles on various topics." />
      </Head>
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', fontFamily: 'var(--font-sans, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif)' }}>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.slug} style={{ marginBottom: 50, borderBottom: '1px solid #eee', paddingBottom: 30 }}>
              <Link href={`/posts/${post.slug}`} style={{ display: 'block' }}>
                <article>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: 600, color: '#222' }}>
                    {post.title}
                  </h2>
                  <p style={{ color: '#555', margin: '0 0 12px 0', fontSize: '1rem', lineHeight: 1.6, fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif' }}>
                    {post.excerpt}
                  </p>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
}; 