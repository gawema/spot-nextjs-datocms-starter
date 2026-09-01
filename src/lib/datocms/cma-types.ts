import type { ItemTypeDefinition } from '@datocms/cma-client';

type EnvironmentSettings = {
  locales: 'de' | 'en';
};

export type TextSection = ItemTypeDefinition<
  EnvironmentSettings,
  'AAemZ7YeTUygT1tcKBQgMQ',
  {
    heading: {
      type: 'string';
    };
    body: {
      type: 'structured_text';
      blocks: ImageGalleryBlock | ImageBlock | VideoBlock;
    };
  }
>;
export const TextSection = {
  ID: 'AAemZ7YeTUygT1tcKBQgMQ',
  REF: { type: 'item_type', id: 'AAemZ7YeTUygT1tcKBQgMQ' },
} as const;

export type ImageGalleryBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'CoOdvsbUR8GLtGeuenXzMw',
  {
    assets: {
      type: 'gallery';
    };
  }
>;
export const ImageGalleryBlock = {
  ID: 'CoOdvsbUR8GLtGeuenXzMw',
  REF: { type: 'item_type', id: 'CoOdvsbUR8GLtGeuenXzMw' },
} as const;

export type Layout = ItemTypeDefinition<
  EnvironmentSettings,
  'DTCftzw4S4aKyD39qpXpgQ',
  {
    logo: {
      type: 'file';
    };
    navigation: {
      type: 'rich_text';
      blocks: MenuItem;
      localized: true;
    };
    footer_text: {
      type: 'text';
      localized: true;
    };
    footer_links: {
      type: 'rich_text';
      blocks: Link;
      localized: true;
    };
    social_links: {
      type: 'rich_text';
      blocks: Link;
    };
  }
>;
export const Layout = {
  ID: 'DTCftzw4S4aKyD39qpXpgQ',
  REF: { type: 'item_type', id: 'DTCftzw4S4aKyD39qpXpgQ' },
} as const;

export type AccordionSection = ItemTypeDefinition<
  EnvironmentSettings,
  'GHPlTJWYQL-RItt_mgAzYg',
  {
    heading: {
      type: 'string';
    };
    items: {
      type: 'rich_text';
      blocks: AccordionItem;
    };
  }
>;
export const AccordionSection = {
  ID: 'GHPlTJWYQL-RItt_mgAzYg',
  REF: { type: 'item_type', id: 'GHPlTJWYQL-RItt_mgAzYg' },
} as const;

export type SiteSetting = ItemTypeDefinition<
  EnvironmentSettings,
  'Io51E491RmKvwEJAbiWkaQ',
  {
    translations: {
      type: 'json';
    };
  }
>;
export const SiteSetting = {
  ID: 'Io51E491RmKvwEJAbiWkaQ',
  REF: { type: 'item_type', id: 'Io51E491RmKvwEJAbiWkaQ' },
} as const;

export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  'JdG722SGTSG_jEB1Jx-0XA',
  {
    title: {
      type: 'string';
      localized: true;
    };
    sections: {
      type: 'rich_text';
      blocks: TextSection | AccordionSection | ImageWithTextSection;
      localized: true;
    };
    slug: {
      type: 'slug';
      localized: true;
    };
    seo_settings_social: {
      type: 'seo';
    };
    seo_analysis: {
      type: 'json';
    };
  }
>;
export const Page = {
  ID: 'JdG722SGTSG_jEB1Jx-0XA',
  REF: { type: 'item_type', id: 'JdG722SGTSG_jEB1Jx-0XA' },
} as const;

export type MenuItem = ItemTypeDefinition<
  EnvironmentSettings,
  'K4xLvAO-RuSKyqg2C6KcsA',
  {
    link: {
      type: 'single_block';
      blocks: Link;
    };
    dropdown: {
      type: 'rich_text';
      blocks: Link;
    };
  }
>;
export const MenuItem = {
  ID: 'K4xLvAO-RuSKyqg2C6KcsA',
  REF: { type: 'item_type', id: 'K4xLvAO-RuSKyqg2C6KcsA' },
} as const;

export type ImageWithTextSection = ItemTypeDefinition<
  EnvironmentSettings,
  'NFIW2OfgRTex9wmLUMi2Pw',
  {
    heading: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    image: {
      type: 'file';
    };
    link: {
      type: 'single_block';
      blocks: Link;
    };
    inverted_layout: {
      type: 'boolean';
    };
  }
>;
export const ImageWithTextSection = {
  ID: 'NFIW2OfgRTex9wmLUMi2Pw',
  REF: { type: 'item_type', id: 'NFIW2OfgRTex9wmLUMi2Pw' },
} as const;

export type AccordionItem = ItemTypeDefinition<
  EnvironmentSettings,
  'b4G7LWbdQmmD4rWXstKM8w',
  {
    heading: {
      type: 'string';
    };
    body: {
      type: 'structured_text';
    };
  }
>;
export const AccordionItem = {
  ID: 'b4G7LWbdQmmD4rWXstKM8w',
  REF: { type: 'item_type', id: 'b4G7LWbdQmmD4rWXstKM8w' },
} as const;

export type SchemaMigration = ItemTypeDefinition<
  EnvironmentSettings,
  'czn4j4ABTwGwvak0mnQy1g',
  {
    name: {
      type: 'string';
    };
  }
>;
export const SchemaMigration = {
  ID: 'czn4j4ABTwGwvak0mnQy1g',
  REF: { type: 'item_type', id: 'czn4j4ABTwGwvak0mnQy1g' },
} as const;

export type ImageBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'dZOhbVOTSpeaaA-wQMgPCA',
  {
    asset: {
      type: 'file';
    };
  }
>;
export const ImageBlock = {
  ID: 'dZOhbVOTSpeaaA-wQMgPCA',
  REF: { type: 'item_type', id: 'dZOhbVOTSpeaaA-wQMgPCA' },
} as const;

export type VideoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'duRvS1PrT4u6QGJZUmyINA',
  {
    asset: {
      type: 'file';
    };
  }
>;
export const VideoBlock = {
  ID: 'duRvS1PrT4u6QGJZUmyINA',
  REF: { type: 'item_type', id: 'duRvS1PrT4u6QGJZUmyINA' },
} as const;

export type Link = ItemTypeDefinition<
  EnvironmentSettings,
  'ekip_ngUQxiVGyG8j0KIgQ',
  {
    label: {
      type: 'string';
    };
    page: {
      type: 'link';
    };
    external_url: {
      type: 'string';
    };
    open_in_new_tab: {
      type: 'boolean';
    };
  }
>;
export const Link = {
  ID: 'ekip_ngUQxiVGyG8j0KIgQ',
  REF: { type: 'item_type', id: 'ekip_ngUQxiVGyG8j0KIgQ' },
} as const;

export type AnyBlock =
  | TextSection
  | ImageGalleryBlock
  | AccordionSection
  | MenuItem
  | ImageWithTextSection
  | AccordionItem
  | ImageBlock
  | VideoBlock
  | Link;
export type AnyModel = Layout | SiteSetting | Page | SchemaMigration;
export type AnyBlockOrModel = AnyBlock | AnyModel;
