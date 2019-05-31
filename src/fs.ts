/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { debug as Debug } from 'debug';
import fs from 'fs';
import { cloneDeep, compact } from 'lodash';
import mkdirp from 'mkdirp';
import { join }  from 'path';
import rimraf from 'rimraf';
import { promisify } from 'util';
import writeFileAtomic from 'write-file-atomic';
import { getPathKeys, removeUnwantedKeys, structuralChanges } from './util/index';
import { readLocales } from './util/locale-management';
import {
  validateContentTypeDeletedObject, validateEntryAssetDeletedObject,
  validatePublishedObject, validateUnpublishedObject
} from './util/validations';

const readFile: any = promisify(fs.readFile);
const writeFile: any = promisify(writeFileAtomic);
const debug = Debug('content-store-filesystem');

export class FilesystemStore {
  private assetStore: any;
  private config: any;
  private pattern: any;
  private unwanted: any;

  constructor(assetStore, config) {
    this.assetStore = assetStore;
    this.config = config.contentStore;
    const baseDirKeys = [];
    baseDirKeys.push(this.config.baseDir);
    this.pattern = {};
    // unwanted keys
    this.unwanted = this.config.unwanted;

    // path keys for entry, assets & content types
    this.pattern.contentTypeKeys = baseDirKeys.concat(compact(this.config.patterns.contentType.split('/')));
    this.pattern.entryKeys = baseDirKeys.concat(compact(this.config.patterns.entry.split('/')));
    this.pattern.assetKeys = baseDirKeys.concat(compact(this.config.patterns.asset.split('/')));
    this.pattern.localeKeys = baseDirKeys.concat(compact(this.config.internal.locales.split('/')));
  }

  public publish(input) {
    return new Promise(async (resolve, reject) => {
      try {
        validatePublishedObject(input);
        const localePath = join.apply(this, this.pattern.localeKeys);
        const locales = await readLocales(localePath);
        const indexOfLocale = (locales as any).indexOf(input.locale);

        if (indexOfLocale === -1) {
          (locales as any).push(input.locale);
          writeFile(localePath, JSON.stringify(locales), (err) => {
            if (err) { return reject(err); }
          });
        }

        if (input.content_type_uid === '_assets') {
          return this.publishAsset(input)
            .then(resolve)
            .catch(reject);
        }

        return this.publishEntry(input)
          .then(resolve)
          .catch(reject);

      } catch (error) {
        return reject(error);
      }
    });
  }

  public unpublish(input) {
    return new Promise((resolve, reject) => {
      try {
        validateUnpublishedObject(input);
        if (input.content_type_uid === '_assets') {
          return this.unpublishAsset(input)
            .then(resolve)
            .catch(reject);
        }

        return this.unpublishEntry(input).then(resolve).catch(reject);
      } catch (error) {
        return reject(error);
      }
    });
  }

