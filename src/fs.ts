/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { debug as Debug } from 'debug'
import { existsSync } from 'fs'
import { cloneDeep, compact } from 'lodash'
import { join }  from 'path'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import { readFile, writeFile } from './util/fs'
import { getPathKeys, removeUnwantedKeys, filter } from './util/index'
import { readLocales } from './util/locale-management'
import {
  validateContentTypeDeletedObject, validateEntryAssetDeletedObject,
  validatePublishedObject, validateUnpublishedObject
} from './util/validations'

const debug = Debug('core-fs')

export class FilesystemStore {
  private readonly assetStore: any
  private config: any
  private pattern: any
  private unwanted: any

  constructor(assetStore, config) {
    this.assetStore = assetStore
    this.config = config.contentStore
    const baseDirKeys = []
    baseDirKeys.push(this.config.baseDir)
    this.pattern = {}
    // unwanted keys
    this.unwanted = this.config.unwanted

    // path keys for entry, assets & content types
    this.pattern.contentTypeKeys = baseDirKeys.concat(compact(this.config.patterns.contentType.split('/')))
    this.pattern.entryKeys = baseDirKeys.concat(compact(this.config.patterns.entry.split('/')))
    this.pattern.assetKeys = baseDirKeys.concat(compact(this.config.patterns.asset.split('/')))
    this.pattern.localeKeys = baseDirKeys.concat(compact(this.config.internal.locales.split('/')))
  }

