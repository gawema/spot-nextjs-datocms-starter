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
  {
    /*
     * Everything below `Content` is rendered twice: on the server when
     * published, and inside the realtime client component in draft mode. Both
     * of these fail only in draft mode, which is why they need a rule and not a
     * convention: a server-only API, and an async component.
     */
    files: ['src/components/{sections,blocks,cms,media}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next-intl/server',
              message:
                'Rendered in the browser in draft mode: use `useTranslations` from next-intl.',
            },
            {
              name: 'next/headers',
              message: 'Rendered in the browser in draft mode: read the request higher up.',
            },
            {
              name: 'server-only',
              message: 'Rendered in the browser in draft mode, so it cannot be server-only.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration > FunctionDeclaration[async=true]',
          message:
            'An async component cannot render in the browser, and draft mode renders this one there.',
        },
        {
          selector: 'ExportDefaultDeclaration > ArrowFunctionExpression[async=true]',
          message:
            'An async component cannot render in the browser, and draft mode renders this one there.',
        },
      ],
    },
  },
]);
