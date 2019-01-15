/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from "debug";
import Filesystem from './filesystem'
import { merge } from "lodash";
import { setLogger , logger as log } from "./logger";
import { defaultConfig } from './default'
let connector = null
const debug = Debug("content-sotre-filesystem");

/**
 * @description to start the content connector
 * @param  {} assetConnector: asset connector instance
 * @param  {} config?: config
 * @param  {} logger?: logger instance
 */
export function start(assetConnector, config?, logger?) {


  return new Promise((resolve, reject) => {
    try {
      if (config) {
        console.log(defaultConfig,"dafaultconf", config,"configgggggggggggggg")
        config = merge(defaultConfig,config)
        console.log(config,"config++++++++++")
      } else {
        debug("Starting connector with default configs");
        log.info("Starting connector with default configs");
      }
      setLogger(logger)
      connector = new Filesystem(assetConnector, config)
      resolve(connector)
    }
    catch (error) {
      debug('Failed to load content-store due to', error);
      log.error('Failed to load content-store', error);
      reject(error)
    }
  })
}
/**
 * @description to get connector instance
 */
export function getConnectorInstance() {
  return connector
}
/**
 * @description Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export const setCustomLogger = (logger?) => {
  setLogger(logger)
}
