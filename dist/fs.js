"use strict";
/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
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
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = require("util");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const index_1 = require("./util/index");
const locale_management_1 = require("./util/locale-management");
const validations_1 = require("./util/validations");
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(write_file_atomic_1.default);
const debug = debug_1.debug('content-store-filesystem');
class FilesystemStore {
    constructor(assetStore, config) {
        this.assetStore = assetStore;
        this.config = config.contentStore;
        const baseDirKeys = [];
        baseDirKeys.push(this.config.baseDir);
        this.pattern = {};
        // unwanted keys
        this.unwanted = this.config.unwanted;
        // path keys for entry, assets & content types
        this.pattern.contentTypeKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.contentType.split('/')));
        this.pattern.entryKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.entry.split('/')));
        this.pattern.assetKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.asset.split('/')));
        this.pattern.localeKeys = baseDirKeys.concat(lodash_1.compact(this.config.internal.locales.split('/')));
    }
    publish(input) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validatePublishedObject(input);
                const localePath = path_1.join.apply(this, this.pattern.localeKeys);
                const locales = yield locale_management_1.readLocales(localePath);
                const indexOfLocale = locales.indexOf(input.locale);
                if (indexOfLocale === -1) {
                    locales.push(input.locale);
                    writeFile(localePath, JSON.stringify(locales), (err) => {
                        if (err) {
                            return reject(err);
                        }
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
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    unpublish(input) {
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateUnpublishedObject(input);
                if (input.content_type_uid === '_assets') {
                    return this.unpublishAsset(input)
                        .then(resolve)
                        .catch(reject);
                }
                return this.unpublishEntry(input).then(resolve).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    delete(input) {
        return new Promise((resolve, reject) => {
            try {
                if (input.content_type_uid === '_assets') {
                    return this.deleteAsset(input)
                        .then(resolve)
                        .catch(reject);
                }
                else if (input.content_type_uid === '_content_types') {
                    return this.deleteContentType(input)
                        .then(resolve)
                        .catch(reject);
                }
                return this.deleteEntry(input)
                    .then(resolve)
                    .catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    publishEntry(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const publishedEntry = lodash_1.cloneDeep(data);
                const entry = {
                    content_type_uid: publishedEntry.content_type_uid,
                    data: publishedEntry.data,
                    locale: publishedEntry.locale,
                    uid: publishedEntry.uid,
                };
                const contentType = {
                    content_type_uid: '_content_types',
                    data: publishedEntry.content_type,
                    locale: publishedEntry.locale,
                    uid: publishedEntry.content_type_uid,
                };
                const ctPathKeys = index_1.getPathKeys(this.pattern.contentTypeKeys, contentType);
                const ctPath = path_1.join.apply(this, ctPathKeys);
                ctPathKeys.splice(ctPathKeys.length - 1);
                const ctFolderPath = path_1.join.apply(this, ctPathKeys);
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys);
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                entry.data = index_1.removeUnwantedKeys(this.unwanted.entry, entry.data);
                contentType.data = index_1.removeUnwantedKeys(this.unwanted.contentType, contentType.data);
                if (fs_1.default.existsSync(ctFolderPath)) {
                    let entries;
                    if (fs_1.default.existsSync(entryPath)) {
                        const data = yield readFile(entryPath, 'utf-8');
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
                    }
                    else {
                        entries = [entry];
                    }
                    return writeFile(entryPath, JSON.stringify(entries), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return writeFile(ctPath, JSON.stringify(contentType), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(data);
                        });
                    });
                }
                mkdirp_1.default.sync(ctFolderPath);
                if (!(fs_1.default.existsSync(entryFolderPath))) {
                    mkdirp_1.default.sync(entryFolderPath);
                }
                // the content type prolly doesn't exist, thus the entry too does not exist!
                return writeFile(entryPath, JSON.stringify([entry]), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return writeFile(ctPath, JSON.stringify(contentType), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(data);
                    });
                });
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    publishAsset(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const punlishedAsset = lodash_1.cloneDeep(data);
                const asset = {
                    content_type_uid: punlishedAsset.content_type_uid,
                    data: punlishedAsset.data,
                    locale: punlishedAsset.locale,
                    uid: punlishedAsset.uid,
                };
                const assetPathKeys = index_1.getPathKeys(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys);
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                asset.data = index_1.removeUnwantedKeys(this.unwanted.asset, asset.data);
                if (fs_1.default.existsSync(assetFolderPath)) {
                    let assets;
                    const data = yield readFile(assetPath, 'utf-8');
                    assets = JSON.parse(data);
                    return new Promise((rs, rj) => {
                        let flag = false;
                        for (let i = 0, j = assets.length; i < j; i++) {
                            if (assets[i].uid === asset.uid) {
                                if (asset.data.hasOwnProperty('download_id')) {
                                    if (assets[i].data.download_id === asset.data.download_id) {
                                        assets[i] = asset;
                                        flag = true;
                                        break;
                                    }
                                }
                                else if (assets[i].data.hasOwnProperty('_version')) {
                                    assets[i] = asset;
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        return this.assetStore.download(asset.data)
                            .then((data) => {
                            if (!flag) {
                                asset.data = data;
                                assets.push(asset);
                            }
                            return rs();
                        })
                            .catch(rj);
                    })
                        .then(() => {
                        return writeFile(assetPath, JSON.stringify(assets), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(data);
                        });
                    });
                }
                mkdirp_1.default.sync(assetFolderPath);
                return this.assetStore.download(asset.data)
                    .then((data) => {
                    asset.data = data;
                    return writeFile(assetPath, JSON.stringify([asset]), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(data);
                    });
                });
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    unpublishAsset(asset) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const assetPathKeys = index_1.getPathKeys(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys);
                let assets;
                let object = [];
                if (fs_1.default.existsSync(assetPath)) {
                    const data = yield readFile(assetPath, 'utf-8');
                    assets = JSON.parse(data);
                    let flag = true;
                    return new Promise((rs, rj) => {
                        for (let i = 0; i < assets.length; i++) {
                            if (assets[i].uid === asset.uid) {
                                if (assets[i].data.hasOwnProperty('_version')) {
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
                                if (assets[i].data.hasOwnProperty('download_id') && (assets[i].data.url === object[0].data.url)) {
                                    flag = false;
                                    break;
                                }
                            }
                        }
                        if (!flag) {
                            return resolve(asset);
                        }
                        return this.assetStore.unpublish(object[0].data)
                            .then(rs)
                            .catch(rj);
                    }).then(() => {
                        writeFile(assetPath, JSON.stringify(assets), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(data);
                        });
                    });
                }
                return resolve(asset);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    unpublishEntry(entry) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys);
                let entries;
                if (fs_1.default.existsSync(entryPath)) {
                    const data = yield readFile(entryPath, 'utf-8');
                    entries = JSON.parse(data);
                    for (let i = 0, j = entries.length; i < j; i++) {
                        if (entries[i].uid === entry.uid) {
                            entries.splice(i, 1);
                            break;
                        }
                    }
                    return writeFile(entryPath, JSON.stringify(entries), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(entry);
                    });
                }
                return resolve(entry);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    deleteAsset(asset) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateEntryAssetDeletedObject(asset);
                const assetPathKeys = index_1.getPathKeys(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys);
                let assets;
                if (fs_1.default.existsSync(assetPath)) {
                    const data = yield readFile(assetPath, 'utf-8');
                    assets = JSON.parse(data);
                    let flag = true;
                    const bucket = [];
                    let object;
                    for (let i = 0; i < assets.length; i++) {
                        if (assets[i].uid === asset.uid) {
                            flag = true;
                            object = assets.splice(i, 1);
                            bucket.push(object[0].data);
                            i--;
                        }
                    }
                    if (!flag) {
                        return resolve(asset);
                    }
                    return this.assetStore.delete(bucket)
                        .then(() => {
                        writeFile(assetPath, JSON.stringify(assets), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            debug('asset deleted sucessfully');
                            return resolve(asset);
                        });
                    })
                        .catch(() => {
                        return reject(asset);
                    });
                }
                return reject(asset);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    deleteContentType(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateContentTypeDeletedObject(data);
                const ctPathKeys = this.pattern.contentTypeKeys;
                const localePath = path_1.join.apply(this, this.pattern.localeKeys);
                const locales = yield locale_management_1.readLocales(localePath);
                const localeKeyIndex = ctPathKeys.indexOf(':locale');
                const paths = [];
                ctPathKeys.splice(ctPathKeys.length - 1);
                locales.forEach((locale, index) => {
                    ctPathKeys[localeKeyIndex] = locale;
                    const ctFolderPathKeys = index_1.getPathKeys(ctPathKeys, data);
                    const ctFolderPath = path_1.join.apply(this, ctFolderPathKeys);
                    paths.push(ctFolderPath);
                    if (index === locales.length - 1) {
                        paths.forEach((path, pthIndex) => {
                            if (fs_1.default.existsSync(path)) {
                                rimraf_1.default.sync(path);
                            }
                            if (pthIndex === paths.length - 1) {
                                return resolve(data);
                            }
                        });
                    }
                });
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    deleteEntry(entry) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateEntryAssetDeletedObject(entry);
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys);
                let entries;
                if (fs_1.default.existsSync(entryPath)) {
                    const data = yield readFile(entryPath, 'utf-8');
                    entries = JSON.parse(data);
                    for (let i = 0, j = entries.length; i < j; i++) {
                        if (entries[i].uid === entry.uid) {
                            entries.splice(i, 1);
                            break;
                        }
                    }
                    return writeFile(entryPath, JSON.stringify(entries), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(entry);
                    });
                }
                return resolve(entry);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
}
exports.FilesystemStore = FilesystemStore;
