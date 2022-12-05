/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { debug as Debug } from 'debug'
import { existsSync, unlinkSync } from 'fs'
import { cloneDeep, compact } from 'lodash'
import mkdirp from 'mkdirp'
import { join, sep } from 'path'
import { readFile, writeFile } from './util/fs'
import { getFileFieldPaths } from './util/get-file-fields'
import { buildLocalePath, filter, getPathKeys, removeUnwantedKeys } from './util/index'

import {
  validateContentTypeDeletedObject, validateEntryAssetDeletedObject,
  validatePublishedObject, validateUnpublishedObject,
} from './util/validations'

const debug = Debug('core-fs')

export class FilesystemStore {
  private readonly assetStore: any
  private readonly config: any
  private readonly pattern: {
    contentTypeKeys: string[],
    entryKeys: string[],
    assetKeys: string[],
  }
  private readonly unwanted: any
  private readonly localePath: string

  constructor(assetStore, config) {
    this.assetStore = assetStore
    this.config = config.contentStore
    const baseDirKeys = this.config.baseDir.split(sep)
    this.pattern = ({} as any)
    // unwanted keys
    this.unwanted = this.config.unwanted

    // path keys for entry, assets & content types
    // splitting it by '/' instead of ':/', as we need to know if its a pattern not not, further down the line
    this.pattern.contentTypeKeys = baseDirKeys.concat(compact(this.config.patterns.contentType.split('/')))
    this.pattern.entryKeys = baseDirKeys.concat(compact(this.config.patterns.entry.split('/')))
    this.pattern.assetKeys = baseDirKeys.concat(compact(this.config.patterns.asset.split('/')))
    // maintain locales in a separate file
    this.localePath = buildLocalePath(this.config)
  }

