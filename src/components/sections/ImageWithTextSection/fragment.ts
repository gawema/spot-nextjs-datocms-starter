import { LinkFragment } from '@/components/blocks/Link';
import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

export const ImageWithTextSectionFragment = graphql(
  /* GraphQL */ `
    fragment ImageWithTextSectionFragment on ImageWithTextSectionRecord {
      heading
      body
      invertedLayout
      image {
        title
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      link {
        ...LinkFragment
      }
    }
  `,
  [ResponsiveImageFragment, LinkFragment],
);
