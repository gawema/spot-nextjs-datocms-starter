import AccordionItem from '@/components/blocks/AccordionItem';
import SectionContainer from '@/components/layout/SectionContainer';
import { AccordionSectionFragment } from '@/components/sections/AccordionSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

import './index.css';

type Props = {
  data: FragmentOf<typeof AccordionSectionFragment>;
  locale: SiteLocale;
};

/** A section whose content is a list of child blocks, one per row. */
export default function AccordionSection({ data, locale }: Props) {
  const { heading, items } = readFragment(AccordionSectionFragment, data);

  return (
    <SectionContainer className="padding-vertical-main">
      {heading ? <h2 className="accordion-section__heading">{heading}</h2> : null}
      <div className="accordion-section__items">
        {items.map((item) => (
          <AccordionItem key={item.id} data={item} locale={locale} />
        ))}
      </div>
    </SectionContainer>
  );
}
