import { LinkFragment } from '@/components/blocks/Link';
import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

export const HeroSectionFragment = graphql(
  /* GraphQL */ `
    fragment HeroSectionFragment on HeroSectionRecord {
      heading
      body
      image {
        responsiveImage(imgixParams: { fit: crop, ar: "16:9", auto: format }) {
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
