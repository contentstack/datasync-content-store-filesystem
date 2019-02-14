/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { merge } from 'lodash';
import { defaultConfig } from './default';
import fileSystem from './filesystem';
import { logger as log, setLogger } from './util/logger';

let connector;
const debug = Debug('content-sotre-filesystem');

/**
 * @description to start the content connector
 * @param  {} assetConnector: asset connector instance
 * @param  {} config?: config
 * @param  {} logger?: logger instance
 */
export function start(assetConnector, config?, customLogger?) {
  if (customLogger) {
    setLogger(customLogger);
  }
  return new Promise((resolve, reject) => {
    try {
      config = (config)? merge(defaultConfig, config) : defaultConfig
      connector = new fileSystem(assetConnector, config);
      resolve(connector);
    }
    catch (error) {
      debug('Failed to load content-store due to', error);
      reject(error);
    }
  });
}
/**
 * @description to get connector instance
 */
export function getConnectorInstance() {
  return connector;
}

export { setLogger };
