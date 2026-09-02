import { isSupportedLocale } from '@/lib/i18n/locales';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

/**
 * Root layout for the localized site. Every page lives under `[locale]`, so this
 * file renders `<html>`; routes outside it (the plugin screen, route handlers)
 * bring their own.
 */
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        {/*
         * The provider carries the interface wording into whatever renders in
         * the browser. Draft mode renders the page's whole subtree inside a
         * client component, so without it any section that translates anything
         * would work when published and throw in the preview.
         *
         * Rendered from a server component, so it inherits the locale and the
         * messages from `src/lib/i18n/request.ts` with nothing to pass. The
         * catalogue is the interface wording only, under a kilobyte.
         */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
