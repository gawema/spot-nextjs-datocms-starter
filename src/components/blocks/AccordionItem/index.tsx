import { Text } from '@/components/cms/Text';
import PageInline, { PageInlineFragment } from '@/components/cms/inlineRecords/PageInline';
import PageLink, { PageLinkFragment } from '@/components/cms/linkToRecords/PageLink';
import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

/**
 * One row of an accordion section. `<details>` gives open/close behaviour with
 * no JavaScript and no client component, which is where a template should
 * start: a project that wants animated panels replaces this one file.
 *
 * The body accepts no blocks, only prose and references to other pages, so it
 * renders records but never `renderBlock`.
 */
export const AccordionItemFragment = graphql(
  /* GraphQL */ `
    fragment AccordionItemFragment on AccordionItemRecord {
      heading
      body {
        value
        links {
          ... on RecordInterface {
            id
            __typename
          }
          ...PageInlineFragment
          ...PageLinkFragment
        }
      }
    }
  `,
  [PageInlineFragment, PageLinkFragment],
);

type Props = {
  data: FragmentOf<typeof AccordionItemFragment>;
  locale: SiteLocale;
};

export default function AccordionItem({ data, locale }: Props) {
  const { heading, body } = readFragment(AccordionItemFragment, data);

  return (
    <details>
      <summary>{heading}</summary>
      <Text
        data={body}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case 'PageRecord':
              return <PageInline record={record} locale={locale} />;
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ transformedMeta, record, children }) => {
          switch (record.__typename) {
            case 'PageRecord':
              return (
                <PageLink record={record} transformedMeta={transformedMeta} locale={locale}>
                  {children}
                </PageLink>
              );
            default:
              return null;
          }
        }}
      />
    </details>
  );
}
