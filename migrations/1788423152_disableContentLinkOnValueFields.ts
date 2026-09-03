import { Client } from 'datocms/lib/cma-client-node';

/*
 * Content Link stops encoding the string fields the frontend reads as a value.
 *
 * In draft mode the CDA appends some 700 invisible characters to every string,
 * which is exactly what makes click-to-edit work on text that reaches the page.
 * A string that is consumed instead of shown breaks: `external_url` becomes an
 * href `new URL()` cannot parse, `cid` and `gtm` reach the consent tool as
 * dirty ids, and the enum-like fields stop matching the comparisons and the CSS
 * selectors that read them, so the preview quietly renders a different layout
 * than the published page. Nothing fails loudly, which is the worst part.
 *
 * The flag exists on string, text and structured_text fields only. Slugs are
 * their own field type and were never encoded, which is why internal links
 * survive a preview and external ones do not.
 */

const VALUE_FIELDS: { itemType: string; field: string }[] = [
  // Into an href, and into `sameAs` in the JSON-LD.
  { itemType: 'link', field: 'external_url' },
  // Into the data attributes the consent tool's script reads.
  { itemType: 'site_setting', field: 'cid' },
  { itemType: 'site_setting', field: 'gtm' },
  // Compared against literals to pick a lane and an aspect ratio.
  { itemType: 'image_section', field: 'width' },
  { itemType: 'image_section', field: 'aspect_ratio' },
  // Into the data attributes the header CSS selects on.
  { itemType: 'layout', field: 'navigation_style' },
  { itemType: 'layout', field: 'panel_position' },
  { itemType: 'layout', field: 'panel_orientation' },
];

export default async function (client: Client): Promise<void> {
  for (const { itemType, field: apiKey } of VALUE_FIELDS) {
    const fields = await client.fields.list(itemType);
    const field = fields.find((candidate) => candidate.api_key === apiKey);

    if (!field) {
      throw new Error(`${itemType} has no field ${apiKey}`);
    }

    await client.fields.update(field.id, { content_link_enabled: false });
  }
}
