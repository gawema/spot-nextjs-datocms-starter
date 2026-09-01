import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { ImageGridSectionFragment } from '@/components/sections/ImageGridSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

import './index.css';

type Props = {
  data: FragmentOf<typeof ImageGridSectionFragment>;
};

/**
 * A grid that decides its own column count: `auto-fit` with a minimum tile
 * width means two images or nine both look deliberate, and no editor has to
 * pick a number that then fights the viewport.
 */
export default function ImageGridSection({ data }: Props) {
  const { heading, images } = readFragment(ImageGridSectionFragment, data);

  return (
    <SectionContainer className="padding-vertical-main">
      {heading ? <h2 className="image-grid__heading">{heading}</h2> : null}

      <ul className="image-grid" data-datocms-content-link-group>
        {images.map((image) => (
          <li key={image.id}>
            {image.responsiveImage ? <ResponsiveImage data={image.responsiveImage} /> : null}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
