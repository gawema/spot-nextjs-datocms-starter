import Link from '@/components/blocks/Link';
import SectionContainer from '@/components/layout/SectionContainer';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

import './index.css';

type Props = {
  data: FragmentOf<typeof HeroSectionFragment>;
  locale: SiteLocale;
};

/**
 * The opening of a page: the image fills the width, the words sit on top of it.
 *
 * The heading is an `h2` like every other section, because the page title is
 * already the `h1`. A project that wants the hero to *be* the title changes it
 * here and stops rendering the title above the sections.
 */
export default function HeroSection({ data, locale }: Props) {
  const { heading, body, image, link } = readFragment(HeroSectionFragment, data);

  return (
    <SectionContainer bleed>
      <div className="hero" data-datocms-content-link-group>
        {image.responsiveImage ? (
          /*
           * The sizing goes through `pictureStyle` and `imgStyle` rather than a
           * class: react-datocms writes its own inline styles on both elements,
           * and inline is the only thing that wins against inline.
           *
           * `priority` because a hero is the largest paint on the page.
           */
          <ResponsiveImage
            data={image.responsiveImage}
            priority
            sizes="100vw"
            pictureStyle={{ position: 'absolute', inset: 0 }}
            imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}

        <div className="hero__copy">
          <h2 className="hero__heading">{heading}</h2>
          {body ? <p className="hero__body">{body}</p> : null}
          {link ? <Link data={link} locale={locale} className="hero__link" /> : null}
        </div>
      </div>
    </SectionContainer>
  );
}
