/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { merge } from 'lodash';
import { defaults } from './config';
import { FilesystemStore } from './fs';

let config;
let connector;

// export app config
export { config };

/**
 * @description Establish connection to FS db
 * @param  {object} assetConnector Asset store instance
 * @param  {object} config App config
 */
export function start(assetStore, config ?) {
  config = merge(defaults, config);
  connector = new FilesystemStore(assetStore, config);
  return Promise.resolve(connector);
}

/**
 * @description to get connector instance
 */
export function getConnectorInstance() {
  return connector;
}
