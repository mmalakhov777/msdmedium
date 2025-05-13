import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getAllPosts, PostMeta, getAllCategories } from '../lib/posts';

export default function Home({ postsByCategory }: { postsByCategory: Record<string, PostMeta[]> }) {
  return (
    <>
      <Head>
        <title>ArtGptAgents - Articles</title>
        <meta name="description" content="A collection of articles on various topics." />
      </Head>
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', fontFamily: 'var(--font-sans, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif)' }}>
        {Object.entries(postsByCategory).map(([category, posts]) => (
          <section key={category} style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0070f3', marginBottom: 18, textTransform: 'capitalize' }}>{category}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {posts.map(post => (
                <li key={post.slug} style={{ marginBottom: 40, borderBottom: '1px solid #eee', paddingBottom: 24 }}>
                  <Link href={`/posts/${category}/${post.slug}`} style={{ display: 'block' }}>
                    <article>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.35rem', fontWeight: 600, color: '#222' }}>
                        {post.title}
                      </h3>
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
          </section>
        ))}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  const postsByCategory: Record<string, PostMeta[]> = {};
  posts.forEach(post => {
    if (!post.category) return;
    if (!postsByCategory[post.category]) postsByCategory[post.category] = [];
    postsByCategory[post.category].push(post);
  });
  return { props: { postsByCategory } };
}; 