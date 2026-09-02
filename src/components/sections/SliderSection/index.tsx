import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { SliderSectionFragment } from '@/components/sections/SliderSection/fragment';
import Carousel from '@/components/ui/Carousel';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { useTranslations } from 'next-intl';

import './index.css';

type Props = {
  data: FragmentOf<typeof SliderSectionFragment>;
};

/**
 * Images side by side, dragged rather than scrolled.
 *
 * The behaviour lives in `ui/Carousel`, which is the only client part: the
 * slides below are rendered on the server and handed to it as children, so the
 * images never reach the browser as JavaScript.
 *
 * Synchronous, and translated through `useTranslations` rather than
 * `getTranslations`: in draft mode this whole subtree is rendered by the
 * realtime client component, where an async component cannot run and the
 * server-only translation API throws.
 */
export default function SliderSection({ data }: Props) {
  const { heading, images } = readFragment(SliderSectionFragment, data);
  const t = useTranslations();

  return (
    <SectionContainer className="padding-vertical-main" width="content">
      {heading ? <h2 className="slider__heading">{heading}</h2> : null}

      <div data-datocms-content-link-group>
        <Carousel
          label={heading ?? undefined}
          previousLabel={t('t_previous')}
          nextLabel={t('t_next')}
        >
          {images.map((image) => (
            <figure className="slider__slide" key={image.id}>
              {image.responsiveImage ? <ResponsiveImage data={image.responsiveImage} /> : null}
              {image.title ? (
                <figcaption className="slider__caption">{image.title}</figcaption>
              ) : null}
            </figure>
          ))}
        </Carousel>
      </div>
    </SectionContainer>
  );
}
