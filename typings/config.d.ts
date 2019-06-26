/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare const defaults: {
    contentStore: {
        baseDir: string;
        internal: {
            keys: {
                assets: string;
                content_type_uid: string;
            };
            locale: string;
        };
        patterns: {
            asset: string;
            contentType: string;
            entry: string;
        };
        unwanted: {
            asset: {
                ACL: boolean;
                created_at: boolean;
                created_by: boolean;
                updated_at: boolean;
                updated_by: boolean;
            };
            contentType: {
                ACL: boolean;
                created_at: boolean;
                inbuilt_class: boolean;
                last_activity: boolean;
                updated_at: boolean;
            };
            entry: {
                ACL: boolean;
                created_at: boolean;
                created_by: boolean;
                updated_at: boolean;
                updated_by: boolean;
            };
        };
    };
};
