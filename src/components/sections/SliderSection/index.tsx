import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { SliderSectionFragment } from '@/components/sections/SliderSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

import './index.css';

type Props = {
  data: FragmentOf<typeof SliderSectionFragment>;
};

/**
 * A slider with no slider library: an overflowing list with scroll snapping.
 *
 * That buys the native swipe on touch, the trackpad gesture, keyboard scrolling
 * and a real scrollbar, none of which a JavaScript carousel gets for free. What
 * it does not have is arrows and dots; a project that needs them adds a client
 * component here and keeps the same markup underneath.
 */
export default function SliderSection({ data }: Props) {
  const { heading, images } = readFragment(SliderSectionFragment, data);

  return (
    <SectionContainer className="padding-vertical-main">
      {heading ? <h2 className="slider__heading">{heading}</h2> : null}

      <ul className="slider" tabIndex={0} data-datocms-content-link-group>
        {images.map((image) => (
          <li className="slider__slide" key={image.id}>
            {image.responsiveImage ? <ResponsiveImage data={image.responsiveImage} /> : null}
            {image.title ? <p className="slider__caption">{image.title}</p> : null}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
