/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
import { FilesystemStore } from './fs';
declare let config: any;
export { config };
/**
 * @description Establish connection to FS db
 * @param  {object} assetConnector Asset store instance
 * @param  {object} config App config
 */
export declare function start(assetStore: any, config?: any): Promise<FilesystemStore>;
