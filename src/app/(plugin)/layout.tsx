/**
 * Second root layout, for the DatoCMS plugin screen. It is rendered inside an
 * iframe in the CMS and has no locale, so it stays outside `[locale]`.
 */
export default function PluginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
