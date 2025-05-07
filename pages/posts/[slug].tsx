import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, getPostBySlug, PostMeta } from '../../lib/posts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

export default function PostPage({ meta, mdxSource }: { meta: PostMeta, mdxSource: MDXRemoteSerializeResult }) {
  return (
    <>
      <Head>
        <title>{meta.title} - My Medium Clone</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        {/* You can add more meta tags here, e.g., for images, author, etc. */}
      </Head>
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
        <article className="post-content">
          <header style={{ marginBottom: 40, borderBottom: '1px solid #eee', paddingBottom: 20 }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
              {meta.title}
            </h1>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>
              Published on {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
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