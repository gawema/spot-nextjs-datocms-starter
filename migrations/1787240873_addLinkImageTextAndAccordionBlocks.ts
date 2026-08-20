import { Client } from 'datocms/lib/cma-client-node';

/*
 * The first sections ported from camping-lenzerheide, rebuilt rather than
 * copied: camping's own `link` had ten fields with overlapping booleans, and
 * its sections carried project-specific extras (post-it notes, seasonal
 * images, "button always visible").
 *
 * Naming convention: a block that can sit directly in `page.sections` carries
 * the `_section` suffix, a block that only nests inside another one does not.
 * So the block library reads as sections first, building blocks second, and
 * `__typename` says which is which in the section registry.
 */

const PAGE = 'JdG722SGTSG_jEB1Jx-0XA';
const TEXT_SECTION = 'AAemZ7YeTUygT1tcKBQgMQ';

/* Prose fields share one appearance: marks everywhere, headings from h3 down. */
const proseAppearance = {
  editor: 'structured_text',
  addons: [],
  parameters: {
    marks: ['strong', 'code', 'emphasis', 'underline', 'strikethrough', 'highlight'],
    nodes: [
      'blockquote',
      'code',
      'heading',
      'link',
      'list',
      'thematicBreak',
      'inlineItem',
      'itemLink',
    ],
    heading_levels: [3, 4, 5, 6],
    blocks_start_collapsed: false,
    show_links_meta_editor: false,
    show_links_target_blank: true,
  },
};

export default async function (client: Client): Promise<void> {
  /*
   * Link. The target is either an internal page or an external URL, and the
   * label falls back to the linked page's title when left empty: that is one
   * boolean less than camping's `use title as text`. Presentation (button vs
   * plain, arrow or not) belongs to the section that renders the link, not to
   * the content.
   */
  const link = await client.itemTypes.create({
    name: '🔗 Link',
    api_key: 'link',
    modular_block: true,
    hint: 'A link to an internal page or an external URL. Nested inside sections.',
  });

  await client.fields.create(link, {
    label: 'Label',
    api_key: 'label',
    field_type: 'string',
    hint: 'Leave empty to use the linked page title.',
    validators: {},
  });

  await client.fields.create(link, {
    label: 'Page',
    api_key: 'page',
    field_type: 'link',
    validators: { item_item_type: { item_types: [PAGE] } },
  });

  await client.fields.create(link, {
    label: 'External URL',
    api_key: 'external_url',
    field_type: 'string',
    hint: 'Used only when no page is picked.',
    validators: {},
  });

  await client.fields.create(link, {
    label: 'Open in a new tab',
    api_key: 'open_in_new_tab',
    field_type: 'boolean',
    validators: {},
  });

  /* Accordion item: only ever nested in an accordion section. */
  const accordionItem = await client.itemTypes.create({
    name: '🪗 Accordion item',
    api_key: 'accordion_item',
    modular_block: true,
    hint: 'One row of an accordion section.',
  });

  await client.fields.create(accordionItem, {
    label: 'Heading',
    api_key: 'heading',
    field_type: 'string',
    hint: 'The clickable row label.',
    validators: { required: {} },
  });

  await client.fields.create(accordionItem, {
    label: 'Body',
    api_key: 'body',
    field_type: 'structured_text',
    validators: {
      required: {},
      structured_text_blocks: { item_types: [] },
      structured_text_links: {
        item_types: [PAGE],
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
      },
      structured_text_inline_blocks: { item_types: [] },
    },
    appearance: proseAppearance,
  });

  const accordionSection = await client.itemTypes.create({
    name: '🪗 Accordion Section',
    api_key: 'accordion_section',
    modular_block: true,
    hint: 'A list of expandable rows.',
  });

  await client.fields.create(accordionSection, {
    label: 'Heading',
    api_key: 'heading',
    field_type: 'string',
    validators: {},
  });

  await client.fields.create(accordionSection, {
    label: 'Items',
    api_key: 'items',
    field_type: 'rich_text',
    validators: {
      rich_text_blocks: { item_types: [accordionItem.id] },
      size: { min: 1 },
    },
  });

  /*
   * Image with text: the workhorse section. `body` is a plain textarea on
   * purpose, rich prose is what the text section is for.
   */
  const imageWithText = await client.itemTypes.create({
    name: '🖼️ Image with Text Section',
    api_key: 'image_with_text_section',
    modular_block: true,
    hint: 'An image beside a heading, a short text and an optional link.',
  });

  await client.fields.create(imageWithText, {
    label: 'Heading',
    api_key: 'heading',
    field_type: 'string',
    validators: {},
  });

  await client.fields.create(imageWithText, {
    label: 'Body',
    api_key: 'body',
    field_type: 'text',
    validators: {},
  });

  await client.fields.create(imageWithText, {
    label: 'Image',
    api_key: 'image',
    field_type: 'file',
    validators: { required: {} },
  });

  await client.fields.create(imageWithText, {
    label: 'Link',
    api_key: 'link',
    field_type: 'single_block',
    validators: { single_block_blocks: { item_types: [link.id] } },
    appearance: {
      editor: 'framed_single_block',
      addons: [],
      parameters: { start_collapsed: false },
    },
  });

  await client.fields.create(imageWithText, {
    label: 'Inverted layout',
    api_key: 'inverted_layout',
    field_type: 'boolean',
    hint: 'Places the image on the left and the text on the right.',
    validators: {},
  });

  /* Finally, let the three section blocks into the page. */
  const fields = await client.fields.list(PAGE);
  const sections = fields.find((field) => field.api_key === 'sections');

  if (!sections) {
    throw new Error('The `sections` field is missing on the page model.');
  }

  await client.fields.update(sections.id, {
    validators: {
      rich_text_blocks: {
        item_types: [TEXT_SECTION, imageWithText.id, accordionSection.id],
      },
    },
  });
}
