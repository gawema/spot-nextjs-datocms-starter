import SectionContainer, { type SectionWidth } from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { ImageSectionFragment } from '@/components/sections/ImageSection/fragment';
import { classList } from '@/lib/classList';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

import './index.css';

type Props = {
  data: FragmentOf<typeof ImageSectionFragment>;
};

/** The CMS enum, narrowed to a lane. Anything else means the safe default. */
function toLane(value: string | null): SectionWidth {
  return value === 'wide' || value === 'bleed' ? value : 'content';
}

const RATIOS = new Map([
  ['21:9', '21 / 9'],
  ['16:9', '16 / 9'],
  ['4:3', '4 / 3'],
  ['1:1', '1'],
]);

/**
 * One image, as wide as the editor asked and cropped to the ratio they picked.
 * `original` and `fullscreen` are the two ends: no crop at all, or as tall as
 * the viewport.
 */
export default function ImageSection({ data }: Props) {
  const { image, caption, width, aspectRatio } = readFragment(ImageSectionFragment, data);

  const lane = toLane(width);
  const ratio = RATIOS.get(aspectRatio ?? '');
  const isFullscreen = aspectRatio === 'fullscreen';
  const focalPoint = image.focalPoint;

  return (
    <SectionContainer width={lane} className="padding-vertical-main">
      {/*
       * A bleeding image leaves the grid, its caption comes back to the content
       * lane. In the other lanes the figure is already the right width and
       * needs no grid of its own.
       */}
      <figure
        className={classList(['image-section', lane === 'bleed' && 'layout-lanes'])}
        data-datocms-content-link-group
      >
        {image.responsiveImage ? (
          <ResponsiveImage
            data={image.responsiveImage}
            /* 72rem is --layout-content; a bleeding image is the viewport. */
            sizes={lane === 'bleed' ? '100vw' : '(min-width: 1152px) 1152px, 100vw'}
            pictureClassName="image-section__media"
            imgStyle={{
              width: '100%',
              height: isFullscreen ? '100svh' : undefined,
              aspectRatio: ratio,
              objectFit: ratio || isFullscreen ? 'cover' : undefined,
              /*
               * What `crop=focalpoint` does server-side: line the focal point
               * of the image up with the same point of the box.
               */
              objectPosition: focalPoint
                ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
                : undefined,
            }}
          />
        ) : null}
        {caption ? <figcaption className="image-section__caption">{caption}</figcaption> : null}
      </figure>
    </SectionContainer>
  );
}
