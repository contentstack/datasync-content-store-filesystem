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
