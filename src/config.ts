/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

export const defaults = {
  contentStore: {
    baseDir: './_contents',
    internal: {
      keys: {
        assets: '_assets',
        content_type_uid: '_content_types',
      },
      locales: '/locales/index.json',
    },
    patterns: {
      asset: '/:locale/data/assets/index.json',
      contentType: '/:locale/data/:uid/schema.json',
      entry: '/:locale/data/:_content_type_uid/index.json',
      // entryCache: '/cache/:locale/data/:content_type_uid/index.json',
      // assetCache: '/cache/:locale/data/assets/index.json',
      // contentTypeCache: '/cache/:locale/data/:content_type_uid/schema.json',
      // variables: ['locale', 'content_type_uid',/* 'data.title', 'uid' */]
    },
    indexedKeys: {
      locale: true,
      uid: true,
      published_at: true,
      _content_type_uid: true,
      _synced_at: true,
      event_at: true
    },
    unwanted: {
      asset: {
        ACL: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,

      },
      contentType: {
        ACL: true,
        created_at: true,
        inbuilt_class: true,
        last_activity: true,
        updated_at: true,
      },
      entry: {
        ACL: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
    },
  },
};
