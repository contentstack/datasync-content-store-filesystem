/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { Promise as Promises } from 'bluebird';
import { debug as Debug } from 'debug';
import * as filesystem from 'fs';
import * as mkdirp from 'mkdirp';
import { join } from 'path';
import * as rimraf from 'rimraf';
import { defs } from './util/key-definitions';
import { logger as log } from './util/logger';

const fs: any = Promises.promisifyAll(filesystem, { suffix: 'P' });
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
    return new Promises(async (resolve, reject) => {
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
          log.info(`${pth} is created`);
          mkdirp.sync(pth, '0755');
        }

        if (fs.existsSync(entityPath)) {
          contents = await fs.readFileP(entityPath);
          contents = JSON.parse(contents);
        }
        if (type === defs.asset) {
          return new Promises((resolves, rejects) => {
            let flag = false;
            for (let i = 0; i < contents.length; i++) {
              if (contents[i].uid === data.data.uid) {
                contents[i] = data.data;
                flag = true;
                break;
              }
            }
            if (!flag) {
              contents.push(data.data);
            }
            return this.assetConnector.download(data).then(resolves).catch(rejects);
          })
            .then(() => {
              return fs.writeFileP(entityPath, JSON.stringify(contents)).then(() => {
                log.info(`${data.data.uid} Asset published successfullly`);
                return resolve(data);
              }).catch(reject);
            }).catch(reject);
        }
        else {
          let flag = false;
          for (let i = 0; i < contents.length; i++) {
            if (contents[i].uid === data.data.uid) {
              flag = true;
              contents[i] = data.data;
              break;
            }
          }
          if (!flag) {
            contents.push(data.data);
          }
          const schemaPath = join(pth, defs.schema_file);
          return fs.writeFileP(schemaPath, JSON.stringify(data.content_type)).then(() => {
            return fs.writeFileP(entityPath, JSON.stringify(contents))
              .then(() => {
                log.info(`${data.data.uid} Entry published sucessfully`);
                debug('Entry published sucessfully');
                return resolve(data);
              })
              .catch((error) => {
                log.error(`${data.data.uid} Entry publishing failed`);
                return reject(error);
              });
          }).catch((error) => {
            log.error(`${data.data.uid} Entry publishing failed`);
            return (error);
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
    return new Promises((resolve, reject) => {
      try {
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
            return fs.readFileP(pth).then((contents) => {
              const objs = JSON.parse(contents);
              if (type === defs.asset) {
                let flag = false;
                for (let i = 0; i < objs.length; i++) {
                  if (objs[i].uid === data.data.uid) {
                    flag = true;
                    objs.splice(i, 1);
                    break;
                  }
                }
                return this.assetConnector.unpublish(data).then(() => { return; })
                  .catch(reject)
                  .then(() => {
                    return fs.writeFileP(pth, JSON.stringify(objs))
                      .then(() => {
                        debug('asset unpublished succefully');
                        log.info(` ${data.data.uid} asset unpublished succefully`);
                        resolve(data);
                      })
                      .catch((error) => {
                        log.error(`${data.data.uid} asset unpublishing failed`);
                        return reject(error);
                      });
                  }).catch(reject);
              } else {
                let flag = false;
                for (let i = 0; i < objs.length; i++) {
                  if (objs[i].uid === data.data.uid) {
                    flag = true;
                    objs.splice(i, 1);
                    break;
                  }
                }
                return fs.writeFileP(pth, JSON.stringify(objs))
                  .then(() => {
                    debug('Entry unpublished successfully');
                    log.info(`${data.data.uid} Entry unpublished successfully`);
                    resolve(data);
                  })
                  .catch((error) => {
                    debug(`${data.data.uid} Entry unpublishing failed`);
                    log.error(`${data.data.uid} Entry unpublishing failed`);
                    return reject(error);
                  });
              }
            }).catch((error) => {
              log.error(error);
              return resolve(data);
            });
          }
        } else {
          debug(`Kindly provide valid parameters for unpublish`);
          return reject(`Kindly provide valid parameters for unpublish`);
        }
      } catch (error) {
        debug(`${data.data.uid} Entry unpublishing failed`);
        log.error(`${data.data.uid} Entry unpublishing failed`);
        return reject(error);
      }
    });
  }
  /**
   * @description to delete the data from filesystem
   * @param  {Object} query: data for delete
   */
  public delete(query) {
    debug('delete called with', query);
    return new Promises(async (resolve, reject) => {
      try {
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
              return fs.readFileP(pth).then((data) => {
                const objs = JSON.parse(data);
                if (type === defs.asset) {
                  let flag = false;
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === query.data.uid) {
                      flag = true;
                      objs.splice(i, 1);
                      break;
                    }
                  }
                  return this.assetConnector.delete(query)
                    .then(() => {
                      return;
                    })
                    .catch((error) => {
                      reject(error);
                    })
                    .then(() => {
                      return fs.writeFileP(pth, JSON.stringify(objs))
                        .then(() => {
                          log.info(`${query.data.uid} asset deleted sucessfully`);
                          debug('asset deleted sucessfully');
                          resolve(query);
                        })
                        .catch((error) => {
                          log.error(`Error occoured while deleting ${query.data.uid} asset`);
                          debug(`Error occoured while deleting ${query.data.uid} asset`);
                          return reject(error);
                        });
                    }).catch(reject);
                } else {
                  let flag = false;
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === query.data.uid) {
                      flag = true;
                      objs.splice(i, 1);
                      break;
                    }
                  }
                  return fs.writeFileP(pth, JSON.stringify(objs))
                    .then(() => {
                      log.info(`${query.data.uid} Entry deleted sucessfully`);
                      debug('Entry deleted sucessfully');
                      resolve(query);
                    })
                    .catch((error) => {
                      log.error(`Error occoured while deleting ${query.data.uid} entry`);
                      debug(`Error occoured while deleting ${query.data.uid} entry`);
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
      } catch (error) {
        log.error(`Error occoured while deleting ${query.data.uid} entry`);
        debug(`Error occoured while deleting ${query.data.uid} entry`);
        return reject(`Error occoured while deleting ${query.data.uid} entry`);
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
    return new Promises((resolve, reject) => {
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
