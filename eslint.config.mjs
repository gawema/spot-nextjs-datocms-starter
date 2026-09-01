import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  nextVitals,
  nextTs,
  globalIgnores([
    '**/.next/**',
    // The dist dir used to build while a dev server holds .next.
    '**/.next-*/**',
    '**/node_modules/**',
    '.vercel/**',
    // Claude Code worktrees carry their own checkout and build output.
    '.claude/**',
    // Migrations run through the DatoCMS CLI, not through the app's toolchain.
    'migrations/**',
    // Generated from the CMS schema, see the two npm run generate-* commands.
    'src/lib/datocms/cma-types.ts',
    'src/lib/datocms/graphql-env.d.ts',
  ]),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
]);
