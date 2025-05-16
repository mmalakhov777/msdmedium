import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category?: string;
  tags?: string[];
  author?: string;
  usepic?: string;
  image?: string;
  scenarioId?: string;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Debug: log the contents of the business category directory
try {
  const businessDir = path.join(postsDirectory, 'business');
  if (fs.existsSync(businessDir)) {
    const businessFiles = fs.readdirSync(businessDir);
    console.log(`[DEPLOY LOG] Files in content/posts/business:`, businessFiles);
  } else {
    console.log(`[DEPLOY LOG] Directory content/posts/business does not exist at build time.`);
  }
} catch (e) {
  console.log(`[DEPLOY LOG] Error reading content/posts/business:`, e);
}

// Recursively get all .mdx files in category folders
function getAllPostFiles(dir = postsDirectory, category = ''): { file: string; category: string }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: { file: string; category: string }[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files = files.concat(getAllPostFiles(path.join(dir, entry.name), entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push({ file: path.join(dir, entry.name), category });
    }
  }
  return files;
}

export function getAllPosts(): PostMeta[] {
  const files = getAllPostFiles();
  console.log(`[DEPLOY LOG] Found ${files.length} .mdx files in content/posts`);
  let posts = files
    .map(({ file, category }) => {
      const slug = path.basename(file, '.mdx');
      const fileContents = fs.readFileSync(file, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || '',
        category: data.category || category,
        tags: data.tags || [],
        author: data.author || '',
        usepic: data.usepic || '',
        image: data.image || '',
      };
    });
  console.log('[DEPLOY LOG] Parsed posts:', posts.map(p => ({slug: p.slug, category: p.category, title: p.title})));
  const filterCategory = process.env.CATEGORY;
  console.log('[DEPLOY LOG] filterCategory:', filterCategory);
  if (filterCategory) {
    posts = posts.filter(post =>
      post.category &&
      post.category.trim().toLowerCase() === filterCategory.trim().toLowerCase()
    );
    console.log(`[DEPLOY LOG] Filtering posts by category: ${filterCategory}. Remaining: ${posts.length}`);
  } else {
    console.log(`[DEPLOY LOG] No category filter. Returning all posts: ${posts.length}`);
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllCategories(): string[] {
  let categories = fs.readdirSync(postsDirectory).filter(f => fs.statSync(path.join(postsDirectory, f)).isDirectory());
  const filterCategory = process.env.CATEGORY;
  if (filterCategory) {
    categories = categories.filter(cat => cat.toLowerCase() === filterCategory.toLowerCase());
  }
  return categories;
}

export function getPostBySlug(category: string, slug: string) {
  const fullPath = path.join(postsDirectory, category, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const contentWithoutTitle = content.replace(/^# .+\n+/, '');
  return {
    slug,
    meta: {
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      category: data.category || category,
      tags: data.tags || [],
      author: data.author || '',
      usepic: data.usepic || '',
      image: data.image || '',
      scenarioId: data['Scenario ID'] || '',
    },
    content: contentWithoutTitle,
  };
} 