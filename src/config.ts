/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

export const config = {
  contentStore: {
    baseDir: './_contents',
    internal: {
      keys: {
        assets: '_assets',
        content_type_uid: '_content_types',
      },
      // let's not allow this to be configurable, at least not now..
      locale: '/locales.json',
    },
    // defaults to .json paths
    patterns: {
      asset: ':branch/:locale/data/assets',
      contentType: ':branch/:locale/data/content_types',
      entry: ':branch/:locale/data/:_content_type_uid',
    },
    unwanted: {
      asset: {
        ACL: true,
        created_by: true,
        updated_by: true,
      },
      contentType: {
        ACL: true,
        DEFAULT_ACL: true,
        SYS_ACL: true,
        inbuilt_class: true,
        last_activity: true,
      },
      entry: {
        ACL: true,
        created_by: true,
        updated_by: true,
      },
    },
  },
}
