import Sections from '@/components/cms/Sections';
import SectionContainer from '@/components/layout/SectionContainer';
import type { ResultOf } from '@/lib/datocms/graphql';
import { toSiteLocale } from '@/lib/i18n/params';
import type { ContentComponentType } from '@/lib/datocms/realtime/generatePageComponent';
import type { PageQuery } from '@/lib/query/pageQuery';
import { notFound } from 'next/navigation';
import { use } from 'react';

/*
 * What the route actually renders, given the result of the query.
 *
 * It has to stay synchronous: in draft mode this same component is rendered
 * inside the realtime *client* component, and an async component cannot run on
 * the client. `use()` unwraps the params promise on either side of that
 * boundary, which is why the locale is read this way and not awaited.
 */

export type PageProps = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

const Content: ContentComponentType<PageProps, ResultOf<typeof PageQuery>> = ({ data, params }) => {
  const { locale } = use(params);

  if (!data.page) {
    notFound();
  }

  return (
    <>
      <SectionContainer className="padding-vertical-large">
        <h1>{data.page.title}</h1>
      </SectionContainer>
      <Sections data={data.page.sections} locale={toSiteLocale(locale)} />
    </>
  );
};

export default Content;
