import { LinkFragment } from '@/components/blocks/Link';
import { graphql } from '@/lib/datocms/graphql';

export const SiteHeaderFragment = graphql(
  /* GraphQL */ `
    fragment SiteHeaderFragment on LayoutRecord {
      navigationStyle
      panelPosition
      panelOrientation
      logo {
        url
        alt
        width
        height
      }
      navigation {
        id
        link {
          ...LinkFragment
        }
        dropdown {
          id
          ...LinkFragment
        }
      }
    }
  `,
  [LinkFragment],
);
