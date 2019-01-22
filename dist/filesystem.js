"use strict";
/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const debug_1 = require("debug");
const fs = __importStar(require("fs"));
const mkdirp = __importStar(require("mkdirp"));
const path_1 = require("path");
const rimraf = __importStar(require("rimraf"));
const key_definitions_1 = require("./util/key-definitions");
const logger_1 = require("./util/logger");
const util_1 = require("util");
const readFile = util_1.promisify(fs.readFile);
const writeFile = util_1.promisify(fs.writeFile);
const debug = debug_1.debug('content-sotre-filesystem');
class FileSystem {
    constructor(assetConnector, config) {
        this.assetConnector = assetConnector;
        this.config = config;
    }
    /**
     * @description to publish the retrieved data in filesystem
     * @param  {Object} data: data for publish
     */
    publish(data) {
        debug('Publish called with', data);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.validate(data) && typeof key_definitions_1.defs.locale === 'string') {
                const locale = (data.locale) ? data.locale : 'en-us';
                const contentTypeUid = data.content_type_uid;
                const type = (contentTypeUid === key_definitions_1.defs.ct.asset) ? key_definitions_1.defs.asset : key_definitions_1.defs.entry;
                const pth = (contentTypeUid === key_definitions_1.defs.ct.asset) ?
                    path_1.join(this.config['content-connector'].base_dir, locale, 'assets') :
                    path_1.join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid);
                const entityPath = (contentTypeUid === key_definitions_1.defs.ct.asset) ? path_1.join(pth, key_definitions_1.defs.asset_file)
                    : path_1.join(pth, key_definitions_1.defs.index);
                let contents = [];
                if (!fs.existsSync(pth)) {
                    debug('new path created as', pth);
                    mkdirp.sync(pth, '0755');
                }
                if (fs.existsSync(entityPath)) {
                    contents = yield readFile(entityPath);
                    contents = JSON.parse(contents);
                }
                if (type === key_definitions_1.defs.asset) {
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
                            logger_1.logger.info(`${data.uid} Asset published successfullly`);
                            return resolve(data);
                        }).catch(reject);
                    }).catch(reject);
                }
                else {
                    let flag = false;
                    for (let i = 0; i < contents.length; i++) {
                        if (contents[i].uid === data.uid) {
                            flag = true;
                            contents[i] = data;
                            break;
                        }
                    }
                    if (!flag) {
                        contents.push(data);
                    }
                    const schemaPath = path_1.join(pth, key_definitions_1.defs.schema_file);
                    return writeFile(schemaPath, JSON.stringify(data.content_type)).then(() => {
                        return writeFile(entityPath, JSON.stringify(contents))
                            .then(() => {
                            logger_1.logger.info(`${data.uid} Entry published sucessfully`);
                            debug('Entry published sucessfully');
                            return resolve(data);
                        })
                            .catch((error) => {
                            logger_1.logger.error(`${data.uid} Entry publishing failed`);
                            return reject(error);
                        });
                    }).catch((error) => {
                        logger_1.logger.error(`${data.uid} Entry publishing failed`);
                        return reject(error);
                    });
                }
            }
            else {
                logger_1.logger.error(`Kindly provide valid parameters for publish`);
                debug(`Kindly provide valid parameters for publish`);
                return reject(`Kindly provide valid parameters for publish`);
            }
        }));
    }
    /**
     * @description to unpublish the retrieved data from filesystem
     * @param  {Object} data: data for unpublish
     */
    unpublish(data) {
        debug('unpublish called with', data);
        return new Promise((resolve, reject) => {
            if (this.validate(data) && typeof data.locale === 'string') {
                const locale = data.locale;
                const contentTypeUid = data.content_type_uid;
                const type = (contentTypeUid === key_definitions_1.defs.ct.asset) ? key_definitions_1.defs.asset : key_definitions_1.defs.entry;
                const pth = (contentTypeUid === key_definitions_1.defs.ct.asset) ?
                    path_1.join(this.config['content-connector'].base_dir, locale, 'assets', key_definitions_1.defs.asset_file) :
                    path_1.join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid, key_definitions_1.defs.index);
                if (!fs.existsSync(pth)) {
                    return resolve(data);
                }
                else {
                    return readFile(pth).then((contents) => {
                        const objs = JSON.parse(contents);
                        if (type === key_definitions_1.defs.asset) {
                            return new Promise((resolves, rejects) => {
                                let flag = false;
                                for (let i = 0; i < objs.length; i++) {
                                    if (objs[i].uid === data.uid) {
                                        flag = true;
                                        objs.splice(i, 1);
                                        break;
                                    }
                                }
                                return this.assetConnector.unpublish(data).then(resolves).catch(rejects);
                            })
                                .then(() => {
                                return writeFile(pth, JSON.stringify(objs))
                                    .then(() => {
                                    debug('asset unpublished succefully');
                                    //log.info(` ${data.data.uid} asset unpublished successfully`);
                                    resolve(data);
                                })
                                    .catch((error) => {
                                    logger_1.logger.error(`${data.uid} asset unpublishing failed`);
                                    reject(`${data.uid} asset unpublishing failed`);
                                });
                            }).catch(reject);
                        }
                        else {
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
                                logger_1.logger.info(`${data.uid} Entry unpublished successfully`);
                                resolve(data);
                            })
                                .catch((error) => {
                                debug(`${data.uid} Entry unpublishing failed`);
                                logger_1.logger.error(`${data.uid} Entry unpublishing failed`);
                                return reject(`${data.uid} Entry unpublishing failed due to ${error}`);
                            });
                        }
                    }).catch((error) => {
                        logger_1.logger.error(error);
                        return reject(`${data.uid} Entry unpublishing failed`);
                    });
                }
            }
            else {
                debug(`Kindly provide valid parameters for unpublish`);
                return reject(`Kindly provide valid parameters for unpublish`);
            }
        });
    }
    /**
     * @description to delete the data from filesystem
     * @param  {Object} query: data for delete
     */
    delete(query) {
        debug('delete called with', query);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.validate(query)) {
                if (query.type === 'content_type_deleted' && query.content_type_uid === key_definitions_1.defs.ct.schema) {
                    return this.deleteContentType(query)
                        .then(resolve)
                        .catch(reject);
                }
                else {
                    const locale = query.locale;
                    const contentTypeUid = query.content_type_uid;
                    const type = (contentTypeUid === key_definitions_1.defs.ct.asset) ? key_definitions_1.defs.asset : key_definitions_1.defs.entry;
                    const pth = (contentTypeUid === key_definitions_1.defs.ct.asset) ?
                        path_1.join(this.config['content-connector'].base_dir, locale, 'assets', key_definitions_1.defs.asset_file) :
                        path_1.join(this.config['content-connector'].base_dir, locale, 'data', contentTypeUid, key_definitions_1.defs.index);
                    if (!fs.existsSync(pth)) {
                        return resolve();
                    }
                    else {
                        return readFile(pth).then((data) => {
                            const objs = JSON.parse(data);
                            if (type === key_definitions_1.defs.asset) {
                                return new Promise((resolves, rejects) => {
                                    let flag = false;
                                    for (let i = 0; i < objs.length; i++) {
                                        if (objs[i].uid === query.uid) {
                                            flag = true;
                                            objs.splice(i, 1);
                                            break;
                                        }
                                    }
                                    return this.assetConnector.delete(query).then(resolves).catch(rejects);
                                })
                                    .then(() => {
                                    return writeFile(pth, JSON.stringify(objs))
                                        .then(() => {
                                        logger_1.logger.info(`${query.data.uid} asset deleted sucessfully`);
                                        debug('asset deleted sucessfully');
                                        resolve(query);
                                    })
                                        .catch((error) => {
                                        logger_1.logger.error(`Error occoured while deleting ${query.uid} asset`);
                                        debug(`Error occoured while deleting ${query.uid} asset`);
                                        return reject(error);
                                    });
                                }).catch(reject);
                            }
                            else {
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
                                    logger_1.logger.info(`${query.uid} Entry deleted sucessfully`);
                                    debug('Entry deleted sucessfully');
                                    resolve(query);
                                })
                                    .catch((error) => {
                                    logger_1.logger.error(`Error occoured while deleting ${query.uid} entry`);
                                    debug(`Error occoured while deleting ${query.uid} entry`);
                                    return reject(error);
                                });
                            }
                        }).catch((error) => {
                            return reject(error);
                        });
                    }
                }
            }
            else {
                logger_1.logger.error(`Kindly provide valid parameters for delete`);
                return reject(`Kindly provide valid parameters for delete`);
            }
        }));
    }
    find(data) {
        return new Promise((resolve, reject) => {
            try {
                return resolve(data);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    findOne(data) {
        return new Promise((resolve, reject) => {
            try {
                return resolve(data);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    validate(data) {
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
    deleteContentType(query) {
        debug('Delete content type called for ', query);
        return new Promise((resolve, reject) => {
            try {
                fs.readdir(this.config['content-connector'].base_dir, (err, files) => {
                    if (err) {
                        logger_1.logger.error('Folder did not exist!');
                    }
                    files.forEach((file) => {
                        const pth = path_1.join(this.config['content-connector'].base_dir, file, 'data', query.uid);
                        if (fs.existsSync(pth)) {
                            rimraf.sync(pth);
                        }
                    });
                });
                logger_1.logger.info(`${query.uid} content type deleted successfully`);
                return resolve(query);
            }
            catch (error) {
                logger_1.logger.error('failed to delete content type due to', error);
                return reject(error);
            }
        });
    }
}
module.exports = FileSystem;
//# sourceMappingURL=filesystem.js.map