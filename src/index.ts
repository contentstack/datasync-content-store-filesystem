/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { debug as Debug } from "debug";
import Filesystem from './filesystem'
import { merge } from "lodash";
import {setLogger, logger as log} from "./logger";
import {defaultConfig} from './default'
let connector = null
let config =  defaultConfig
const debug = Debug("content-sotre-filesystem");
/**
 * @description to start the content connector
 * @param  {any} userConfig: configs
 * @param  {any} assetConnector: asset connector instance
 */
export function start (userConfig: any, assetConnector: any) {
  
  try {
    return new Promise((resolve, reject) => {
      if (userConfig) {
        config = merge(config, userConfig)
      } else {
        debug("Starting connector with default configs");
        log.info("Starting connector with default configs");
      }
      connector = new Filesystem(config, assetConnector)
      setLogger()
      resolve(connector)
    })
  } catch (error) {
    debug('Failed to load content-store due to %O',error);
    log.error('Failed to load content-store',error);
  }
}
/**
 * @description to get connector instance
 */
export function getConnectorInstance () {
	return connector
}