// Article generator with Airtable integration and LangChain-based outline/chapters
const fs = require('fs');
const path = require('path');
const { ChatOpenAI } = require('langchain/chat_models/openai');
require('dotenv').config({ path: '.env.local' });

// Use dynamic import for node-fetch so CommonJS works
let fetchPromise = import('node-fetch');

// === Helper utilities ===
function saveProgress(recordId, data) {
  const dir = path.join(__dirname, 'progress');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${recordId}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function withRetry(fn, retries = 3, delayMs = 1000) {
  let last;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      console.error(`Attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw last;
}

async function generateTextWithTools(prompt, model) {
  const { generateText, openai } = require('ai');
  try {
    const result = await generateText({
      model: openai.responses(model),
      prompt
    });
    return result.text;
  } catch (err) {
    console.error('LLM error:', err);
    throw err;
  }
}

async function getUnsplashImage() {
  const fetchModule = await fetchPromise;
  const fetch = fetchModule.default;
  const url =
    'https://api.unsplash.com/photos/random?client_id=a0TBUO7swRrgcKM92N6_XgqgsVj-ecRuVVG2M_FKDCw';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Unsplash image');
    const data = await res.json();
    return {
      image: data.urls && data.urls.regular,
      image_alt: data.alt_description || '',
      photographer: data.user && data.user.name,
      photographer_url: data.user && data.user.links && data.user.links.html,
      unsplash_url: data.links && data.links.html,
      unsplash_id: data.id
    };
  } catch (err) {
    console.error('Error fetching Unsplash image:', err);
    return { image: 'https://source.unsplash.com/random/1200x800?art' };
  }
}

// === LangChain helpers ===
async function generateOutline(llm, topic) {
  const prompt = `Create a detailed outline for an article about "${topic}". Return a numbered list of chapter titles.`;
  const res = await withRetry(() => llm.call(prompt));
  return res.content || res.text || res;
}

async function generateChapter(llm, topic, chapter, prev) {
  const history = prev.map((c, i) => `${i + 1}. ${c.title}`).join('\n');
  const prompt = `You are writing an article about "${topic}". Previous chapters:\n${history}\nNow write the chapter titled "${chapter}" in detail.`;
  const res = await withRetry(() => llm.call(prompt));
  return res.content || res.text || res;
}

async function main() {
  const fetchModule = await fetchPromise;
  const fetch = fetchModule.default;

  const AIRTABLE_API_KEY = 'pataQ6RMQ5GnQgRNC.06d2999a87413b677e522b561e65868828d29769ba530c7221e47622b96fe93c';
  const BASE_ID = 'appvseKRqCWattMr5';
  const TABLE_ID = 'tblZFRuM1H6JC2Noy';
  const VIEW = 'Ready For Generation';
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?maxRecords=1&view=${encodeURIComponent(VIEW)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(`Airtable API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const rec = data.records && data.records[0];
  if (!rec) {
    console.log('No records ready for generation.');
    return;
  }

  const keyword = rec.fields['Returned Keyword'];
  const recordId = rec.id;
  const progress = { recordId, keyword, outline: [], chapters: [] };
  saveProgress(recordId, progress);

  // === Generate blog post title suggestions ===
  const titlePrompt = `Generate a single compelling blog post title about "${keyword}".`;
  const rawTitle = await generateTextWithTools(titlePrompt, 'gpt-4o-mini');
  const title = rawTitle.split('\n')[0].replace(/\"/g, '').trim();
  progress.title = title;
  saveProgress(recordId, progress);

  // === Generate outline ===
  const llm = new ChatOpenAI({ temperature: 0.7 });
  console.log('Generating outline...');
  const outlineText = await generateOutline(llm, title);
  const chapters = outlineText
    .split(/\n+/)
    .map(t => t.replace(/^\d+\.?\s*/, '').trim())
    .filter(Boolean);
  progress.outline = chapters;
  saveProgress(recordId, progress);

  // === Generate chapters sequentially ===
  for (const chap of chapters) {
    console.log(`Generating chapter: ${chap}`);
    const content = await generateChapter(llm, title, chap, progress.chapters);
    progress.chapters.push({ title: chap, content });
    saveProgress(recordId, progress);
  }

  // Build article content
  const articleBody = progress.chapters
    .map(ch => `## ${ch.title}\n\n${ch.content}`)
    .join('\n\n');
  let article = `# ${title}\n\n${articleBody}`;

  // === Unsplash featured image ===
  const unsplash = await getUnsplashImage();

  const frontmatter = {
    title,
    date: new Date().toISOString().split('T')[0],
    category: rec.fields['Initial Theme'] || 'General',
    tags: [keyword],
    author: 'Content Team',
    image: unsplash.image,
    unsplash_attribution: unsplash.photographer
      ? `Photo by ${unsplash.photographer} on Unsplash (${unsplash.unsplash_url})`
      : ''
  };

  const yaml = require('js-yaml');
  const fm = `---\n${yaml.dump(frontmatter)}---\n\n`;
  article = fm + article;

  progress.article = article;
  saveProgress(recordId, progress);

  // === Save article to file ===
  const postsDir = path.join(__dirname, '..', 'content', 'posts', frontmatter.category);
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  const slug = require('crypto').randomUUID();
  const filePath = path.join(postsDir, `${slug}.mdx`);
  fs.writeFileSync(filePath, article, 'utf8');
  console.log('Created article at', filePath);

  // === Update Airtable status ===
  await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: { Staus: 'Blog Posts Ready' } })
  });

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
