"use strict";
/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    contentStore: {
        baseDir: './_contents',
        internal: {
            keys: {
                assets: '_assets',
                content_type_uid: '_content_types',
            },
            locale: '/locales.json',
        },
        patterns: {
            asset: '/:locale/data/assets',
            contentType: '/:locale/data/content_types',
            entry: '/:locale/data/:_content_type_uid',
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
};
