/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare class FilesystemStore {
    private assetStore;
    private config;
    private pattern;
    private unwanted;
    constructor(assetStore: any, config: any);
    publish(input: any): Promise<{}>;
    unpublish(input: any): Promise<{}>;
    delete(input: any): Promise<{}>;
    private publishEntry;
    private publishAsset;
    private unpublishAsset;
    private unpublishEntry;
    private deleteAsset;
    private deleteContentType;
    private deleteEntry;
}
