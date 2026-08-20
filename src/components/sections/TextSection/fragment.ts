import { ImageBlockFragment } from '@/components/blocks/ImageBlock';
import { ImageGalleryBlockFragment } from '@/components/blocks/ImageGalleryBlock';
import { VideoBlockFragment } from '@/components/blocks/VideoBlock';
import { PageInlineFragment } from '@/components/cms/inlineRecords/PageInline';
import { PageLinkFragment } from '@/components/cms/linkToRecords/PageLink';
import { graphql } from '@/lib/datocms/graphql';

/*
 * The fragment lives apart from the component on purpose: the query module that
 * composes it runs on the server, and a section that later adds an animation or
 * a piece of state becomes a client module, whose exports the server can no
 * longer read.
 */
export const TextSectionFragment = graphql(
  /* GraphQL */ `
    fragment TextSectionFragment on TextSectionRecord {
      heading
      body {
        value
        blocks {
          ... on RecordInterface {
            id
            __typename
          }
          ...ImageBlockFragment
          ...ImageGalleryBlockFragment
          ...VideoBlockFragment
        }
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
  [
    ImageBlockFragment,
    ImageGalleryBlockFragment,
    VideoBlockFragment,
    PageInlineFragment,
    PageLinkFragment,
  ],
);
