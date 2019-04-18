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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const debug_1 = require("debug");
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = require("util");
const key_definitions_1 = require("./util/key-definitions");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(write_file_atomic_1.default);
const debug = debug_1.debug('content-store-filesystem');
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
                const locale = data.locale;
                const contentTypeUid = data.content_type_uid;
                const type = (contentTypeUid === key_definitions_1.defs.ct.asset) ? key_definitions_1.defs.asset : key_definitions_1.defs.entry;
                const pth = (contentTypeUid === key_definitions_1.defs.ct.asset) ?
                    path_1.join(this.config.contentStore.baseDir, locale, 'assets') :
                    path_1.join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid);
                const entityPath = (contentTypeUid === key_definitions_1.defs.ct.asset) ? path_1.join(pth, key_definitions_1.defs.asset_file) :
                    path_1.join(pth, key_definitions_1.defs.index);
                let contents = [];
                if (!fs_1.default.existsSync(pth)) {
                    debug('new path created as', pth);
                    mkdirp_1.default.sync(pth, '0755');
                }
                if (fs_1.default.existsSync(entityPath)) {
                    contents = yield readFile(entityPath);
                    contents = JSON.parse(contents);
                }
                if (type === key_definitions_1.defs.asset) {
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
                                }
                                else if (contents[i].data.hasOwnProperty('_version')) {
                                    contents[i] = data;
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        return this.assetConnector.download(data.data).then((asset) => {
                            if (!flag) {
                                data.data = asset;
                                contents.push(data);
                            }
                            resolves();
                        }).catch(rejects);
                    })
                        .then(() => {
                        writeFile(entityPath, JSON.stringify(contents), (err) => {
                            if (err)
                                return reject(err);
                            return resolve(data);
                        });
                    }).catch(reject);
                }
                else {
                    const filter = (filterKeys) => {
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
                    const schemaPath = path_1.join(pth, key_definitions_1.defs.schema_file);
                    writeFile(schemaPath, JSON.stringify(data.content_type), (err) => {
                        if (err)
                            return reject(err);
                        writeFile(entityPath, JSON.stringify(contents), (err) => {
                            if (err)
                                return reject(err);
                            debug('Entry published sucessfully');
                            return resolve(data);
                        });
                    });
                }
            }
            else {
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
                    path_1.join(this.config.contentStore.baseDir, locale, 'assets', key_definitions_1.defs.asset_file) :
                    path_1.join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid, key_definitions_1.defs.index);
                if (!fs_1.default.existsSync(pth)) {
                    return resolve(data);
                }
                else {
                    return readFile(pth).then((contents) => {
                        const objs = JSON.parse(contents);
                        let object = [];
                        if (type === key_definitions_1.defs.asset) {
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
                                    return resolve(data);
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
                                writeFile(pth, JSON.stringify(objs), (err) => {
                                    if (err)
                                        reject(`${data.uid} asset unpublishing failed`);
                                    debug('asset unpublished succefully');
                                    resolve(data);
                                });
                            }).catch(reject);
                        }
                        else {
                            for (let i = 0; i < objs.length; i++) {
                                if (objs[i].uid === data.uid) {
                                    objs.splice(i, 1);
                                    break;
                                }
                            }
                            writeFile(pth, JSON.stringify(objs), (err) => {
                                if (err)
                                    return reject(`${data.uid} Entry unpublishing failed due to ${err}`);
                                debug('Entry unpublished successfully');
                                return resolve(data);
                            });
                        }
                    }).catch((error) => {
                        return reject(`${data.uid} Entry unpublishing failed due to ${error}`);
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
                        path_1.join(this.config.contentStore.baseDir, locale, 'assets', key_definitions_1.defs.asset_file) :
                        path_1.join(this.config.contentStore.baseDir, locale, 'data', contentTypeUid, key_definitions_1.defs.index);
                    if (!fs_1.default.existsSync(pth)) {
                        return resolve();
                    }
                    else {
                        return readFile(pth).then((data) => {
                            const objs = JSON.parse(data);
                            if (type === key_definitions_1.defs.asset) {
                                return new Promise((resolves, rejects) => {
                                    let flag = false;
                                    const bucket = [];
                                    let object;
                                    for (let i = 0; i < objs.length; i++) {
                                        if (objs[i].uid === query.uid) {
                                            flag = true;
                                            object = objs.splice(i, 1);
                                            bucket.push(object[0].data);
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
                                    writeFile(pth, JSON.stringify(objs), (err) => {
                                        if (err)
                                            return reject(err);
                                        debug('asset deleted sucessfully');
                                        return resolve(query);
                                    });
                                }).catch(reject);
                            }
                            else {
                                for (let i = 0; i < objs.length; i++) {
                                    if (objs[i].uid === query.uid) {
                                        objs.splice(i, 1);
                                        break;
                                    }
                                }
                                writeFile(pth, JSON.stringify(objs), (err) => {
                                    if (err)
                                        return reject(err);
                                    debug('Entry deleted sucessfully');
                                    return resolve(query);
                                });
                            }
                        }).catch((error) => {
                            return reject(error);
                        });
                    }
                }
            }
            else {
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
    deleteContentType(query) {
        debug('Delete content type called for ', query);
        return new Promise((resolve, reject) => {
            try {
                const files = fs_1.default.readdirSync(this.config.contentStore.baseDir);
                files.forEach((file) => {
                    const pth = path_1.join(this.config.contentStore.baseDir, file, 'data', query.uid);
                    if (fs_1.default.existsSync(pth)) {
                        rimraf_1.default.sync(pth);
                    }
                });
                return resolve(query);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
module.exports = FileSystem;
