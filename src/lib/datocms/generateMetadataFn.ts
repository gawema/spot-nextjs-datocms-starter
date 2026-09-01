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
    const overrides = await options.pickSeoOverrides?.(data as Result, pageProps);
    const image = overrides?.socialImage;

    // Combine metadata from parent routes with those of this route:
    return {
      ...(parentMetadata as Metadata),
      ...routeMetadata,
      ...(overrides && {
        alternates: { canonical: overrides.canonical, languages: overrides.languages },
        openGraph: {
          ...routeMetadata.openGraph,
          url: overrides.canonical,
          ...(image && { images: [image] }),
        },
        ...(image && { twitter: { ...routeMetadata.twitter, images: [image] } }),
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
   * What DatoCMS does not get right on its own: it emits no canonical link, no
   * hreflang alternates, and a social image that is resized but never cropped.
   */
  pickSeoOverrides?: (
    data: Result,
    context: PageProps,
  ) => SeoOverrides | Promise<SeoOverrides | undefined> | undefined;
};

export type SeoOverrides = {
  canonical: string;
  /** Locale (or `x-default`) to absolute URL. */
  languages?: Record<string, string>;
  /** Replaces DatoCMS's `og:image` and `twitter:image`. */
  socialImage?: { url: string; width: number; height: number; alt?: string };
};
