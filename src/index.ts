/*!
* Contentstack Filesystem Content Store
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { merge } from 'lodash'
import { config as internalConfig } from './config'
import { FilesystemStore } from './fs'

import {
  validateAssetConnectorInstance,
  validateConfig,
} from './util/validations'

let appConfig: any = {}
let assetConnectorInstance: IAssetConnector
let fsClient: any

interface IConnector {
  publish<T>(input: T): Promise<{T: any}>,
  unpublish<T>(input: T): Promise<{T: any}>,
  delete<T>(input: T): Promise<{T: any}>,
}

interface IAssetConnector {
  start(): IConnector,
}

interface IFilesystemConfig {
  baseDir: string,
  internal?: any,
  // defaults to .json paths
  // file path patterns
  patterns?: {
    asset?: string,
    contentType?: string,
    entry?: string,
  },
  unwanted?: {
    asset?: any
    contentType?: any,
    entry?: any,
  },
  [propName: string]: any
}

interface IConfig {
  contentStore: IFilesystemConfig,
  assetStore: any, // We do not know what config asset store needs/would have
}

/**
 * @summary Set asset connector instance, that has all the basic methods expected for an asset connector
 * @param {Class | Object} instance - Asset connector instance
 */
export const setAssetConnector = (instance: IAssetConnector) => {
  assetConnectorInstance = instance
}

/**
 * @summary Set app config
 * @param {Object} config - Application config
 */
export const setConfig = (config: IConfig) => {
  appConfig = config
}

/**
 * @summary Get app config
 * @returns an instance of app config
 */
export const getConfig = (): IConfig => {

  return appConfig
}

/**
 * @summary Mongo client instance
 * @returns Mongodb connection instance
 */
export const getFilesystemClient = () => {
  return fsClient
}

/**
 * @summary
 * Entry point of the app
 * @description
 * Sets asset connectors, validates them and starts the app
 * @param {Class | Object} connector - Asset connector instance
 * @param {Object} config - Set application config
 */
export const start = (connector: IAssetConnector, config?: IConfig) => {

  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(internalConfig, appConfig, config)
      validateConfig(appConfig)
      assetConnectorInstance = connector || assetConnectorInstance
      validateAssetConnectorInstance(assetConnectorInstance)
      fsClient = new FilesystemStore(assetConnectorInstance, appConfig)

      return resolve(fsClient)
    } catch (error) {
      return reject(error)
    }
  })
}