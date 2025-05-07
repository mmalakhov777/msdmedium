const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const title = process.argv[2];
if (!title) {
  console.error('Usage: npm run add-post -- "Post Title"');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const date = new Date().toISOString().slice(0, 10);
const excerpt = `This is a new post titled '${title}'.`;
const content = `---\ntitle: \"${title}\"\ndate: \"${date}\"\nexcerpt: \"${excerpt}\"\n---\n\nWrite your post here.\n`;

const filePath = path.join(__dirname, 'content', 'posts', `${slug}.mdx`);
if (fs.existsSync(filePath)) {
  console.error('Post already exists:', filePath);
  process.exit(1);
}
fs.writeFileSync(filePath, content);
console.log('Created new post:', filePath);

if (process.env.VERCEL_DEPLOY_HOOK_URL) {
  axios.post(process.env.VERCEL_DEPLOY_HOOK_URL)
    .then(() => console.log('Triggered Vercel deploy.'))
    .catch(err => console.error('Failed to trigger Vercel deploy:', err.message));
} else {
  console.log('VERCEL_DEPLOY_HOOK_URL not set. Skipping deploy trigger.');
} 