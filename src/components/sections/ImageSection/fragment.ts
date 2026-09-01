import { ResponsiveImageFragment } from '@/components/media/ResponsiveImage';
import { graphql } from '@/lib/datocms/graphql';

/*
 * No `ar` in the imgix params on purpose: the aspect ratio is an option now, so
 * the crop happens in CSS. That keeps one URL per image whatever the editor
 * picks, at the price of downloading the pixels a tall crop hides. The focal
 * point comes along so the crop keeps the subject, exactly as `crop=focalpoint`
 * would have.
 */
export const ImageSectionFragment = graphql(
  /* GraphQL */ `
    fragment ImageSectionFragment on ImageSectionRecord {
      width
      aspectRatio
      caption
      image {
        focalPoint {
          x
          y
        }
        responsiveImage(imgixParams: { auto: format }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
