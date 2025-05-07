# My Medium Clone

A minimalist, SEO-optimized blog platform using Next.js, MDX, and Vercel Deploy Hooks.

## Features
- Minimalist Medium-style UI
- Posts as MDX files for easy programmatic creation
- SEO meta tags per page
- Script to add new posts and trigger Vercel deploy hook

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Add a new post:**
   ```bash
   npm run add-post -- "My New Post Title"
   ```
   This will create a new MDX file in `content/posts/` and trigger a Vercel deploy (if configured).

4. **Configure Vercel Deploy Hook:**
   - Set your deploy hook URL in `.env.local` as `VERCEL_DEPLOY_HOOK_URL`.

## Deploying
Deploy to [Vercel](https://vercel.com/) for best results. 