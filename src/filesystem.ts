/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/


import { debug as Debug } from 'debug';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { join } from 'path';
import * as rimraf from 'rimraf';
import { defs } from './util/key-definitions';
import { logger as log } from './util/logger';
import { promisify } from 'util';


const readFile: any = promisify(fs.readFile);
const writeFile: any = promisify(fs.writeFile);
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
        const locale: string = (data.locale) ? data.locale : 'en-us';
        const contentTypeUid: string = data.content_type_uid;
        const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
        const pth: string = (contentTypeUid === defs.ct.asset) ?
          join(this.config['content-connector'].base_dir, locale, 'assets') :
          join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid);
        const entityPath: string = (contentTypeUid === defs.ct.asset) ? join(pth, defs.asset_file)
          : join(pth, defs.index);
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
                contents[i] = data;
                flag = true;
                break;
              }
            }

            return this.assetConnector.download(data).then((asset) => {
              if (!flag) {
                contents.push(asset);
              }
              resolves();
            }).catch(rejects);
          })
            .then(() => {
              return writeFile(entityPath, JSON.stringify(contents)).then(() => {
                log.info(`${data.uid} Asset published successfullly`);
                return resolve(data);
              }).catch(reject);
            }).catch(reject);
        }
        else {
          var filter:any = (filterKeys) =>{
            var result = {};
            for (var type in data)
                if (filterKeys.indexOf(type) == -1) 
                    result[type] = data[type];
            return result;
          }

          let filterData =  filter(['content_type'])
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
                log.info(`${data.uid} Entry published sucessfully`);
                debug('Entry published sucessfully');
                return resolve(data);
              })
              .catch((error) => {
                log.error(`${data.uid} Entry publishing failed`);
                return reject(error);
              });
          }).catch((error) => {
            log.error(`${data.uid} Entry publishing failed`);
            return reject(error);
          });
        }
      } else {
        log.error(`Kindly provide valid parameters for publish`);
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
          join(this.config['content-connector'].base_dir, locale, 'assets', defs.asset_file) :
          join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid, defs.index);
        if (!fs.existsSync(pth)) {
          return resolve(data);
        } else {
          return readFile(pth).then((contents) => {
            const objs = JSON.parse(contents);
            if (type === defs.asset) {
              return new Promise((resolves, rejects) => {
                let flag = false;
                for (let i = 0; i < objs.length; i++) {
                  if (objs[i].uid === data.uid) {
                    flag = true;
                    objs.splice(i, 1);
                    break;
                  }
                }
                return this.assetConnector.unpublish(data).then(resolves).catch(rejects)
              })
                .then(() => {
                  return writeFile(pth, JSON.stringify(objs))
                    .then(() => {
                      debug('asset unpublished succefully');
                      //log.info(` ${data.data.uid} asset unpublished successfully`);
                      resolve(data);
                    })
                    .catch((error) => {
                      log.error(`${data.uid} asset unpublishing failed`);
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
                  log.info(`${data.uid} Entry unpublished successfully`);
                  resolve(data);
                })
                .catch((error) => {
                  debug(`${data.uid} Entry unpublishing failed`);
                  log.error(`${data.uid} Entry unpublishing failed`);
                  return reject(`${data.uid} Entry unpublishing failed due to ${error}`);
                });
            }
          }).catch((error) => {
            log.error(error);
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
        }
        else {
          const locale: string = query.locale;
          const contentTypeUid: string = query.content_type_uid;
          const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
          const pth: string = (contentTypeUid === defs.ct.asset) ?
            join(this.config['content-connector'].base_dir, locale, 'assets', defs.asset_file) :
            join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid, defs.index);
          if (!fs.existsSync(pth)) {
            return resolve();
          } else {
            return readFile(pth).then((data) => {
              const objs = JSON.parse(data);
              if (type === defs.asset) {
                return new Promise((resolves, rejects) => {
                  let flag = false;
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === query.uid) {
                      flag = true;
                      objs.splice(i, 1);
                      break;
                    }
                  }
                  return this.assetConnector.delete(query).then(resolves).catch(rejects)
                })
                  .then(() => {
                    return writeFile(pth, JSON.stringify(objs))
                      .then(() => {
                        log.info(`${query.data.uid} asset deleted sucessfully`);
                        debug('asset deleted sucessfully');
                        resolve(query);
                      })
                      .catch((error) => {
                        log.error(`Error occoured while deleting ${query.uid} asset`);
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
                    log.info(`${query.uid} Entry deleted sucessfully`);
                    debug('Entry deleted sucessfully');
                    resolve(query);
                  })
                  .catch((error) => {
                    log.error(`Error occoured while deleting ${query.uid} entry`);
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
        log.error(`Kindly provide valid parameters for delete`);
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
    if (typeof data !== 'object' && typeof data.data === 'object') {
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
        fs.readdir(this.config['content-connector'].base_dir, (err, files) => {
          if (err) {
            log.error('Folder did not exist!');
          }
          files.forEach((file) => {
            const pth = join(this.config['content-connector'].base_dir, file, 'data', query.uid);
            if (fs.existsSync(pth)) {
              rimraf.sync(pth);
            }
          });
        });
        log.info(`${query.uid} content type deleted successfully`);
        return resolve(query);
      } catch (error) {
        log.error('failed to delete content type due to', error);
        return reject(error);
      }
    });
  }
}
export = FileSystem;
