/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { merge } from 'lodash'
import { defaults } from './config'
import { FilesystemStore } from './fs'
import { dbSetup } from './util/index'

interface IConfig {
  contentStore: any
  [propName: string]: any
}

let appConfig
let connector

export const getConfig = (): IConfig => {
  return appConfig
}

export const setConfig = (config: IConfig) => {
  appConfig = config
}

/**
 * @description Establish connection to FS db
 * @param {Object} assetConnector Asset store instance
 * @param {Object} configs App config
 */
export function start(assetStore, configs ?) {
  appConfig = merge(defaults, appConfig, configs)
  dbSetup(appConfig.contentStore)
  connector = new FilesystemStore(assetStore, appConfig)
  return Promise.resolve(connector)
}

/**
 * @description to get connector instance
 */
export function getConnector() {
  return connector
}
