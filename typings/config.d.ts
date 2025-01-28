/*!
* DataSync Content Store Filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare const config: {
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
        patternsWithBranch: {
            asset: string;
            contentType: string;
            entry: string;
        };
        unwanted: {
            asset: {
                ACL: boolean;
                created_by: boolean;
                updated_by: boolean;
            };
            contentType: {
                ACL: boolean;
                DEFAULT_ACL: boolean;
                SYS_ACL: boolean;
                inbuilt_class: boolean;
                last_activity: boolean;
            };
            entry: {
                ACL: boolean;
                created_by: boolean;
                updated_by: boolean;
            };
        };
        preserveAssetInReferencedEntries: boolean;
    };
};
