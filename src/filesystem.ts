/*!
 * contentstack-sync-content-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { debug as Debug } from 'debug';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { defs } from './util/key-definitions';
import writeFileAtomic from 'write-file-atomic'
const readFile: any = promisify(fs.readFile);
const writeFile: any = promisify(writeFileAtomic);
const debug = Debug('content-sotre-filesystem');

class FileSystem {
  private assetConnector: any;
  private config: any;

  constructor(assetConnector, config) {
    this.assetConnector = assetConnector;
    this.config = config;
  }
  /**
   * @description to publish the retrieved data in filesystem
   * @param  {Object} data: data for publish
   */
  public publish(data) {
    debug('Publish called with', data);
    return new Promise(async (resolve, reject) => {
      if (this.validate(data) && typeof defs.locale === 'string') {
        const locale: string = data.locale;
        const contentTypeUid: string = data.content_type_uid;
        const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
        const pth: string = (contentTypeUid === defs.ct.asset) ?
          join(this.config.contentStore.baseDir, locale, 'assets') :
          join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid);
        const entityPath: string = (contentTypeUid === defs.ct.asset) ? join(pth, defs.asset_file) :
          join(pth, defs.index);
        let contents: any = [];
        if (!fs.existsSync(pth)) {
          debug('new path created as', pth);
          mkdirp.sync(pth, '0755');
        }

        if (fs.existsSync(entityPath)) {
          contents = await readFile(entityPath);
          contents = JSON.parse(contents);
        }
        if (type === defs.asset) {
          return new Promise((resolves, rejects) => {
              let flag = false;
              for (let i = 0; i < contents.length; i++) {
                if (contents[i].uid === data.uid) {
                  if (data.data.hasOwnProperty('download_id')) {
                    if (contents[i].data['download_id'] === data.data['download_id']) {
                      contents[i] = data;
                      flag = true;
                      break;
                    }
                  } else if (data.data.hasOwnProperty('_version')) {
                    if (contents[i].data._version === data.data._version) {
                      contents[i] = data;
                      flag = true;
                      break;
                    }
                  }
                }
              }
              return this.assetConnector.download(data.data).then((asset) => {
                if (!flag) {
                  data.data = asset
                  contents.push(data);
                }
                resolves();
              }).catch(rejects);
            })
            .then(() => {
              return writeFile(entityPath, JSON.stringify(contents)).then(() => {
                return resolve(data);
              }).catch(reject);
            }).catch(reject);
        } else {
          const filter: any = (filterKeys) => {
            const result = {};
            for (const key in data) {
              if (filterKeys.indexOf(key) === -1) {
                result[key] = data[key];
              }
            }
            return result;
          };

          const filterData = filter(['content_type']);
          let flag = false;
          for (let i = 0; i < contents.length; i++) {
            if (contents[i].uid === filterData.uid) {
              flag = true;
              contents[i] = filterData;
              break;
            }
          }
          if (!flag) {
            contents.push(filterData);
          }
          const schemaPath = join(pth, defs.schema_file);
          return writeFile(schemaPath, JSON.stringify(data.content_type)).then(() => {
            return writeFile(entityPath, JSON.stringify(contents))
              .then(() => {
                debug('Entry published sucessfully');
                return resolve(data);
              })
              .catch((error) => {
                return reject(error);
              });
          }).catch((error) => {
            return reject(error);
          });
        }
      } else {
        debug(`Kindly provide valid parameters for publish`);
        return reject(`Kindly provide valid parameters for publish`);
      }
    });
  }

  /**
   * @description to unpublish the retrieved data from filesystem
   * @param  {Object} data: data for unpublish
   */
  public unpublish(data) {
    debug('unpublish called with', data);
    return new Promise((resolve, reject) => {
      if (this.validate(data) && typeof data.locale === 'string') {
        const locale: string = data.locale;
        const contentTypeUid: string = data.content_type_uid;
        const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
        const pth: string = (contentTypeUid === defs.ct.asset) ?
          join(this.config.contentStore.baseDir, locale, 'assets', defs.asset_file) :
          join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid, defs.index);
        if (!fs.existsSync(pth)) {
          return resolve(data);
        } else {
          return readFile(pth).then((contents) => {
            const objs = JSON.parse(contents);
            let object
            if (type === defs.asset) {
              return new Promise((resolves, rejects) => {
                  let flag = true;
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === data.uid) {
                      if (objs[i].data.hasOwnProperty('_version')) {
                        object = objs.splice(i, 1);
                        break;
                      }
                    }
                  }
                  if (object.length === 0) {
                    return resolve(data)
                  }
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === data.uid) {
                      if (objs[i].data.hasOwnProperty('download_id') && (objs[i].data.url === object[0].data.url)) {
                        flag = false;
                        break;
                      }

                    }
                  }
                  if (!flag) {
                    return resolve(data);
                  }
                  return this.assetConnector.unpublish(object[0].data)
                    .then(resolves)
                    .catch(rejects);
                })
                .then(() => {
                  return writeFile(pth, JSON.stringify(objs))
                    .then(() => {
                      debug('asset unpublished succefully');
                      resolve(data);
                    })
                    .catch((error) => {
                      reject(`${data.uid} asset unpublishing failed`);
                    });
                }).catch(reject);
            } else {
              let flag = false;
              for (let i = 0; i < objs.length; i++) {
                if (objs[i].uid === data.uid) {
                  flag = true;
                  objs.splice(i, 1);
                  break;
                }
              }
              return writeFile(pth, JSON.stringify(objs))
                .then(() => {
                  debug('Entry unpublished successfully');
                  resolve(data);
                })
                .catch((error) => {
                  debug(`${data.uid} Entry unpublishing failed`);
                  return reject(`${data.uid} Entry unpublishing failed due to ${error}`);
                });
            }
          }).catch((error) => {
            return reject(`${data.uid} Entry unpublishing failed`);
          });
        }
      } else {
        debug(`Kindly provide valid parameters for unpublish`);
        return reject(`Kindly provide valid parameters for unpublish`);
      }
    });
  }
  /**
   * @description to delete the data from filesystem
   * @param  {Object} query: data for delete
   */
  public delete(query) {
    debug('delete called with', query);
    return new Promise(async (resolve, reject) => {
      if (this.validate(query)) {
        if (query.type === 'content_type_deleted' && query.content_type_uid === defs.ct.schema) {
          return this.deleteContentType(query)
            .then(resolve)
            .catch(reject);
        } else {
          const locale: string = query.locale;
          const contentTypeUid: string = query.content_type_uid;
          const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
          const pth: string = (contentTypeUid === defs.ct.asset) ?
            join(this.config.contentStore.baseDir, locale, 'assets', defs.asset_file) :
            join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid, defs.index);
          if (!fs.existsSync(pth)) {
            return resolve();
          } else {
            return readFile(pth).then((data) => {
              const objs = JSON.parse(data);
              if (type === defs.asset) {
                return new Promise((resolves, rejects) => {
                    let flag = false;
                    const bucket = [];
                    let object;
                    for (let i = 0; i < objs.length; i++) {
                      if (objs[i].uid === query.uid) {
                        flag = true;
                        object = objs.splice(i, 1);
                        bucket.push(object[0].data)
                        i--;
                      }
                    }
                    if (!flag) {
                      return resolves(query);
                    }
                    return this.assetConnector.delete(bucket)
                      .then(resolves)
                      .catch(rejects);
                  })
                  .then(() => {
                    return writeFile(pth, JSON.stringify(objs))
                      .then(() => {
                        debug('asset deleted sucessfully');
                        resolve(query);
                      })
                      .catch((error) => {
                        debug(`Error occoured while deleting ${query.uid} asset`);
                        return reject(error);
                      });
                  }).catch(reject);
              } else {
                let flag = false;
                for (let i = 0; i < objs.length; i++) {
                  if (objs[i].uid === query.uid) {
                    flag = true;
                    objs.splice(i, 1);
                    break;
                  }
                }
                return writeFile(pth, JSON.stringify(objs))
                  .then(() => {
                    debug('Entry deleted sucessfully');
                    resolve(query);
                  })
                  .catch((error) => {
                    debug(`Error occoured while deleting ${query.uid} entry`);
                    return reject(error);
                  });
              }
            }).catch((error) => {
              return reject(error);
            });
          }
        }
      } else {
        return reject(`Kindly provide valid parameters for delete`);
      }
    });
  }

  public find(data) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    });
  }

  public findOne(data) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private validate(data: any) {
    if (typeof data === 'object' && typeof data.data !== 'object') {
      return false;
    }
    if (typeof data.content_type_uid !== 'string') {
      return false;
    }
    return true;
  }
  /**
   * @description to delete content type the data from filesystem
   * @param  {Object} query: data for  delete content type
   */
  private deleteContentType(query) {
    debug('Delete content type called for ', query);
    return new Promise((resolve, reject) => {
      try {
        const files = fs.readdirSync(this.config.contentStore.baseDir);
        files.forEach((file) => {
          const pth = join(this.config.contentStore.baseDir, file, 'data', query.uid);
          if (fs.existsSync(pth)) {
            rimraf.sync(pth);
          }
        });
        return resolve(query);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
export = FileSystem;