# MSD Medium Clone

A customizable Medium-style blogging platform with category-specific branding and deployments.

## Features

- Separate deployments for each category
- Category-specific branding (logos, colors)
- Automated deployment process

## Development

### Running locally with all categories

```bash
npm run dev
```

### Running locally with a specific category

```bash
npm run dev:category
# Then select a category from the list
```

### Generating articles with LangChain and Airtable

Use the generator to process the next Airtable record:

```bash
npm run generate:article
```

Progress for each record is written to `tools/progress/<recordId>.json` and the final post is saved under `content/posts/<category>/<slug>.mdx`.

## Deployment

Each category is deployed as a separate website with its own branding.

### Deploying a specific category

```bash
npm run deploy:category
# Then select a category from the list
```

The deployment script will:
1. Create a category-specific deployment folder if it doesn't exist
2. Copy only the selected category's posts
3. Set up environment variables for the category
4. Deploy to Vercel with category-specific branding

## Structure

- `content/posts/`: Contains category folders with blog posts
- `icons/`: Contains the base and category-specific logos
- `scripts/`: Deployment and development utilities

## Customization

To add a new category:
1. Create a folder in `content/posts/` with the category name
2. Add `.mdx` files for your posts
3. Create a logo component in `icons/Logo[CategoryName].tsx`
4. Add the category to the switch statement in `icons/DynamicLogo.tsx`
5. Add category-specific configuration in `lib/categoryConfig.ts`

Each category can have the following customizations:
- Custom logo
- Accent color
- Site name
- Tagline
- Button color
- Button text color

These customizations are applied automatically when you run or deploy with a specific category.

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