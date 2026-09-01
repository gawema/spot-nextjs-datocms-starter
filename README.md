# SPOT Next.js + DatoCMS starter

Starting point for SPOT client projects on Next.js + DatoCMS. Forked from
[datocms/nextjs-starter-kit](https://github.com/datocms/nextjs-starter-kit), paired with the
DatoCMS template project **SPOT Nextjs DatoCMS starter** (project id `225924`).

## Starting a new client project

1. Open `https://dashboard.datocms.com/deploy?repo=gawema/spot-nextjs-datocms-starter:main`.
   Name the project after the client and create it under the SPOT organization.
2. Choose Vercel when asked for hosting. The flow creates the CDA/CMA tokens, injects them
   as env vars, and calls `/api/post-deploy` to install the plugins and register the
   cache-invalidation webhook.
3. The repo you get is a private **copy, not a fork**, so it shares no history with this
   base. If you want to be able to pull base updates later, link it right away, before the
   first edit, while both trees are still identical:

   ```bash
   git remote add base https://github.com/gawema/spot-nextjs-datocms-starter.git
   ```

   ```bash
   git fetch base && git merge base/main --allow-unrelated-histories
   ```

   Done at this point the merge is conflict-free. Done later, after the project has
   diverged, it is a fight.

4. **Replace `SECRET_API_TOKEN`.** The deploy flow seeds the literal
   `CHANGE-ME-BEFORE-GOING-LIVE`, and every route handler DatoCMS calls refuses to work
   while that value is in place, so draft mode and cache invalidation stay dead until you
   generate a real one:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

   Put it in the Vercel env vars and in `.env.local`, then update the token in the URLs of
   the **Web Previews** plugin and of the cache-invalidation webhook, both of which
   `post-deploy` wrote with the placeholder inside.

5. Set `NEXT_PUBLIC_SITE_URL` once the domain is known, keep `SITE_LIVE=false` while it
   still points at the old website, and set the project's locales. Then delete what the
   client does not need: deleting is cheaper and safer than generating.

6. Fill the two singletons in the CMS: **Layout** (logo, navigation, footer) and
   **Settings** (the interface wording, and the privacy client id once the site is
   registered in `legal.spotagency.ch`). Both come seeded with the template's demo values.

7. Invite the client with the **Editor** role, not as an admin. It can do everything to
   content and assets and can edit the favicon, the global SEO defaults and the no-index
   switch, but not the schema or the project settings. Check the role exists on the new
   project: whether it survives the deploy-flow copy is not yet verified.

## Routing and locales

Every page lives under `src/app/[locale]`. German is the default and is served unprefixed,
every other locale is prefixed (`/lage`, `/en/location`). There is no Accept-Language
sniffing and no locale cookie, so a URL resolves the same way for every visitor.

One route, `[[...slug]]`, serves every page record. The record whose slug is `home` is
served at the site root, and `/home` answers 404 so a page never has two URLs. Slugs are
localized, which is why `/seite-zwei` and `/en/page-two` are the same record.

A dead URL renders `not-found.tsx` inside the site shell, header and footer included, with
its wording taken from the CMS like the rest of the interface.

Internal pages, excluded from search results: `/typography`, `/spacing`, `/ui`.

## What is inside

Three layers. Keep them apart in your head:

- **Upstream** (`src/lib/datocms`, `src/app/api`, the gql.tada wiring). Do not edit these
  in place unless you have to. Wrap them instead, so updates from the DatoCMS starter kit
  stay mergeable.
- **SPOT layer**: locale routing, the design-token layer with its two generators, the UI
  primitives and the styleguide pages, the section spine, `sitemap.ts` and `robots.ts`, and
  the two singletons that frame every page. **Layout** feeds the header and the footer:
  logo, a localized two-level navigation, footer text and links. **Settings** holds the
  interface wording and the privacy ids, and mounts SPOT's consent tool, which is also what
  starts Google Tag Manager once the visitor has accepted, so there is no GTM snippet
  anywhere in the code.
- **Example content**: three sections (text, image with text, accordion) and two nested
  blocks (link, accordion item). They are demonstrations of the convention. Copy one, then
  delete the ones the project does not use, in the CMS and in the code.

## Conventions

- **Sections**: one folder per section under `src/components/sections`, with the GraphQL
  fragment in its own `fragment.ts`, never in `index.tsx`. A section becomes a client
  component the moment it gets a slider or an animation, and a server module cannot read
  the exports of a `'use client'` module: keeping the fragment apart means that change
  never breaks the query. Nested blocks under `src/components/blocks` keep the fragment
  colocated, upstream style, because they stay on the server.
- **The section registry** is `src/components/cms/Sections`. Adding a section means three
  lines there, its own folder, and no query changes: every consumer selects
  `sections { ...SectionsFragment }`. The switch on `__typename` has an exhaustiveness
  check, so forgetting the renderer fails to compile instead of rendering nothing.
- **Interface wording lives in the CMS, keys live in the code.** Components call
  `t('t_menu')` as usual, and `src/lib/i18n/request.ts` feeds next-intl from the
  `translations` field on Settings instead of from message files, so a client can reword a
  button without a deploy. It costs no extra request: the query is cached under the
  'datocms' tag like every other. A key with no value renders as the key itself, visibly
  wrong rather than invisibly empty. Client components receive their strings as props, so
  the message catalogue never reaches the browser bundle.
- **Queries** live in `src/lib/query`, not inside route files, because a query always ends
  up with more than one consumer: the route, its metadata, and the client component that
  re-runs it for live draft updates.
- **Never call DatoCMS from the proxy/middleware.** It runs on every request and does not
  use the Next.js Data Cache, so `force-cache` and `next.tags` are silently ignored. This
  has already caused a real API overage on another project.
- **After any schema change**: `npm run generate-schema` and `npm run generate-cma-types`.
  Both also run in `prepare`, so a schema mismatch fails the build rather than breaking at
  runtime, and CI fails on drift between the CMS and the committed `schema.graphql`.

## Design tokens

`src/app/global.css` only imports layers. The system is `src/app/tokens`, in cascade order:
the scale, then the roles that point at it, then the element defaults that read the roles.
A project replaces the values in `primitives.css` and leaves the names alone.

Two files are generated and must never be hand-edited: `fluid.css` (the `clamp()` steps) and
`breakpoints.css`, whose scale lives in `src/lib/layout/breakpoints.ts` so CSS and
TypeScript cannot disagree. CI re-runs both generators and fails if the tree changes.

```bash
npm run generate-fluid-tokens && npm run generate-breakpoint-tokens
```

`/typography`, `/spacing` and `/ui` render the scale and the primitives. Look there before
inventing a value.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill it from the project's API tokens page.

| Variable                              | What it is                                                     |
| ------------------------------------- | -------------------------------------------------------------- |
| `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN` | Read published content                                         |
| `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`     | Read drafts, used in draft mode                                |
| `DATOCMS_CMA_TOKEN`                   | Generate `cma-types.ts`                                        |
| `DATOCMS_BASE_EDITING_URL`            | Project admin origin, scheme included, for click-to-edit links |
| `SECRET_API_TOKEN`                    | Any random string, guards the route handlers                   |
| `NEXT_PUBLIC_SITE_URL`                | Canonical origin; falls back to the Vercel production alias    |
| `SITE_LIVE`                           | `false` disallows indexing entirely                            |
| `DATOCMS_ENVIRONMENT`                 | Optional, points the whole app at a sandbox environment        |

## Draft mode and visual editing

The **Web Previews** plugin needs three values, all pointing at the deployment that is
actually serving the site:

- Preview Links API Endpoint: `<origin>/api/preview-links?token=<SECRET_API_TOKEN>`
- Enable Draft Mode route: `<origin>/api/draft-mode/enable?token=<SECRET_API_TOKEN>`
- Initial Path: `/`

Add a second frontend pointing at `http://localhost:3000` to get the same features while
developing. With draft mode on, the page subscribes to the Real-time Updates API and edits
appear without a reload.

## Checks

```bash
npm run lint && npx tsc --noEmit
```

CI runs those, re-runs the token generators to catch hand-edited output, compares
`schema.graphql` against the live CMS, and builds. A separate workflow smoke-tests the
first ten sitemap URLs of every successful deployment. Both need
`DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN` and `DATOCMS_DRAFT_CONTENT_CDA_TOKEN` as repository
secrets, and skip themselves with a notice when they are missing.

## Pulling updates from the DatoCMS starter kit

The `upstream` remote points at `datocms/nextjs-starter-kit` and the histories are joined,
so their changes can be reviewed and merged directly:

```bash
git fetch upstream && git log --oneline HEAD..upstream/main
```

```bash
git merge upstream/main
```

`git diff upstream/main -- src` prints the current divergence. The structural ones are the
locale routing under `[locale]`, the component tree regrouped by what it renders (`cms`,
`media`, `dev`, `blocks`, `sections`, `ui`, `layout`), the token layer replacing their
`global.css`, and the section spine that replaced their demo routes. Pure moves merge fine
because git detects renames; conflicts appear where we also changed the contents. Keep ours
in those, take theirs everywhere else, and never let a security fix sit unmerged.

## Sending an improvement back to this base

Keep the improvement in its own commit, touching only shared files. Then from here:

```bash
git fetch client && git cherry-pick <sha>
```

A commit that mixes shared and client-specific changes will conflict on cherry-pick,
because the client-only files do not exist in this repo. That is why the commits stay clean.

Anything with a client name, a brand colour, or a client content model in it does not belong
here. If it is useful but hardcoded, make the hardcoded part a parameter and then bring it up.