  public publish(input) {
    return new Promise(async (resolve, reject) => {
      try {
        debug(`Publishing ${JSON.stringify(input)}`)
        validatePublishedObject(input)
        if (existsSync(this.localePath)) {
          // if its a new locale, keep track!
          const data: string = await readFile(this.localePath, 'utf-8')
          const locales: string[] = JSON.parse(data)
          const idx = locales.indexOf(input.locale)

          if (idx === -1) {
            locales.unshift(input.locale)
            // removing async - background op!
            await writeFile(this.localePath, JSON.stringify(locales))
          }
        } else {
          await writeFile(this.localePath, JSON.stringify([input.locale]))
        }

        if (input._content_type_uid === '_assets') {
          return this.publishAsset(input)
            .then(resolve)
            .catch(reject)
        }

        const [publishEntryResult] = await Promise.all([this.publishEntry(input), this.updateAssetReferences(input, input._content_type)]);
        return resolve(publishEntryResult);
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

        return this.unpublishEntry(input)
          .then(resolve)
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public delete(input) {
    return new Promise(async (resolve, reject) => {
      try {
        let output: any
        if (input._content_type_uid === '_assets') {
          output = await this.deleteAsset(input)
        } else if (input._content_type_uid === '_content_types') {
          output = await this.deleteContentType(input)
        } else {
          output = await this.deleteEntry(input)
        }

        return resolve(output)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public async updateContentType(data) {
    let schema = cloneDeep(data)
    validateContentTypeDeletedObject(schema)
    schema = removeUnwantedKeys(this.unwanted.contentType, data)

    const contentTypePathKeys = getPathKeys(this.pattern.contentTypeKeys, data)
    const contentTypePath = join.apply(this, contentTypePathKeys) + '.json'

    if (existsSync(contentTypePath)) {
      const content: string = await readFile(contentTypePath, 'utf-8')
      const jsonData: any = JSON.parse(content)

      // for time being, keeping things simple
      // all schemas in one file
      let contentTypeUpdated = false
      for (let i = 0, j = jsonData.length; i < j; i++) {
        if (jsonData[i].uid === data.uid) {
          jsonData[i] = data
          contentTypeUpdated = true
          break
        }
      }

      if (!contentTypeUpdated) {
        jsonData.unshift(data)
      }

      await writeFile(contentTypePath, JSON.stringify(jsonData))
    } else {
      contentTypePathKeys.splice(contentTypePathKeys.length - 1)
      const contentTypeFolderPath = join.apply(contentTypePathKeys)

      mkdirp.sync(contentTypeFolderPath)
      await writeFile(contentTypePath, JSON.stringify([schema]))
    }

    return schema
  }

  private publishAsset(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let asset = cloneDeep(data)
        // to get asset folder path
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset)
        const assetPath = join.apply(this, assetPathKeys) + '.json'
        assetPathKeys.splice(assetPathKeys.length - 1)
        const assetFolderPath = join.apply(this, assetPathKeys)

        // to remove unwanted keys and change structure
        asset = removeUnwantedKeys(this.unwanted.asset, asset)

        if (asset.hasOwnProperty('_version')) {
          // unpublish the published version of asset
          await this.unpublishAsset(asset)
        }
        asset = await this.assetStore.download(asset)

        if (existsSync(assetFolderPath)) {
          if (existsSync(assetPath)) {
            const contents: string = await readFile(assetPath, 'utf-8')
            const assets: any[] = JSON.parse(contents)
            if (asset.hasOwnProperty('_version')) {
              assets.unshift(asset)
              await writeFile(assetPath, JSON.stringify(assets))
            } else {
              let rteMarkdownExists = false
              for (let i = 0, j = assets.length; i < j; i++) {
                if (assets[i].download_id === asset.download_id) {
                  rteMarkdownExists = true
                  break
                }
              }
              if (!rteMarkdownExists) {
                assets.unshift(asset)
                await writeFile(assetPath, JSON.stringify(assets))
              }
            }
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
        const assetPath = join.apply(this, assetPathKeys) + '.json'
        if (existsSync(assetPath)) {
          const data: string = await readFile(assetPath)
          const assets: any[] = JSON.parse(data)
          // will help in saving un-necessary writes
          let unpublishedAsset = false
          let rteAsset = false
          let removedAsset
          for (let i = 0, j = assets.length; i < j; i++) {
            if (assets[i].uid === asset.uid) {
              if (assets[i].hasOwnProperty('_version')) {
                // remove the matching asset
                removedAsset = assets.splice(i, 1)[0]
                unpublishedAsset = true
                i--
                j--
              } else if (assets[i].hasOwnProperty('download_id')) {
                rteAsset = true
              }
            }
          }

          // decide, if the on-premise media file is to be removed
          if (unpublishedAsset && !(rteAsset)) {
            await this.assetStore.unpublish(removedAsset)
          }

          // if any asset object has been removed, only then write to disk
          if (unpublishedAsset) {
            await Promise.all([writeFile(assetPath, JSON.stringify(assets)), this.updateDeletedAssetReferences(asset)]);
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
        const entryPath = join.apply(this, entryPathKeys) + '.json'
        entryPathKeys.splice(entryPathKeys.length - 1)
        const entryFolderPath = join.apply(this, entryPathKeys)

        if (existsSync(entryFolderPath)) {
          if (existsSync(entryPath)) {
            const data: string = await readFile(entryPath, 'utf-8')
            const entries: any[] = JSON.parse(data)
            let entryUnpublished = false
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
        const assetPath = join.apply(this, assetPathKeys) + '.json'

        if (existsSync(assetPath)) {
          const data: string = await readFile(assetPath, 'utf-8')
          const assets: any[] = JSON.parse(data)
          let assetsRemoved = false
          const bucket = []
          for (let i = 0, j = assets.length; i < j; i++) {
            if (assets[i].uid === asset.uid) {
              assetsRemoved = true
              bucket.unshift(assets.splice(i, 1)[0])
              i--
              j--
            }
          }
          if (!assetsRemoved) {
            return resolve(asset)
          }

          // Update the entry here.
          // TODO: When the asset is re-published, check if the entry is updated again.
          this.updateDeletedAssetReferences(asset).catch(reject);
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

  private async deleteContentType(data) {
    validateContentTypeDeletedObject(data)
    const content: string = await readFile(this.localePath, 'utf-8')
    const locales: string[] = JSON.parse(content)

    return Promise
      .all([this.deleteSchema(data, locales), this.deleteAllEntries(data, locales)])
      .then(() => {
        return data
      })
  }

  private async deleteAllEntries(data, locales) {
    const uid = data.uid
    for (let i = 0, j = locales.length; i < j; i++) {
      const locale = locales[i]
      const deleteContentTypeObject = {
        _content_type_uid: uid,
        locale,
      }
      const entryPathKeys = getPathKeys(this.pattern.entryKeys, deleteContentTypeObject)
      const entryPath = join.apply(this, entryPathKeys) + '.json'

      if (existsSync(entryPath)) {
        const contents: string = await readFile(entryPath, 'utf-8')
        // its possible to put all entries in one file
        const entries: any[] = JSON.parse(contents)
        for (let k = 0, l = entries.length; k < l; k++) {
          if (entries[k]._content_type_uid === uid) {
            entries.splice(k, 1)
            k--
            l--
          }
        }

        await writeFile(entryPath, JSON.stringify(entries))
      }
    }

    return
  }

  private async deleteSchema(data, locales: string[]) {
    for (let i = 0, j = locales.length; i < j; i++) {
      const locale = locales[i]
      const deleteContentTypeObject = {
        _content_type_uid: '_content_types',
        locale,
        uid: data.uid,
      }
      const contentTypePathKeys = getPathKeys(this.pattern.contentTypeKeys, deleteContentTypeObject)
      const contentTypePath = join.apply(this, contentTypePathKeys) + '.json'
      if (existsSync(contentTypePath)) {
        const content: string = await readFile(contentTypePath, 'utf-8')
        const jsonData: any = JSON.parse(content)

        if (jsonData instanceof Array) {
          for (let k = 0, m = jsonData.length; k < m; k++) {
            if (jsonData[k].uid === data.uid) {
              jsonData.splice(k, 1)
              break
            }
          }

          await writeFile(contentTypePath, JSON.stringify(jsonData))
        } else {
          unlinkSync(contentTypePath)
        }
      }
    }

    return
  }

  private deleteEntry(entry) {
    return new Promise(async (resolve, reject) => {
      try {
        validateEntryAssetDeletedObject(entry)
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry)
        const entryPath = join.apply(this, entryPathKeys) + '.json'

        if (existsSync(entryPath)) {
          const data: string = await readFile(entryPath, 'utf-8')
          const entries: any[] = JSON.parse(data)
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

  private publishEntry(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let entry = cloneDeep(data)
        entry = filter(entry) // to remove _content_type and checkpoint from entry data

        // to get entry folder path
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry)
        const entryPath = join.apply(this, entryPathKeys) + '.json'
        entryPathKeys.splice(entryPathKeys.length - 1)
        const entryFolderPath = join.apply(this, entryPathKeys)

        entry = removeUnwantedKeys(this.unwanted.entry, entry)

        if (existsSync(entryFolderPath)) {
          if (existsSync(entryPath)) {
            // entry file exists!
            const contents: string = await readFile(entryPath, 'utf-8')
            const entries = JSON.parse(contents)
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
              entries.unshift(entry)
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

  public updateAssetReferences(data, schema) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileFieldPaths = getFileFieldPaths(schema);

        const assetPathKeys = getPathKeys(this.pattern.assetKeys, { locale: data.publish_details ? data.publish_details.locale : data.locale });
        assetPathKeys.splice(assetPathKeys.length - 1);
        const assetFolderPath = join.apply(this, assetPathKeys);
        // Get the asset field map from filesystem.
        let assetMap: any = await readFile(assetFolderPath + '/asset_map.json', 'utf-8');
        try {
          assetMap = JSON.parse(assetMap);
          if (Array.isArray(assetMap)) {
            assetMap = {};
          }
        } catch (error) {
          assetMap = {};
        }
        const entryData = {
          uid: data.uid,
          contentTypeUid: data._content_type_uid,
          locale: data.publish_details ? data.publish_details.locale : data.locale,
        };
        for (const fileFieldPath of fileFieldPaths) {
          this._getAssetFieldsHelper(data, fileFieldPath.split('.'), 0, assetMap, entryData);
        }
        // Check if the asset uids exists in the filesystem before saving, if not delete the keys from mapping object.
        await writeFile(assetFolderPath + '/asset_map.json', JSON.stringify(assetMap));
        return resolve(assetFolderPath);
      } catch (error) {
        return reject(error);
      }
    });
  }

  public updateDeletedAssetReferences(asset) {
    return new Promise(async (resolve, reject) => {
      try {
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, { locale: asset.publish_details ? asset.publish_details.locale : asset.locale });
        assetPathKeys.splice(assetPathKeys.length - 1);
        const assetFolderPath = join.apply(this, assetPathKeys);
        let assetMap: any = await readFile(assetFolderPath + '/asset_map.json', 'utf-8');
        try {
          assetMap = JSON.parse(assetMap);
          if (Array.isArray(assetMap)) {
            assetMap = {};
          }
        } catch (error) {
          assetMap = {};
        }
        if (!assetMap[asset.uid]) {
          return resolve({});
        }
        const entries = assetMap[asset.uid];
        for (const entry of entries) {
          this._updateEntryAssetReference(entry, asset.uid);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  private _getAssetFieldsHelper(data, fileFieldPathArray, index, assetFieldMap, entryData) {
    if (fileFieldPathArray.length <= index) {
      if (Array.isArray(data)) {
        for (const d of data) {
          if (!assetFieldMap[d]) {
            assetFieldMap[d] = [];
          }
          assetFieldMap[d].push({ path: fileFieldPathArray, ...entryData });
        }
      } else {
        if (!assetFieldMap[data]) {
          assetFieldMap[data] = [];
        }
        assetFieldMap[data].push({ path: fileFieldPathArray, ...entryData });
      }
      return;
    }
    if (Array.isArray(data)) {
      for (const d of data) {
        this._getAssetFieldsHelper(d, fileFieldPathArray, index + 1, assetFieldMap, entryData);
      }
    } else {
      if (data[fileFieldPathArray[index]]) {
        this._getAssetFieldsHelper(data[fileFieldPathArray[index]], fileFieldPathArray, index + 1, assetFieldMap, entryData);
      }
    }
  }

  private _updateEntryAssetReference(data, assetId) {
    return new Promise(async (resolve, reject) => {
      try {
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, { ...data, _content_type_uid: data.contentTypeUid });
        const entryFolderPath = join.apply(this, entryPathKeys);
        let entries: any = await readFile(entryFolderPath + '.json', 'utf-8');
        entries = JSON.parse(entries);
        let _entry;
        for (const entry of entries) {
          if (entry.uid === data.uid) {
            _entry = entry;
            break;
          }
        }
        if (_entry) {
          this._nullifyDeletedAssetField(_entry, data.path, 0, assetId);
          await writeFile(entryFolderPath + '.json', JSON.stringify(entries))
        }
        return resolve(entries);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private _nullifyDeletedAssetField(data, fileFieldPathArray, index, assetId) {
    if (fileFieldPathArray.length - 1 <= index) {
      if (Array.isArray(data[fileFieldPathArray[index]])) {
        const _d = data[fileFieldPathArray[index]];
        for (let i = 0; i < _d.length; i++) {
          if (_d[i] === assetId) {
            _d[i] = null;
          }
        }
      } else {
        if (data[fileFieldPathArray[index]] === assetId) {
          data[fileFieldPathArray[index]] = null;
        }
      }
      return;
    }
    if (Array.isArray(data)) {
      for (const d of data) {
        this._nullifyDeletedAssetField(d, fileFieldPathArray, index + 1, assetId);
      }
    } else {
      if (data[fileFieldPathArray[index]]) {
        this._nullifyDeletedAssetField(data[fileFieldPathArray[index]], fileFieldPathArray, index + 1, assetId);
      }
    }
  }
// tslint:disable-next-line: max-file-line-count
}
