import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

export const FullImageSectionFragment = graphql(
  /* GraphQL */ `
    fragment FullImageSectionFragment on FullImageSectionRecord {
      caption
      image {
        responsiveImage(imgixParams: { fit: crop, ar: "21:9", auto: format }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
