/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare class FilesystemStore {
    private readonly assetStore;
    private readonly config;
    private readonly pattern;
    private readonly unwanted;
    private readonly localePath;
    constructor(assetStore: any, config: any);
    publish(input: any): Promise<unknown>;
    unpublish(input: any): Promise<unknown>;
    delete(input: any): Promise<unknown>;
    updateContentType(data: any): Promise<any>;
    private publishAsset;
    private unpublishAsset;
    private unpublishEntry;
    private deleteAsset;
    private deleteContentType;
    private deleteAllEntries;
    private deleteSchema;
    private deleteEntry;
    private publishEntry;
    updateAssetReferences(data: any, schema: any): Promise<unknown>;
    updateDeletedAssetReferences(asset: any): Promise<unknown>;
    private _getAssetFieldsHelper;
    private _updateEntryAssetReference;
    private _nullifyDeletedAssetField;
}
