/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
//import stringify from 'json-stringify-safe';
import { debug as Debug } from 'debug';
import fs from 'fs';
import { join } from 'path';
import rimraf from 'rimraf';
import { defs } from './util/key-definitions';
import nedb from 'nedb'
import { getEnabledCategories } from 'trace_events';
const debug = Debug('content-sotre-filesystem');
let database = {}
let db
let schemaDb
class FileSystem {
  private assetStore: any;
  private config: any;
  // private db:any

  constructor(assetConnector, config) {
    this.assetStore = assetConnector;
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
        const contentTypeUid: string = data.content_type_uid;
        const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
        const pth: string = (contentTypeUid === defs.ct.asset) ?
          join(this.config.contentStore.baseDir, data.locale,  '_assets.db') :
          join(this.config.contentStore.baseDir, data.locale, '_entries.db');

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

        if ((Object.keys(database)).length == 0 || !(data.locale in database)) {
          database[data.locale] = {};
        }
        if (type === defs.asset) {
          if (!("assets" in database[data.locale])) {
            db = new nedb({
              filename: pth,
              corruptAlertThreshold: 1,
              autoload: true
            });
            db.ensureIndex({
              fieldName: 'uid'
            });
            database[data.locale].assets = {};
            database[data.locale].assets.db = db;
            database[data.locale].assets.count = 1;
          }
          else {
          let asset = database[data.locale].assets
          db = asset.db;
          asset.count++;
          if (asset.count === this.config.contentStore.operationsCount) {
            asset.count = 0;
            db.persistence.compactDatafile();
            console.log("compaction done");
          }
          }
          return this.assetStore.download(data.data)
            .then((asset) => {
              data.data = asset;
              const query = {
                uid: data.uid
              };
              if (data.hasOwnProperty('download_id')) {
                query['download_id'] = data.download_id;
              } else if (data.hasOwnProperty('_version')) {
                query['_version'] = data._version;
              }
              db.update(query, {
                $set: data
              }, {
                'upsert': true
              }, function (err) {
                if (err)
                  return reject(err);
                return resolve(data);
              });
            })
            .catch(reject);
        } else {
          const schemaPath = join(this.config.contentStore.baseDir, data.locale,
            '_schema.db');
          if (!('entries' in database[data.locale])) {
            let db = new nedb({
              filename: pth,
              corruptAlertThreshold: 1,
              autoload: true
            });
            db.ensureIndex({
              fieldName: 'uid'
            });
            schemaDb = new nedb({
              filename: schemaPath,
              corruptAlertThreshold: 1,
              autoload: true
            });
            schemaDb.ensureIndex({
              fieldName: 'uid'
            });
            database[data.locale].entries = {};
            database[data.locale].contentType = {}
            database[data.locale].entries.db = db;
            database[data.locale].entries.count = 1;
            database[data.locale].contentType.db = schemaDb;
          }
          else 
          {
          let entries
          entries = database[data.locale].entries
          db = entries.db;
          schemaDb = database[data.locale].contentType.db;
          entries.count++;
          if (entries.count === this.config.contentStore.operationsCount) {
            entries.count = 0;
            db.persistence.compactDatafile();
            schemaDb.persistence.compactDatafile();
          }
          }
          db.update({
            uid: filterData.uid,
            content_type_uid: filterData.content_type_uid
          }, {
            $set: filterData
          }, {
            'upsert': true
          }, function (err, result) {
            if (err)
              return reject(err);
            schemaDb.update({
              uid: data.content_type_uid
            }, {
              $set: data.content_type
            }, {
              'upsert': true
            }, function (err, newDoc) {
              if (err)
                return reject(err);
              return resolve(data);
            });
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
      let assetStore = this.assetStore
      if (this.validate(data) && typeof data.locale === 'string') {
        const contentTypeUid: string = data.content_type_uid;
        const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
        const pth: string = (contentTypeUid === defs.ct.asset) ?
          join(this.config.contentStore.baseDir, data.locale, 'assets', '_assets.db') :
          join(this.config.contentStore.baseDir, data.locale, 'data', contentTypeUid, "index.db");
        if (!fs.existsSync(pth)) {
          return resolve(data);
        } else {

          if ((Object.keys(database)).length == 0 || !(data.locale in database)) {
            database[data.locale] = {};
          }
          if (type === defs.asset) {
            if (!("asset" in database[data.locale])) {
              db = new nedb({ filename: pth, corruptAlertThreshold: 1, autoload: true });
              db.ensureIndex({ fieldName: 'uid' });
              database[data.locale]['asset'] = {}
              database[data.locale]['asset']['db'] = db;
              database[data.locale]['asset']['count'] = 1;
            }
            else {
              for (let dbs in database) {
                if (dbs == data.locale) {
                  db = database[dbs]['asset'].db;
                  database[dbs]['asset'].count++;
                  if (database[dbs]['asset'].count === this.config.contentStore.operationsCount) {
                    database[dbs]['asset'].count = 0;
                    db.persistence.compactDatafile();
                  }
                  break;
                }
              }
            }

            let result
            const query = {
              uid: data.uid,
              "data._version": {
                $exists: true
              }
            }

            db.find(query, function (err, docs) {
              if (err) return reject(err);

              if (docs.length !== 0) {
                result = docs[0];
                db.remove({ uid: result.uid }, { multi: true }, function (err, numRemoved) {
                  if (err) return reject(err);
                  const unpublishQuery = {
                    uid: data.uid,
                    url: result.data.url,
                    "data.download_id": {
                      $exists: true
                    }
                  };

                  db.find(unpublishQuery, function (err, docs) {
                    if (err) return reject(err);
                    if (docs.length === 0) {
                      return assetStore.unpublish(result.data)
                        .then(resolve(data))
                        .catch(reject);
                    }
                  });
                });
              }
              return resolve(data)
            });
          }
          else {
            if (!('data' in database[data.locale])) {
              database[data.locale]['data'] = {}
            }

            if (!(contentTypeUid in database[data.locale]['data'])) {
              db = new nedb({ filename: pth, corruptAlertThreshold: 1, autoload: true });
              db.ensureIndex({ fieldName: 'uid' });
              database[data.locale]['data'][contentTypeUid] = {}
              database[data.locale]['data'][contentTypeUid]['db'] = db;
              database[data.locale]['data'][contentTypeUid]['count'] = 1;
            }
            else {
              for (let dbs in database) {
                if (dbs === data.locale) {
                  db = database[data.locale]['data'][contentTypeUid].db;
                  database[data.locale]['data'][contentTypeUid].count++;
                  if (database[data.locale]['data'][contentTypeUid].count === this.config.contentStore.operationsCount) {
                    database[data.locale]['data'][contentTypeUid].count = 0;
                    db.persistence.compactDatafile();
                  }
                  break;
                }
              }
            }


            db.remove({ uid: data.uid }, { multi: true }, function (err, numRemoved) {
              if (err) return reject(err)
              return resolve(data);
            })
          }
        }
      } else {
        debug(`Kindly provide valid parameters for unpublish`);
        return reject(`Kindly provide valid parameters for unpublish`);
      }
    });
  }
  /**
   * @description to delete the data from filesystem
   * @param  {Object} data: data for delete
   */
  public delete(data) {
    debug('delete called with', data);
    return new Promise(async (resolve, reject) => {
      if (this.validate(data)) {
        if (data.type === 'content_type_deleted' && data.content_type_uid === defs.ct.schema) {
          return this.deleteContentType(data)
            .then(resolve)
            .catch(reject);
        }
        else {
          const contentTypeUid: string = data.content_type_uid;
          const type: string = (contentTypeUid === defs.ct.asset) ? defs.asset : defs.entry;
          const pth: string = (contentTypeUid === defs.ct.asset) ?
            join(this.config.contentStore.baseDir, data.locale, 'assets', '_assets.db') :
            join(this.config.contentStore.baseDir, data.locale, 'data', contentTypeUid, 'index.db');
          if (!fs.existsSync(pth)) {
            return resolve(data);
          } else {

            if ((Object.keys(database)).length == 0 || !(data.locale in database)) {
              database[data.locale] = {};
            }

            if (type === defs.asset) {
              if (!("asset" in database[data.locale])) {
                db = new nedb({ filename: pth, corruptAlertThreshold: 1, autoload: true });
                db.ensureIndex({ fieldName: 'uid' });
                database[data.locale]['asset'] = {}
                database[data.locale]['asset']['db'] = db;
                database[data.locale]['asset']['count'] = 1;
              }
              else {
                for (let dbs in database) {
                  if (dbs == data.locale) {
                    db = database[dbs]['asset'].db;
                    database[dbs]['asset'].count++;
                    console.log("db found", data.locale)
                    if (database[dbs]['asset'].count === this.config.contentStore.operationsCount) {
                      database[dbs]['asset'].count = 0;
                      db.persistence.compactDatafile();
                      console.log("compaction done")
                    }
                    break;
                  }
                }
              }

              db.find({ uid: data.uid }, function (err, docs) {
                if (err) return reject(err)
                if (docs.length === 0) return resolve(data)
                db.remove({ uid: data.uid }, { multi: true }, function (err, numRemoved) {
                  if (err) return reject(err)
                  return this.assetStore.unpublish(docs)
                    .then(resolve(data))
                    .catch(reject);
                })
              });
            } else {
              if (!('data' in database[data.locale])) {
                database[data.locale]['data'] = {}
              }

              if (!(contentTypeUid in database[data.locale]['data'])) {
                db = new nedb({ filename: pth, corruptAlertThreshold: 1, autoload: true });
                db.ensureIndex({ fieldName: 'uid' });
                database[data.locale]['data'][contentTypeUid] = {}
                database[data.locale]['data'][contentTypeUid]['db'] = db;
                database[data.locale]['data'][contentTypeUid]['count'] = 1;
              }
              else {
                for (let dbs in database) {
                  if (dbs === data.locale) {
                    db = database[data.locale]['data'][contentTypeUid].db;
                    database[data.locale]['data'][contentTypeUid].count++;
                    if (database[data.locale]['data'][contentTypeUid].count === this.config.contentStore.operationsCount) {
                      database[data.locale]['data'][contentTypeUid].count = 0;
                      db.persistence.compactDatafile();
                    }
                    break;
                  }
                }
              }

              db.remove({ uid: data.uid }, { multi: true }, function (err, numRemoved) {
                if (err) return reject(err)
                return resolve(data);
              })
            }
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
   * @param  {Object} data: data for  delete content type
   */
  private deleteContentType(data) {
    debug('Delete content type called for ', data);
    return new Promise((resolve, reject) => {
      try {
        const files = fs.readdirSync(this.config.contentStore.baseDir);
        files.forEach((file) => {
          const pth = join(this.config.contentStore.baseDir, file, 'data', data.uid);
          if (fs.existsSync(pth)) {
            rimraf.sync(pth);
          }
        });
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
export = FileSystem;


