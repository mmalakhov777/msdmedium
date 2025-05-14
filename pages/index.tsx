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
      <main style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: '0 0', fontFamily: 'var(--font-sans, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif)' }}>
        {/* Hero Section - Isolated Component */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
            width: '100%',
            marginBottom: 0,
            marginTop: 64,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 24,
              alignSelf: 'stretch',
              width: '100%',
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                color: 'var(--Monochrome-Black, #232323)',
                textAlign: 'center',
                fontFamily: 'Orbikular Variable',
                fontSize: 72,
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '80px',
                letterSpacing: '-0.72px',
                width: '100%',
              }}
            >
              Write Better <br />With myStylus
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                color: 'var(--Monochrome-Black, #232323)',
                textAlign: 'center',
                fontFamily: 'Aeonik Pro',
                fontSize: 20,
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '28px',
                width: '100%',
              }}
            >
              Our best content on mastering academic work — <br />from research and citations to AI-assisted writing
            </div>
          </div>
        </div>
        {/* End Hero Section */}
        <div
          style={{
            display: 'flex',
            padding: '0px 200px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            alignSelf: 'stretch',
            width: '100%',
          }}
        >
          {(() => {
            const posts = Object.values(postsByCategory).flat();
            // First article
            const first = posts[0];
            // Next two articles
            const secondRow = posts.slice(1, 3);
            // Remaining articles
            const rest = posts.slice(3);
            return (
              <>
                {/* First article */}
                {first && (
                  <div
                    key={first.slug}
                    style={{
                      display: 'flex',
                      padding: 24,
                      alignItems: 'center',
                      gap: 32,
                      alignSelf: 'stretch',
                      borderRadius: 24,
                      border: '1px solid var(--Monochrome-Light, #E8E8E5)',
                      marginTop: 40,
                      width: '100%',
                    }}
                  >
                    <Link href={`/posts/${first.category}/${first.slug}`} style={{ display: 'block', width: '100%' }}>
                      <article>
                        {first.image && (
                          <img 
                            src={first.image} 
                            alt={first.title} 
                            style={{
                              width: '100%',
                              height: 440,
                              objectFit: 'cover',
                              borderRadius: 12,
                              marginBottom: 16,
                            }}
                          />
                        )}
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.35rem', fontWeight: 600, color: '#222' }}>{first.title}</h3>
                        <p style={{ color: '#555', margin: '0 0 12px 0', fontSize: '1rem', lineHeight: 1.6, fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif' }}>{first.excerpt}</p>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(first.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </article>
                    </Link>
                  </div>
                )}
                {/* Second row: 2 articles per row */}
                {secondRow.length > 0 && (
                  <div style={{ display: 'flex', gap: 24, width: '100%' }}>
                    {secondRow.map(post => (
                      <div
                        key={post.slug}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          gap: 16,
                          flex: '1 0 0',
                          padding: 24,
                          borderRadius: 24,
                          border: '1px solid var(--Monochrome-Light, #E8E8E5)',
                          background: '#fff',
                          width: '100%',
                        }}
                      >
                        <Link href={`/posts/${post.category}/${post.slug}`} style={{ display: 'block', width: '100%' }}>
                          <article>
                            {post.image && (
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                style={{
                                  width: '100%',
                                  height: 180,
                                  objectFit: 'cover',
                                  borderRadius: 12,
                                  marginBottom: 16,
                                }}
                              />
                            )}
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.35rem', fontWeight: 600, color: '#222' }}>{post.title}</h3>
                            <p style={{ color: '#555', margin: '0 0 12px 0', fontSize: '1rem', lineHeight: 1.6, fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif' }}>{post.excerpt}</p>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </article>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                {/* Rest: 3 articles per row */}
                {rest.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, width: '100%' }}>
                    {rest.map((post, i) => (
                      <div
                        key={post.slug}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          gap: 16,
                          flex: '1 0 30%',
                          minWidth: 0,
                          maxWidth: 'calc(33% - 16px)',
                          padding: 24,
                          borderRadius: 24,
                          border: '1px solid var(--Monochrome-Light, #E8E8E5)',
                          background: '#fff',
                          marginBottom: 24,
                          width: '100%',
                        }}
                      >
                        <Link href={`/posts/${post.category}/${post.slug}`} style={{ display: 'block', width: '100%' }}>
                          <article>
                            {post.image && (
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                style={{
                                  width: '100%',
                                  height: 160,
                                  objectFit: 'cover',
                                  borderRadius: 12,
                                  marginBottom: 16,
                                }}
                              />
                            )}
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.35rem', fontWeight: 600, color: '#222' }}>{post.title}</h3>
                            <p style={{ color: '#555', margin: '0 0 12px 0', fontSize: '1rem', lineHeight: 1.6, fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif' }}>{post.excerpt}</p>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </article>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
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