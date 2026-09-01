/**
 * Renders a schema.org graph. `<` is escaped so a stray angle bracket in the
 * content cannot close the script tag early and turn data into markup.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
