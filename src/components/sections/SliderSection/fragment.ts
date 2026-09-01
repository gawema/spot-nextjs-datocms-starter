import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

export const SliderSectionFragment = graphql(
  /* GraphQL */ `
    fragment SliderSectionFragment on SliderSectionRecord {
      heading
      images {
        id
        title
        responsiveImage(imgixParams: { fit: crop, ar: "3:2", auto: format }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
