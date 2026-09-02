# Starting a new client project

The nine steps, followed once per project, in this order. Two of them depend on the order
and the reason is written where it matters. Everything about how the codebase works, and
what may or may not be changed in a client project, is in the [README](../README.md).

1. Open `https://dashboard.datocms.com/deploy?repo=gawema/spot-nextjs-datocms-starter:main`.
   Name the project after the client and create it under the SPOT organization.
2. Choose Vercel when asked for hosting. The flow creates the CDA/CMA tokens, injects them
   as env vars, and calls `/api/post-deploy` to configure the plugins and register the
   cache-invalidation webhook.

   What the copy brings along, verified on the first client project: every model and block,
   the demo content, the **applied-migration records** (so `migrations:run` in the new repo
   replays nothing, and a migration added to this base later applies normally), the
   **Editor role**, and **the plugins with the template's own settings inside them**. What
   it does not bring: the webhooks, which `post-deploy` creates, and `.github/`, so a fresh
   client project has no CI until the merge in step 3 brings it. Give the new repo the two
   CDA tokens as repository secrets, or the workflows skip themselves.

3. The repo you get is a private **copy, not a fork**, so it shares no history with this
   base. If you want to be able to pull base updates later, link it right away, before the
   first edit, while both trees are still identical:

   ```bash
   git remote add base https://github.com/gawema/spot-nextjs-datocms-starter.git
   ```

   ```bash
   git fetch base && git merge base/main --allow-unrelated-histories
   ```

   The copy is byte-identical to this repo at the moment it was made, so a merge done now
   conflicts **only** on the files this base has changed since, and on those the base's
   version is always the right one:

   ```bash
   git diff --name-only --diff-filter=U
   ```

   ```bash
   git checkout --theirs <those files> && git add -A && git commit --no-edit
   ```

   `git diff base/main --stat` should then print nothing: the two trees match again, and
   every later difference is a decision rather than a leftover. `--allow-unrelated-histories`
   is needed this once; from then on it is a plain `git fetch base && git merge base/main`.
   Done later, after the project has diverged, this is a fight instead of two files.

4. **Point the repo at its own project.** `datocms.config.json` still carries this
   template's `siteId`, and the migration CLI reads it, so until you change it every
   `datocms migrations:run` in the client repo runs against the template.

   Then write `.env.local` from `.env.local.example` **before** the first `npm install`:
   `prepare` runs the schema generators, which need the project's tokens to say anything.

5. **Replace `SECRET_API_TOKEN`.** The deploy flow seeds the literal
   `CHANGE-ME-BEFORE-GOING-LIVE`, and every route handler DatoCMS calls refuses to work
   while that value is in place, so draft mode and cache invalidation stay dead until you
   generate a real one:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

   Put it in the Vercel env vars and in `.env.local`, **redeploy**, and only then call
   `post-deploy` again to write it everywhere it belongs. The order is not optional: the
   route reads the secret from its own deployment's environment, so calling it before the
   redeploy writes the placeholder back. It is safe to re-run, and it needs a full-access
   CMA token in the body because it configures plugins:

   ```bash
   curl -X POST "$SITE/api/post-deploy" -H 'Content-Type: application/json' -d "{\"datocmsApiToken\":\"$FULL_CMA_TOKEN\",\"frontendUrl\":\"$SITE\"}"
   ```

   By hand it is four places: the `Authorization` header of the **Web Previews** plugin, the
   same header on the cache-invalidation webhook and on the SEO analysis plugin, and the
   draft-mode URL. Read the response either way: `post-deploy` names the step that failed,
   and the deploy flow does not always surface it.

6. Set `NEXT_PUBLIC_SITE_URL` once the domain is known, keep `SITE_LIVE=false` while it
   still points at the old website, and set the project's locales. In the project's SEO
   preferences, replace the fallback social image with the client's own. Then delete what
   the client does not need: deleting is cheaper and safer than generating.

   The **Alt Text AI** plugin arrives with SPOT's trial key, which is capped and shared by
   every project made from this template. It is there so the plugin works out of the box,
   not as a project's own: a client that actually uses it gets its own key.

7. Fill the two singletons in the CMS: **Layout** (logo, navigation, footer) and
   **Settings** (the interface wording, and the privacy client id once the site is
   registered in `legal.spotagency.ch`). Both come seeded with the template's demo values.

8. Invite the client with the **Editor** role, not as an admin. It can do everything to
   content and assets and can edit the favicon, the global SEO defaults and the no-index
   switch, but not the schema or the project settings. It survives the deploy-flow copy, so
   there is nothing to recreate: check it is there and invite them to it.

9. **Before switching the DNS, fill `redirects.mjs`.** The site replaces an existing one,
   and the day the domain moves every URL Google has indexed either lands somewhere or
   404s. Build the map from the old site's sitemaps, not from memory, and add any retired
   domain to the Vercel project so its rules can be served.
