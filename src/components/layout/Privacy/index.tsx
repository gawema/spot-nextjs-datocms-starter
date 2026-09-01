import { PrivacyFragment } from '@/components/layout/Privacy/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import Script from 'next/script';

/*
 * SPOT's consent tool. It draws the cookie banner, fills `#infotext` with the
 * privacy statement, and starts Google Tag Manager itself once the visitor has
 * accepted, which is why there is no separate GTM snippet anywhere.
 *
 * Both ids come from the CMS, so a project is wired up without a deploy. No
 * client id means no script: a site that has not been registered in
 * legal.spotagency.ch stays clean rather than loading a broken banner.
 */

type Props = {
  data: FragmentOf<typeof PrivacyFragment> | null;
};

export default function Privacy({ data }: Props) {
  const settings = data ? readFragment(PrivacyFragment, data) : null;

  if (!settings?.cid) {
    return null;
  }

  return (
    <>
      {/* The tool renders the privacy statement into this element. */}
      <div id="infotext" />
      <div id="kekschecker" data-cid={settings.cid} data-key={settings.gtm ?? ''} hidden />
      <Script src="https://legal.spotagency.ch/datenschutz/v2/kekschecker.js" async />
    </>
  );
}
