import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata, ResolvingMetadata } from 'next';
import { draftMode } from 'next/headers';
import { type SeoOrFaviconTag, type TitleMetaLinkTag, toNextMetadata } from 'react-datocms/seo';
import { executeQuery } from './executeQuery';

/**
 * Generates a function that fits the Next.js `generateMetadata()` format. This
 * automates the creation of meta tags based on the `_seoMetaTags` present in a
 * DatoCMS GraphQL query.
 */
export function generateMetadataFn<PageProps, Result, Variables>(
  options: GenerateMetadataFnOptions<PageProps, Result, Variables>,
) {
  return async function generateMetadata(
    pageProps: PageProps,
    parent: ResolvingMetadata,
  ): Promise<Metadata> {
    const { isEnabled: isDraftModeEnabled } = await draftMode();

    const variables = options.buildQueryVariables
      ? await options.buildQueryVariables(pageProps)
      : ({} as Variables);

    const [parentMetadata, data] = await Promise.all([
      parent,
      executeQuery(options.query, {
        variables,
        includeDrafts: isDraftModeEnabled,
      }),
    ]);

    const tags = options.pickSeoMetaTags(data as Result);
    const routeMetadata = toNextMetadata(tags || []);
    const urls = await options.pickUrls?.(data as Result, pageProps);

    // Combine metadata from parent routes with those of this route:
    return {
      ...(parentMetadata as Metadata),
      ...routeMetadata,
      ...(urls && {
        alternates: { canonical: urls.canonical, languages: urls.languages },
        openGraph: { ...routeMetadata.openGraph, url: urls.canonical },
      }),
    };
  };
}

export type BuildQueryVariablesFn<PageProps, Variables> = (
  context: PageProps,
) => Variables | Promise<Variables>;

export type GenerateMetadataFnOptions<PageProps, Result, Variables> = {
  /** The GraphQL query that will be used to generate metadata. */
  query: TadaDocumentNode<Result, Variables>;

  /** A function that takes page props and builds and returns the variables
   * required by the GraphQL query. */
  buildQueryVariables?: BuildQueryVariablesFn<PageProps, Variables>;

  /** A callback that picks the SEO meta tags from the result of the query. */
  pickSeoMetaTags: (data: Result) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;

  /**
   * The absolute URLs of this page. DatoCMS emits no canonical link of its own,
   * and a localized site needs one, plus an hreflang alternate per translation.
   */
  pickUrls?: (
    data: Result,
    context: PageProps,
  ) => PageUrls | Promise<PageUrls | undefined> | undefined;
};

export type PageUrls = {
  canonical: string;
  /** Locale (or `x-default`) to absolute URL. */
  languages?: Record<string, string>;
};
