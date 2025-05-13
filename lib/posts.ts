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
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

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
      };
    });
  const filterCategory = process.env.CATEGORY;
  if (filterCategory) {
    posts = posts.filter(post => post.category && post.category.toLowerCase() === filterCategory.toLowerCase());
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
    },
    content: contentWithoutTitle,
  };
} 