import { Client } from 'datocms/lib/cma-client-node';

/*
 * DatoCMS gives a plain text field the markdown editor by default, toolbar
 * included. The image-with-text body is rendered as plain text on purpose (rich
 * prose is what the text section is for), so the toolbar would promise
 * formatting the frontend then prints verbatim. A textarea tells the truth.
 */

const IMAGE_WITH_TEXT_SECTION = 'NFIW2OfgRTex9wmLUMi2Pw';

export default async function (client: Client): Promise<void> {
  const fields = await client.fields.list(IMAGE_WITH_TEXT_SECTION);
  const body = fields.find((field) => field.api_key === 'body');

  if (!body) {
    throw new Error('The `body` field is missing on the image-with-text section.');
  }

  await client.fields.update(body.id, {
    appearance: { editor: 'textarea', addons: [], parameters: {} },
  });
}
