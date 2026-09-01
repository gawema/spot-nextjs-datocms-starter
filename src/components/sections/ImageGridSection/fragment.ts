import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

export const ImageGridSectionFragment = graphql(
  /* GraphQL */ `
    fragment ImageGridSectionFragment on ImageGridSectionRecord {
      heading
      images {
        id
        responsiveImage(imgixParams: { fit: crop, ar: "4:3", auto: format }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
