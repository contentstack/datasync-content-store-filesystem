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
 * @param  {object} configs App config
 */
export function start(assetStore, configs ?) {
  config = merge(defaults, configs);
  connector = new FilesystemStore(assetStore, config);
  return Promise.resolve(connector);
}

/**
 * @description to get connector instance
 */
export function getConnectorInstance() {
  return connector;
}

export function getConfig() {

  return config
}