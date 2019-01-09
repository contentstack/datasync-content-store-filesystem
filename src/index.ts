/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { debug as Debug } from "debug";
import Filesystem from './core/filesystem'
import { merge } from "lodash";
import LoggerBuilder from "./logger";

let log
let connector = null
let config: any = {}
const debug = Debug("content-sotre-filesystem");
export function start (userConfig: any, assetConnector: any, customLogger? :any ) {
  log = new LoggerBuilder(customLogger).Logger
  try {
    return new Promise((resolve, reject) => {
      if (userConfig) {
        config = merge(config, userConfig)
      } else {
        debug("Starting connector with default configs");
        log.info("Starting connector with default configs");
      }
      connector = new Filesystem(config, assetConnector)
      resolve(connector)
    })
  } catch (error) {
    debug('Failed to load content-store due to %O',error);
    log.error('Failed to load content-store',error);
  }
}

export function getConnectorInstance () {
	return connector
}