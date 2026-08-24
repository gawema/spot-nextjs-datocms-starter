import ImageBlock from '@/components/blocks/ImageBlock';
import SectionContainer from '@/components/layout/SectionContainer';
import ImageGalleryBlock from '@/components/blocks/ImageGalleryBlock';
import { Text } from '@/components/cms/Text';
import PageInline from '@/components/cms/inlineRecords/PageInline';
import PageLink from '@/components/cms/linkToRecords/PageLink';
import { TextSectionFragment } from '@/components/sections/TextSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';
import dynamic from 'next/dynamic';

import './index.css';

/*
 * Deferred out of the initial bundle: the video player is heavy and most pages
 * never embed one.
 */
const VideoBlock = dynamic(() => import('@/components/blocks/VideoBlock'));

type Props = {
  data: FragmentOf<typeof TextSectionFragment>;
  locale: SiteLocale;
};

/** Prose, with the image, gallery and video blocks the body allows. */
export default function TextSection({ data, locale }: Props) {
  const { heading, body } = readFragment(TextSectionFragment, data);

  return (
    <SectionContainer className="padding-vertical-main">
      {heading ? <h2 className="text-section__heading">{heading}</h2> : null}
      <Text
        data={body}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ImageBlockRecord':
              return <ImageBlock data={record} />;
            case 'ImageGalleryBlockRecord':
              return <ImageGalleryBlock data={record} />;
            case 'VideoBlockRecord':
              return <VideoBlock data={record} />;
            default:
              return null;
          }
        }}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case 'PageRecord':
              return <PageInline record={record} locale={locale} />;
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ transformedMeta, record, children }) => {
          switch (record.__typename) {
            case 'PageRecord':
              return (
                <PageLink record={record} transformedMeta={transformedMeta} locale={locale}>
                  {children}
                </PageLink>
              );
            default:
              return null;
          }
        }}
      />
    </SectionContainer>
  );
}
