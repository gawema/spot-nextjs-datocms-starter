import Link from '@/components/blocks/Link';
import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { ImageWithTextSectionFragment } from '@/components/sections/ImageWithTextSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

import './index.css';

type Props = {
  data: FragmentOf<typeof ImageWithTextSectionFragment>;
  locale: SiteLocale;
};

/**
 * An image beside a short text. `body` is plain text: rich prose belongs to the
 * text section, and keeping this one plain saves the template a markdown
 * renderer.
 */
export default function ImageWithTextSection({ data, locale }: Props) {
  const { heading, body, invertedLayout, image, link } = readFragment(
    ImageWithTextSectionFragment,
    data,
  );

  return (
    <SectionContainer className="padding-vertical-main">
      <div
        className="image-with-text"
        data-inverted={invertedLayout ? '' : undefined}
        data-datocms-content-link-group
      >
        {image.responsiveImage ? (
          <figure className="image-with-text__media">
            <ResponsiveImage data={image.responsiveImage} />
          </figure>
        ) : null}
        <div className="image-with-text__copy">
          {heading ? <h2>{heading}</h2> : null}
          {body ? <p>{body}</p> : null}
          {link ? <Link data={link} locale={locale} /> : null}
        </div>
      </div>
    </SectionContainer>
  );
}
