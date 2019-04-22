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
    private publishEntry;
    private publishAsset;
    unpublish(input: any): Promise<{}>;
    delete(input: any): Promise<{}>;
}
