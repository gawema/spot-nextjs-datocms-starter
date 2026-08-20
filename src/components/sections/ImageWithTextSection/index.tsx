import Link from '@/components/blocks/Link';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { ImageWithTextSectionFragment } from '@/components/sections/ImageWithTextSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

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
    <section data-inverted={invertedLayout ? '' : undefined} data-datocms-content-link-group>
      {image.responsiveImage ? <ResponsiveImage data={image.responsiveImage} /> : null}
      <div>
        {heading ? <h2>{heading}</h2> : null}
        {body ? <p>{body}</p> : null}
        {link ? <Link data={link} locale={locale} /> : null}
      </div>
    </section>
  );
}
