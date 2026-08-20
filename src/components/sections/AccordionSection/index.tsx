import AccordionItem from '@/components/blocks/AccordionItem';
import { AccordionSectionFragment } from '@/components/sections/AccordionSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';

type Props = {
  data: FragmentOf<typeof AccordionSectionFragment>;
  locale: SiteLocale;
};

/** A section whose content is a list of child blocks, one per row. */
export default function AccordionSection({ data, locale }: Props) {
  const { heading, items } = readFragment(AccordionSectionFragment, data);

  return (
    <section>
      {heading ? <h2>{heading}</h2> : null}
      {items.map((item) => (
        <AccordionItem key={item.id} data={item} locale={locale} />
      ))}
    </section>
  );
}
