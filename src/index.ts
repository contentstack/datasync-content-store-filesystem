// import { existsSync } from 'fs'
// import { join } from 'path'
// import { get } from '../config'
// import { render } from '../util'
// import { messages as msg } from '../util/messages'
import Filesystem from './core/filesystem'
import { merge } from "lodash";

/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
let connector = null
let config: any = {}
export function start (userConfig, assetConnector) {
  try {
    return new Promise((resolve, reject) => {
      if (userConfig) {
        //console.log("userconfig");
        config = merge(config, userConfig)
      } else {
        console.log("Starting connector with default configs");
      }
      //build(config)
      connector = new Filesystem(config, assetConnector)
      resolve(connector)
    })
  } catch (error) {
    console.error(error)

  }
}

export function getConnectorInstance () {
	return connector
}