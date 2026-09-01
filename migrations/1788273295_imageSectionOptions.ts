import { Client } from 'datocms/lib/cma-client-node';

/*
 * `full_image_section` becomes `image_section`: one image block with options,
 * instead of one block per treatment. Width and aspect ratio are the two
 * choices an editor actually makes about an image, and both are enums so the
 * frontend maps them to a lane and a ratio with no free text to sanitise.
 *
 * Renaming rather than recreating keeps the existing records, their image and
 * their caption.
 */

const IMAGE_SECTION = 'Lv51zZ96QfGEd6qx_uOKVQ';

/** Radios with a hint each: the editor sees what the option does, not a code. */
function radios(values: { value: string; label: string; hint: string }[]) {
  return {
    editor: 'string_radio_group',
    addons: [],
    parameters: { radios: values },
  };
}

export default async function (client: Client): Promise<void> {
  await client.itemTypes.update(IMAGE_SECTION, {
    name: '🖼️ Image Section',
    api_key: 'image_section',
    hint: 'One image, with a width and an aspect ratio.',
  });

  const width = [
    { value: 'content', label: 'Content', hint: 'The same width as the text.' },
    { value: 'wide', label: 'Wide', hint: 'A step wider than the text.' },
    { value: 'bleed', label: 'Full bleed', hint: 'Edge to edge, no margin.' },
  ];

  await client.fields.create(IMAGE_SECTION, {
    label: 'Width',
    api_key: 'width',
    field_type: 'string',
    position: 2,
    default_value: 'content',
    validators: { required: {}, enum: { values: width.map(({ value }) => value) } },
    appearance: radios(width),
  });

  const aspectRatio = [
    { value: 'original', label: 'Original', hint: 'No cropping.' },
    { value: '21:9', label: 'Panorama', hint: 'A wide strip.' },
    { value: '16:9', label: 'Widescreen', hint: '' },
    { value: '4:3', label: 'Landscape', hint: '' },
    { value: '1:1', label: 'Square', hint: '' },
    { value: 'fullscreen', label: 'Full screen', hint: 'As tall as the viewport.' },
  ];

  await client.fields.create(IMAGE_SECTION, {
    label: 'Aspect ratio',
    api_key: 'aspect_ratio',
    field_type: 'string',
    position: 3,
    default_value: 'original',
    validators: { required: {}, enum: { values: aspectRatio.map(({ value }) => value) } },
    appearance: radios(aspectRatio),
  });
}
