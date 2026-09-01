import { Client } from 'datocms/lib/cma-client-node';

/*
 * Alt text becomes mandatory on every image an editor picks.
 *
 * DatoCMS asks for it but does not insist, so a gallery can be published with
 * nothing for a screen reader and nothing for an image search. The validator is
 * additive on this project because all the sample images already carry alt
 * text; on a project with existing content, expect records to go invalid until
 * someone fills them in.
 *
 * The logo is deliberately left out: the header falls back to the site name,
 * which is the accessible name a logo should have anyway.
 */

const IMAGE_FIELDS: { itemType: string; field: string }[] = [
  { itemType: 'hero_section', field: 'image' },
  { itemType: 'image_section', field: 'image' },
  { itemType: 'image_with_text_section', field: 'image' },
  { itemType: 'image_grid_section', field: 'images' },
  { itemType: 'slider_section', field: 'images' },
];

export default async function (client: Client): Promise<void> {
  for (const { itemType, field: apiKey } of IMAGE_FIELDS) {
    const fields = await client.fields.list(itemType);
    const field = fields.find((candidate) => candidate.api_key === apiKey);

    if (!field) {
      throw new Error(`${itemType} has no field ${apiKey}`);
    }

    // Validators are replaced wholesale, so the existing ones are carried over.
    await client.fields.update(field.id, {
      validators: { ...field.validators, required_alt_title: { alt: true, title: false } },
    });
  }
}
