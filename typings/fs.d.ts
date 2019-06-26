/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare class FilesystemStore {
    private readonly assetStore;
    private config;
    private pattern;
    private unwanted;
    private readonly localePath;
    constructor(assetStore: any, config: any);
    publish(input: any): Promise<unknown>;
    unpublish(input: any): Promise<unknown>;
    delete(input: any): Promise<unknown>;
    private publishEntry;
    private publishAsset;
    private unpublishAsset;
    private unpublishEntry;
    private deleteAsset;
    private deleteContentType;
    private deleteAllEntries;
    private deleteSchema;
    private deleteEntry;
}
