# ArtGptAgents

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

# MSDMedium Monorepo Structure

## Category-based Content

- All articles are now organized by category in `content/posts/<category>/<slug>.mdx`.
- Example:
  - `content/posts/ai/my-first-post.mdx`
  - `content/posts/business/how-small-businesses-grew-with-free-diy-apps.mdx`

## Next.js Routing

- Dynamic route: `pages/posts/[category]/[slug].tsx`
- Each post is accessed via `/posts/<category>/<slug>`

## Monorepo & Multi-domain Deployment

- This repository supports deploying each category as a separate Vercel project with its own domain.
- To do this:
  1. In Vercel, create a new project for each category.
  2. Set the root directory to the repo root (or a subfolder if you split apps).
  3. Use environment variables or config to filter posts by category if needed.
  4. Assign a unique domain to each project in the Vercel dashboard.

## Shared Code

- Shared logic and components can be placed in `/lib` or a `/packages` directory for larger projects.

## Adding New Categories

- Create a new folder under `content/posts/` for each new category.
- Add `.mdx` files for posts in that category.

---

For more details or to add more categories, update the post-loading logic in `lib/posts.ts` as needed. 