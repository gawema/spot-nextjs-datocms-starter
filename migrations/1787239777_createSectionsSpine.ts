import { Client } from 'datocms/lib/cma-client-node';

/*
 * The page/sections spine: one modular content field on `page`, plus the
 * example section block.
 *
 * `sections` is localized, so every language composes its own page, and the
 * section blocks themselves stay free of localized fields. Deliberately a plain
 * modular field on the model, with no single-block wrapper around it: the
 * wrapper buys nothing and forces every consumer through one more level of
 * nesting.
 */

const PAGE = 'JdG722SGTSG_jEB1Jx-0XA';
const IMAGE_GALLERY_BLOCK = 'CoOdvsbUR8GLtGeuenXzMw';
const IMAGE_BLOCK = 'dZOhbVOTSpeaaA-wQMgPCA';
const VIDEO_BLOCK = 'duRvS1PrT4u6QGJZUmyINA';

export default async function (client: Client): Promise<void> {
  const textSection = await client.itemTypes.create({
    name: '📄 Text Section',
    api_key: 'text_section',
    modular_block: true,
    hint: 'A heading plus a body of structured text. The example section of the starter.',
  });

  await client.fields.create(textSection, {
    label: 'Heading',
    api_key: 'heading',
    field_type: 'string',
    validators: {},
  });

  await client.fields.create(textSection, {
    label: 'Body',
    api_key: 'body',
    field_type: 'structured_text',
    validators: {
      required: {},
      structured_text_blocks: {
        item_types: [IMAGE_GALLERY_BLOCK, IMAGE_BLOCK, VIDEO_BLOCK],
      },
      structured_text_links: {
        item_types: [PAGE],
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
      },
      structured_text_inline_blocks: { item_types: [] },
    },
    appearance: {
      editor: 'structured_text',
      addons: [],
      parameters: {
        marks: ['strong', 'code', 'emphasis', 'underline', 'strikethrough', 'highlight'],
        // No h1: the page title owns it.
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
        heading_levels: [2, 3, 4, 5, 6],
        blocks_start_collapsed: false,
        show_links_meta_editor: false,
        show_links_target_blank: true,
      },
    },
  });

  await client.fields.create(PAGE, {
    label: 'Sections',
    api_key: 'sections',
    field_type: 'rich_text',
    localized: true,
    position: 3,
    hint: 'The page content, one section after the other.',
    validators: { rich_text_blocks: { item_types: [textSection.id] } },
  });
}