  public delete(input) {
    return new Promise((resolve, reject) => {
      try {
        if (input.content_type_uid === '_assets') {
          return this.deleteAsset(input)
            .then(resolve)
            .catch(reject);
        } else if (input.content_type_uid === '_content_types') {
          return this.deleteContentType(input)
            .then(resolve)
            .catch(reject);
        }

        return this.deleteEntry(input)
          .then(resolve)
          .catch(reject);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private publishEntry(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const publishedEntry = cloneDeep(data);
        let entry = {
          content_type_uid: publishedEntry.content_type_uid,
          data: publishedEntry.data,
          locale: publishedEntry.locale,
          uid: publishedEntry.uid,
        };

        let contentType = {
          content_type_uid: '_content_types',
          data: publishedEntry.content_type,
          locale: publishedEntry.locale,
          uid: publishedEntry.content_type_uid,
        };

        const ctPathKeys = getPathKeys(this.pattern.contentTypeKeys, contentType);
        const ctPath = join.apply(this, ctPathKeys);
        ctPathKeys.splice(ctPathKeys.length - 1);
        const ctFolderPath = join.apply(this, ctPathKeys);

        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry);
        const entryPath = join.apply(this, entryPathKeys);
        entryPathKeys.splice(entryPathKeys.length - 1);
        const entryFolderPath = join.apply(this, entryPathKeys);

        entry.data = removeUnwantedKeys(this.unwanted.entry, entry.data);
        contentType.data = removeUnwantedKeys(this.unwanted.contentType, contentType.data);
        entry = structuralChanges(entry)
        contentType = structuralChanges(contentType)
        if (fs.existsSync(ctFolderPath)) {
          let entries: any;
          //if (fs.existsSync(entryPath)) {
            const data = await readFile(entryPath, 'utf-8');
            entries = JSON.parse(data);
            let index;
            for (let i = 0, j = entries.length; i < j; i++) {
              if (entries[i].uid === entry.uid) {
                entries[i] = entry;
                index = i;
                break;
              }
            }

            if (typeof index === 'undefined') {
              // similar to unshift
              entries.splice(0, 0, entry);
            }
          // } else {
          //   entries = [entry];
          // }

          return writeFile(entryPath, JSON.stringify(entries), (err) => {
            if (err) { return reject(err); }
            return writeFile(ctPath, JSON.stringify(contentType), (err) => {
              if (err) { return reject(err); }
              return resolve(entry);
            });
          });
        }

        mkdirp.sync(ctFolderPath);

        if (!(fs.existsSync(entryFolderPath))) {
          mkdirp.sync(entryFolderPath);
        }

        // the content type prolly doesn't exist, thus the entry too does not exist!
        return writeFile(entryPath, JSON.stringify([entry]), (err) => {
          if (err) { return reject(err); }
          return writeFile(ctPath, JSON.stringify(contentType), (err) => {
            if (err) { return reject(err); }
            return resolve(data);
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  private publishAsset(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const punlishedAsset = cloneDeep(data);

        let asset = {
          content_type_uid: punlishedAsset.content_type_uid,
          data: punlishedAsset.data,
          locale: punlishedAsset.locale,
          uid: punlishedAsset.uid,
        };

        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset);
        const assetPath = join.apply(this, assetPathKeys);
        assetPathKeys.splice(assetPathKeys.length - 1);
        const assetFolderPath = join.apply(this, assetPathKeys);

        asset.data = removeUnwantedKeys(this.unwanted.asset, asset.data);
        asset = structuralChanges(asset)
        if (fs.existsSync(assetFolderPath)) {
          let assets: any;
          const data = await readFile(assetPath, 'utf-8');
          assets = JSON.parse(data);
          return new Promise((rs, rj) => {
            let flag = false;
            for (let i = 0, j = assets.length; i < j; i++) {
              if (assets[i].uid === asset.uid) {
                if (asset.hasOwnProperty('download_id')) {
                  if (assets[i].download_id === (asset as any).download_id) {
                    assets[i] = asset;
                    flag = true;
                    break;
                  }
                } else if (assets[i].hasOwnProperty('_version')) {
                  assets[i] = asset;
                  flag = true;
                  break;
                }
              }
            }
            // if(flag) {
            //   return rs()
            // }
            return this.assetStore.download(asset)
              .then((data) => {
                if (!flag) {
                  //asset = data
                  assets.push(data);
                }
                return rs();
              })
              .catch(rj);

          })
          .then(() => {
            return writeFile(assetPath, JSON.stringify(assets), (err) => {
              if (err) { return reject(err); }
              return resolve(data);
            });
          })
        }

        mkdirp.sync(assetFolderPath);
        return this.assetStore.download(asset)
              .then((data) => {
                // asset.data = data;
                return writeFile(assetPath, JSON.stringify([data]), (err) => {
                  if (err) { return reject(err); }
                  return resolve(data);
                });
              })
        
      } catch (error) {
        return reject(error);
      }
    });
  }

  private unpublishAsset(asset) {
    return new Promise(async (resolve, reject) => {
      try {
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset);
        const assetPath = join.apply(this, assetPathKeys);
        let assets: any;
        let object = [];
        if (fs.existsSync(assetPath)) {
          const data = await readFile(assetPath, 'utf-8');
          assets = JSON.parse(data);
          let flag = true;
          return new Promise((rs, rj) => {
          for (let i = 0; i < assets.length; i++) {
            if (assets[i].uid === asset.uid) {
              if (assets[i].hasOwnProperty('_version')) {
                object = assets.splice(i, 1);
                break;
              }
            }
          }
          if (object.length === 0) {
            return resolve(asset);
          }
          for (let i = 0; i < assets.length; i++) {
            if (assets[i].uid === asset.uid) {
              if (assets[i].hasOwnProperty('download_id') && (assets[i].url === object[0].url)) {
                flag = false;
                break;
              }
            }
          }
          if (!flag) {
            return resolve(asset);
          }
          return this.assetStore.unpublish(object[0])
            .then(rs)
            .catch(rj);
          }).then(()=>{
            writeFile(assetPath, JSON.stringify(assets), (err) => {
              if(err) { return reject(err); }
              resolve(data);
            })

          })
        }

        return resolve(asset);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private unpublishEntry(entry) {
    return new Promise(async (resolve, reject) => {
      try {
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry);
        const entryPath = join.apply(this, entryPathKeys);
        let entries: any;
        if (fs.existsSync(entryPath)) {
          const data = await readFile(entryPath, 'utf-8');
          entries = JSON.parse(data);
          for (let i = 0, j = entries.length; i < j; i++) {
            if (entries[i].uid === entry.uid) {
              entries.splice(i, 1);
              break;
            }
          }

          return writeFile(entryPath, JSON.stringify(entries), (err) => {
            if (err) { return reject(err); }
            return resolve(entry);
          });
        }

        return resolve(entry);
      } catch (error) {
        return reject(error);
      }

    });

  }

  private deleteAsset(asset) {
    return new Promise(async (resolve, reject) => {
      try {
        validateEntryAssetDeletedObject(asset);
        const assetPathKeys = getPathKeys(this.pattern.assetKeys, asset);
        const assetPath = join.apply(this, assetPathKeys);
        let assets: any;
        if (fs.existsSync(assetPath)) {
          const data = await readFile(assetPath, 'utf-8');
          assets = JSON.parse(data);
          let flag = false;
          const bucket = [];
          let object;
          for (let i = 0; i < assets.length; i++) {
            if (assets[i].uid === asset.uid) {
              flag = true;
              object = assets.splice(i, 1);
              bucket.push(object[0]);
              i--;
            }
          }
          if (!flag) {
            return resolve(asset);
          }
          return this.assetStore.delete(bucket)
            .then(() => {
              return writeFile(assetPath, JSON.stringify(assets), (err) => {
                if (err) { return reject(err); }
                return resolve(asset);
              });
            })
            .catch(() => {
              return reject(asset);
            });
        }

        return resolve(asset);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private deleteContentType(data) {
    return new Promise(async (resolve, reject) => {
      try {
        validateContentTypeDeletedObject(data);
        const ctPathKeys = this.pattern.contentTypeKeys;
        const localePath = join.apply(this, this.pattern.localeKeys);
        const locales = await readLocales(localePath);
        const localeKeyIndex = ctPathKeys.indexOf(':locale');
        const paths = [];
        ctPathKeys.splice(ctPathKeys.length - 1);
        (locales as any).forEach((locale, index) => {
          ctPathKeys[localeKeyIndex] = locale;
          const ctFolderPathKeys = getPathKeys(ctPathKeys, data);
          const ctFolderPath = join.apply(this, ctFolderPathKeys);
          paths.push(ctFolderPath);
          if (index === (locales as any).length - 1) {
            paths.forEach((path, pthIndex) => {
              if (fs.existsSync(path)) {
                rimraf.sync(path);
              }
              if (pthIndex === paths.length - 1) {
                return resolve(data);
              }
            });

          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  private deleteEntry(entry) {
    return new Promise(async (resolve, reject) => {
      try {
        validateEntryAssetDeletedObject(entry);
        const entryPathKeys = getPathKeys(this.pattern.entryKeys, entry);
        const entryPath = join.apply(this, entryPathKeys);
        let entries: any;
        if (fs.existsSync(entryPath)) {
          const data = await readFile(entryPath, 'utf-8');
          entries = JSON.parse(data);
          for (let i = 0, j = entries.length; i < j; i++) {
            if (entries[i].uid === entry.uid) {
              entries.splice(i, 1);
              break;
            }
          }

          return writeFile(entryPath, JSON.stringify(entries), (err) => {
            if (err) { return reject(err); }
            return resolve(entry);
          });
        }

        return resolve(entry);
      } catch (error) {
        return reject(error);
      }

    });
  }
}
