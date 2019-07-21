/*!
* Contentstack Filesystem Content Store
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
interface IConnector {
    publish<T>(input: T): Promise<{
        T: any;
    }>;
    unpublish<T>(input: T): Promise<{
        T: any;
    }>;
    delete<T>(input: T): Promise<{
        T: any;
    }>;
}
interface IAssetConnector {
    start(): IConnector;
}
interface IFilesystemConfig {
    baseDir: string;
    internal?: any;
    patterns?: {
        asset?: string;
        contentType?: string;
        entry?: string;
    };
    unwanted?: {
        asset?: any;
        contentType?: any;
        entry?: any;
    };
    [propName: string]: any;
}
interface IConfig {
    contentStore: IFilesystemConfig;
    assetStore: any;
}
export declare const setAssetConnector: (instance: IAssetConnector) => void;
export declare const setConfig: (config: IConfig) => void;
export declare const getConfig: () => IConfig;
export declare const getFilesystemClient: () => any;
export declare const start: (connector: IAssetConnector, config?: IConfig) => Promise<unknown>;
export {};
