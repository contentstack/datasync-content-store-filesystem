/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare const defaults: {
    contentStore: {
        baseDir: string;
        patterns: {
            entry: string;
            asset: string;
            contentType: string;
            entryCache: string;
            assetCache: string;
            contentTypeCache: string;
        };
        internal: {
            keys: {
                content_type_uid: string;
                assets: string;
            };
        };
        unwanted: {
            asset: {
                created_at: boolean;
                created_by: boolean;
                published_details: boolean;
                updated_at: boolean;
                updated_by: boolean;
                ACL: boolean;
            };
            entry: {
                created_at: boolean;
                created_by: boolean;
                published_details: boolean;
                updated_at: boolean;
                updated_by: boolean;
                ACL: boolean;
            };
            contentType: {
                created_at: boolean;
                inbuilt_class: boolean;
                last_activity: boolean;
                updated_at: boolean;
                ACL: boolean;
            };
        };
    };
};
