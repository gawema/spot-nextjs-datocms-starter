import { isSupportedLocale } from '@/lib/i18n/locales';
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
      <body>{children}</body>
    </html>
  );
}
