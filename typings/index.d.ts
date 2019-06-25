/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
interface IConfig {
    contentStore: any;
    [propName: string]: any;
}
export declare const getConfig: () => IConfig;
export declare const setConfig: (config: IConfig) => void;
/**
 * @description Establish connection to FS db
 * @param {Object} assetConnector Asset store instance
 * @param {Object} configs App config
 */
export declare function start(assetStore: any, configs?: any): Promise<any>;
/**
 * @description to get connector instance
 */
export declare function getConnector(): any;
export {};
