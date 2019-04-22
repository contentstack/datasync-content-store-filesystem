"use strict";
/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = {
    contentStore: {
        baseDir: './_contents',
        patterns: {
            entry: '/:locale/data/:content_type_uid/index.json',
            asset: '/:locale/data/assets/index.json',
            contentType: '/:locale/data/:content_type_uid/schema.json',
            entryCache: '/cache/:locale/data/:content_type_uid/index.json',
            assetCache: '/cache/:locale/data/assets/index.json',
            contentTypeCache: '/cache/:locale/data/:content_type_uid/schema.json',
        },
        unwanted: {
            asset: {
                created_at: true,
                created_by: true,
                published_details: true,
                updated_at: true,
                updated_by: true,
                ACL: true,
            },
            entry: {
                created_at: true,
                created_by: true,
                published_details: true,
                updated_at: true,
                updated_by: true,
                ACL: true,
            },
            contentType: {
                created_at: true,
                inbuilt_class: true,
                last_activity: true,
                updated_at: true,
                ACL: true,
            },
        },
    },
};
