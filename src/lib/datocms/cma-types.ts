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

export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  'JdG722SGTSG_jEB1Jx-0XA',
  {
    title: {
      type: 'string';
      localized: true;
    };
    structured_text: {
      type: 'structured_text';
      blocks: ImageGalleryBlock | ImageBlock | VideoBlock;
    };
    sections: {
      type: 'rich_text';
      blocks: TextSection;
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

export type AnyBlock = TextSection | ImageGalleryBlock | ImageBlock | VideoBlock;
export type AnyModel = Page | SchemaMigration;
export type AnyBlockOrModel = AnyBlock | AnyModel;
