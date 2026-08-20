import { AccordionItemFragment } from '@/components/blocks/AccordionItem';
import { graphql } from '@/lib/datocms/graphql';

export const AccordionSectionFragment = graphql(
  /* GraphQL */ `
    fragment AccordionSectionFragment on AccordionSectionRecord {
      heading
      items {
        id
        ...AccordionItemFragment
      }
    }
  `,
  [AccordionItemFragment],
);
