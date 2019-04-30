/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { debug as Debug } from 'debug'
import fs, { mkdir, write } from 'fs'
import { cloneDeep, compact } from 'lodash'
import mkdirp from 'mkdirp'
import { join } from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'
import writeFileAtomic from 'write-file-atomic'
import { getPathKeys, removeUnwantedKeys } from './util/index'
import { validatePublishedObject } from './util/validations'

const readFile: any = promisify(fs.readFile)
const writeFile: any = promisify(writeFileAtomic)
const debug = Debug('content-store-filesystem')

export class FilesystemStore {
  private assetStore: any
  private config: any
  private pattern: any
  private unwanted: any

  constructor(assetStore, config) {
    this.assetStore = assetStore
    this.config = config.contentStore
    const baseDirKeys = []

    // unwanted keys
    this.unwanted = this.config.unwanted

    // path keys for entry, assets & content types
    this.pattern.contentTypeKeys = baseDirKeys.concat(compact(this.config.patterns.contentType.split('/')))
    this.pattern.entryKeys = baseDirKeys.concat(compact(this.config.patterns.entry.split('/')))
    this.pattern.assetKeys = baseDirKeys.concat(compact(this.config.patterns.asset.split('/')))
  }

  public publish(input) {
    return new Promise((resolve, reject) => {
      try {
        validatePublishedObject(input)

        if (input.content_type_uid === '_assets') {
          return this.publishAsset(input)
            .then(resolve)
            .catch(reject)
        }

        return this.publishEntry(input)
          .then(resolve)
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private publishEntry(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const publishedEntry = cloneDeep(data)
        const entry = {
          content_type_uid: publishedEntry.content_type_uid,
          data: publishedEntry.data,
          locale: publishedEntry.locale,
          uid: publishedEntry.uid
        }

        const contentType = {
          content_type_uid: '_content_types',
          data: publishedEntry.content_type,
          locale: publishedEntry.locale,
          uid: publishedEntry.content_type_uid
        }

        const ctPathKeys = getPathKeys(this.pattern.contentTypeKeys, contentType)
        const ctPath = join.apply(this, ctPathKeys)
        ctPathKeys.splice(ctPathKeys.length - 1)
        const ctFolderPath = join.apply(this, ctPathKeys)

        const entryPathKeys = getPathKeys(this.pattern.entry, entry)
        const entryPath = join.apply(this, entryPathKeys)
        entryPathKeys.splice(entryPathKeys.length - 1)
        const entryFolderPath = join.apply(this, entryPathKeys)

        entry.data = removeUnwantedKeys(this.unwanted.entry, entry.data)
        contentType.data = removeUnwantedKeys(this.unwanted.contentType, contentType.data)

        if (fs.existsSync(ctFolderPath)) {
          let entries: any
          if (fs.existsSync(entryPath)) {
            const data = await readFile(entryPath, 'utf-8')
            entries = JSON.parse(data)
            let index
            for (let i = 0, j = entries.length; i < j; i++) {
              if (entries[i].uid === entry.uid) {
                entries[i] = entry
                index = i
                break
              }
            }

            if (typeof index === 'undefined') {
              // similar to unshift
              entries.splice(0, 0, entry)
            }
          } else {
            entries = [entry]
          }

          return writeFile(entryPath, JSON.stringify(entries))
            .then(() => {
              return writeFile(ctPath, JSON.stringify(contentType))
            })
            .then(resolve)
            .catch(reject)
        }

        mkdirp.sync(ctFolderPath)

        if (!(fs.existsSync(entryFolderPath))) {
          mkdirp.sync(entryFolderPath)
        }

        // the content type prolly doesn't exist, thus the entry too does not exist!
        return writeFile(entryPath, JSON.stringify(entry))
          .then(() => {
            return writeFile(ctPath, JSON.stringify(contentType))
          })
          .then(resolve)
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private publishAsset(asset) {
    return new Promise((resolve, reject) => {
      
    })
  }

  public unpublish(input) {
    return new Promise((resolve, reject) => {

    })
  }

  public delete(input) {
    return new Promise((resolve, reject) => {

    })
  }
}