import { PageUrlFragment, buildUrlForPage } from '@/lib/datocms/gqlUrlBuilder/page';
import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';
import { stripStega } from '@datocms/content-link';
import NextLink from 'next/link';

/**
 * The `link` block: an internal page or an external URL, nested inside the
 * sections that need a call to action.
 *
 * Presentation is deliberately not part of the content model: whether this
 * renders as a button or as plain text is up to the section around it, styled
 * from there. The block only answers where the link goes and what it says.
 */
export const LinkFragment = graphql(
  /* GraphQL */ `
    fragment LinkFragment on LinkRecord {
      label
      externalUrl
      openInNewTab
      page {
        title
        ...PageUrlFragment
      }
    }
  `,
  [PageUrlFragment],
);

type Props = {
  data: FragmentOf<typeof LinkFragment>;
  locale: SiteLocale;
  /** Defaults to the call-to-action look. Navigation and footer pass their own. */
  className?: string;
};

export default function Link({ data, locale, className = 'cms-link' }: Props) {
  const { label, externalUrl, openInNewTab, page } = readFragment(LinkFragment, data);

  /*
   * The markers are stripped from the URL and kept in the label: an href has to
   * parse, the text is what the editor clicks to edit. The field has them turned
   * off anyway, this also covers a project whose schema predates that.
   */
  const href = page ? buildUrlForPage(page, locale) : stripStega(externalUrl);
  // An empty label falls back to the linked page's title. DatoCMS returns a
  // cleared string field as "", which `??` would happily keep.
  const text = label?.trim() || page?.title;

  // Nothing to link to, or nothing to show: the editor left the block half-filled.
  if (!href || !text) {
    return null;
  }

  return (
    <NextLink
      className={className}
      href={href}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-datocms-content-link-boundary
    >
      {text}
    </NextLink>
  );
}
