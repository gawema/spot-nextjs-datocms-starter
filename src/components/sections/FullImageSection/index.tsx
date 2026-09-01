import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { FullImageSectionFragment } from '@/components/sections/FullImageSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

import './index.css';

type Props = {
  data: FragmentOf<typeof FullImageSectionFragment>;
};

/** One image across the full width, cropped wide, to let a page breathe. */
export default function FullImageSection({ data }: Props) {
  const { image, caption } = readFragment(FullImageSectionFragment, data);

  return (
    <SectionContainer bleed className="padding-vertical-main">
      <figure className="full-image" data-datocms-content-link-group>
        {image.responsiveImage ? <ResponsiveImage data={image.responsiveImage} /> : null}
        {caption ? <figcaption className="full-image__caption">{caption}</figcaption> : null}
      </figure>
    </SectionContainer>
  );
}