  public publish(input) {
    return new Promise(async (resolve, reject) => {
      try {
        validatePublishedObject(input)
        const localePath = join.apply(this, this.pattern.localeKeys)
        const locales = await readLocales(localePath)
        const indexOfLocale = (locales as any).indexOf(input.locale)

        if (indexOfLocale === -1) {
          (locales as any).push(input.locale)
          // async - background operation!
          writeFile(localePath, JSON.stringify(locales), (err) => {
            if (err) { 
              return reject(err) 
            }
          })
        }

        if (input._content_type_uid === '_assets') {
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

  public unpublish(input) {
    return new Promise((resolve, reject) => {
      try {
        validateUnpublishedObject(input)
        if (input._content_type_uid === '_assets') {
          return this.unpublishAsset(input)
            .then(resolve)
            .catch(reject)
        }

        return this.unpublishEntry(input).then(resolve).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public delete(input) {
    return new Promise((resolve, reject) => {
      try {
        if (input._content_type_uid === '_assets') {
          return this.deleteAsset(input)
            .then(resolve)
            .catch(reject)
        } else if (input._content_type_uid === '_content_types') {
          return this.deleteContentType(input)
            .then(resolve)
            .catch(reject)
        }

        return this.deleteEntry(input)
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
        let entry = cloneDeep(data)
        entry = filter(entry) // to remove _content_type and checkpoint from entry data

        // to get entry folder path
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry)
        const entryPath = join.apply(this, entryPathKeys)
        entryPathKeys.splice(entryPathKeys.length - 1)
        const entryFolderPath = join.apply(this, entryPathKeys)

        entry = removeUnwantedKeys(this.unwanted.entry, entry)

        if (existsSync(entryFolderPath)) {
          if (existsSync(entryPath)) {
            // entry file exists!
            const data = await readFile(entryPath, 'utf-8')
            const entries = JSON.parse(data)
            // use this to save writes
            let entryUpdated = false
            for (let i = 0, j = entries.length; i < j; i++) {
              if (entries[i].uid === entry.uid && entries[i].locale === entry.locale) {
                entries[i] = entry
                entryUpdated = true
                break
              }
            }

            if (!entryUpdated) {
              entries.push(entry)
            }

            await writeFile(entryPath, JSON.stringify(entries))
          } else {
            // entry file does not exist
            await writeFile(entryPath, JSON.stringify([entry]))
          }
        } else {
          // entry folder does not exist!
          mkdirp.sync(entryFolderPath)

          await writeFile(entryPath, JSON.stringify([entry]))
        }

        return resolve(entry)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private publishAsset(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let asset = cloneDeep(data)

        // to get asset folder path 
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset)
        const assetPath = join.apply(this, assetPathKeys)
        assetPathKeys.splice(assetPathKeys.length - 1)
        const assetFolderPath = join.apply(this, assetPathKeys)

        // to remove unwanted keys and change structure
        asset = removeUnwantedKeys(this.unwanted.asset, asset)

        // unpublish the published version of asset
        await this.unpublishAsset(asset)
        asset = await this.assetStore.download(asset)

        if (existsSync(assetFolderPath)) {
          if (existsSync(assetPath)) {
            const data = await readFile(assetPath, 'utf-8')
            const assets = JSON.parse(data)
            assets.push(asset)

            await writeFile(assetPath, JSON.stringify(assets))
          } else {
            await writeFile(assetPath, JSON.stringify([asset]))
          }          
        } else {
          // create folder, if it does not exist!
          mkdirp.sync(assetFolderPath)
          await writeFile(assetPath, JSON.stringify([data]))
        }

        return resolve(asset)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private unpublishAsset(asset) {
    return new Promise(async (resolve, reject) => {
      try {
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset)
        const assetPath = join.apply(this, assetPathKeys)
        if (existsSync(assetPath)) {
          const data = await readFile(assetPath, 'utf-8')
          const assets = JSON.parse(data)
          // will help in saving un-necessary writes
          let unpublishedAsset = false
          let rteAsset = false
          let removedAsset
          for (let i = 0, j = assets.length; i < j; i++) {
            if (assets[i].hasOwnProperty('_version')) {
              // remove the matching asset
              removedAsset = assets.splice(i, 1)[0]
              unpublishedAsset = true
              i--
            } else if (assets[i].hasOwnProperty('download_id')) {
              rteAsset = true
            }
          }

          if (unpublishedAsset && !(rteAsset)) {
            await this.assetStore.unpublish(removedAsset)
          }

          if (unpublishedAsset) {
            await writeFile(assetPath, JSON.stringify(assets))
          }
        }

        return resolve(asset)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private unpublishEntry(entry) {
    return new Promise(async (resolve, reject) => {
      try {
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry)
        const entryPath = join.apply(this, entryPathKeys)
        entryPathKeys.splice(entryPathKeys.length - 1)
        const entryFolderPath = join.apply(this, entryPathKeys)

        let entries: any[]
        if (existsSync(entryFolderPath)) {
          if (existsSync(entryPath)) {
            const data = await readFile(entryPath, 'utf-8')
            let entryUnpublished = false
            entries = JSON.parse(data)
            for (let i = 0, j = entries.length; i < j; i++) {
              if (entries[i].uid === entry.uid) {
                entries.splice(i, 1)
                entryUnpublished = true
                break
              }
            }

            if (entryUnpublished) {
              await writeFile(entryPath, JSON.stringify(entries))
            }
          }
        }

        return resolve(entry)
      } catch (error) {
        return reject(error)
      }

    })

  }

  private deleteAsset(asset) {
    return new Promise(async (resolve, reject) => {
      try {
        validateEntryAssetDeletedObject(asset)
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset)
        const assetPath = join.apply(this, assetPathKeys)
        let assets: any
        if (existsSync(assetPath)) {
          const data = await readFile(assetPath, 'utf-8')
          assets = JSON.parse(data)
          let assetsRemoved = false
          const bucket = []
          for (let i = 0, j = assets.length; i < j; i++) {
            if (assets[i].uid === asset.uid) {
              assetsRemoved = true
              bucket.push(assets.splice(i, 1)[0])
              i--
            }
          }
          if (!assetsRemoved) {
            return resolve(asset)
          }
          return this.assetStore.delete(bucket)
            .then(() => writeFile(assetPath, JSON.stringify(assets)))
            .then(() => resolve(asset))
            .catch(reject)
        }
        return resolve(asset)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private deleteContentType(data) {
    return new Promise(async (resolve, reject) => {
      try {
        validateContentTypeDeletedObject(data)
        const ctPathKeys = this.pattern.contentTypeKeys
        const localePath = join.apply(this, this.pattern.localeKeys)
        const locales = await readLocales(localePath)
        const localeKeyIndex = ctPathKeys.indexOf(':locale')
        const paths = []
        ctPathKeys.splice(ctPathKeys.length - 1)
        (locales as any).forEach((locale, index) => {
          ctPathKeys[localeKeyIndex] = locale
          const ctFolderPathKeys = getPathKeys(ctPathKeys, data)
          const ctFolderPath = join.apply(this, ctFolderPathKeys)
          paths.push(ctFolderPath)
          if (index === (locales as any).length - 1) {
            paths.forEach((path) => {
              if (existsSync(path)) {
                rimraf.sync(path)
              }
            })
          }
        })
        return resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private deleteEntry(entry) {
    return new Promise(async (resolve, reject) => {
      try {
        validateEntryAssetDeletedObject(entry)
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry)
        const entryPath = join.apply(this, entryPathKeys)
        let entries: any
        if (existsSync(entryPath)) {
          const data = await readFile(entryPath, 'utf-8')
          entries = JSON.parse(data)
          let entryDeleted = false
          for (let i = 0, j = entries.length; i < j; i++) {
            if (entries[i].uid === entry.uid) {
              entries.splice(i, 1)
              entryDeleted = true
              break
            }
          }
          if (entryDeleted) {
            await writeFile(entryPath, JSON.stringify(entries))
          }
        }

        return resolve(entry)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
