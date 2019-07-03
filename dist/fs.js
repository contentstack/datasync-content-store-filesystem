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
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const mkdirp_1 = __importDefault(require("mkdirp"));
const fs_2 = require("./util/fs");
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = debug_1.debug('core-fs');
class FilesystemStore {
    constructor(assetStore, config) {
        this.assetStore = assetStore;
        this.config = config.contentStore;
        const baseDirKeys = this.config.baseDir.split(path_1.sep);
        this.pattern = {};
        // unwanted keys
        this.unwanted = this.config.unwanted;
        // path keys for entry, assets & content types
        // splitting it by '/' instead of ':/', as we need to know if its a pattern not not, further down the line
        this.pattern.contentTypeKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.contentType.split('/')));
        this.pattern.entryKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.entry.split('/')));
        this.pattern.assetKeys = baseDirKeys.concat(lodash_1.compact(this.config.patterns.asset.split('/')));
        this.localePath = index_1.buildLocalePath(this.config.internal.locale, this.config);
    }
    publish(input) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validatePublishedObject(input);
                if (fs_1.existsSync(this.localePath)) {
                    // if its a new locale, keep track!
                    const data = yield fs_2.readFile(this.localePath, 'utf-8');
                    const locales = JSON.parse(data);
                    const idx = locales.indexOf(input.locale);
                    if (idx === -1) {
                        locales.unshift(input.locale);
                        // removing async - background op!
                        yield fs_2.writeFile(this.localePath, JSON.stringify(locales));
                    }
                }
                else {
                    yield fs_2.writeFile(this.localePath, JSON.stringify([input.locale]));
                }
                if (input._content_type_uid === '_assets') {
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
                if (input._content_type_uid === '_assets') {
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
                if (input._content_type_uid === '_assets') {
                    return this.deleteAsset(input)
                        .then(resolve)
                        .catch(reject);
                }
                else if (input._content_type_uid === '_content_types') {
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
                let entry = lodash_1.cloneDeep(data);
                entry = index_1.filter(entry); // to remove _content_type and checkpoint from entry data
                // to get entry folder path
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                entry = index_1.removeUnwantedKeys(this.unwanted.entry, entry);
                if (fs_1.existsSync(entryFolderPath)) {
                    if (fs_1.existsSync(entryPath)) {
                        // entry file exists!
                        const data = yield fs_2.readFile(entryPath, 'utf-8');
                        const entries = JSON.parse(data);
                        // use this to save writes
                        let entryUpdated = false;
                        for (let i = 0, j = entries.length; i < j; i++) {
                            if (entries[i].uid === entry.uid && entries[i].locale === entry.locale) {
                                entries[i] = entry;
                                entryUpdated = true;
                                break;
                            }
                        }
                        if (!entryUpdated) {
                            entries.unshift(entry);
                        }
                        yield fs_2.writeFile(entryPath, JSON.stringify(entries));
                    }
                    else {
                        // entry file does not exist
                        yield fs_2.writeFile(entryPath, JSON.stringify([entry]));
                    }
                }
                else {
                    // entry folder does not exist!
                    mkdirp_1.default.sync(entryFolderPath);
                    yield fs_2.writeFile(entryPath, JSON.stringify([entry]));
                }
                return resolve(entry);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    updateContentType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let schema = lodash_1.cloneDeep(data);
            validations_1.validateContentTypeDeletedObject(schema);
            schema = index_1.removeUnwantedKeys(this.unwanted.contentType, data);
            const contentTypePathKeys = index_1.getPathKeys(this.pattern.contentTypeKeys, data);
            const contentTypePath = path_1.join.apply(this, contentTypePathKeys) + '.json';
            if (fs_1.existsSync(contentTypePath)) {
                const content = yield fs_2.readFile(contentTypePath, 'utf-8');
                const jsonData = JSON.parse(content);
                // for time being, keeping things simple
                // all schemas in one file
                let contentTypeUpdated = false;
                for (let i = 0, j = jsonData.length; i < j; i++) {
                    if (jsonData[i].uid === data.uid) {
                        jsonData[i] = data;
                        contentTypeUpdated = true;
                        break;
                    }
                }
                if (!contentTypeUpdated) {
                    jsonData.unshift(data);
                }
                yield fs_2.writeFile(contentTypePath, JSON.stringify(jsonData));
            }
            else {
                contentTypePathKeys.splice(contentTypePathKeys.length - 1);
                const contentTypeFolderPath = path_1.join.apply(contentTypePathKeys);
                mkdirp_1.default.sync(contentTypeFolderPath);
                yield fs_2.writeFile(contentTypePath, JSON.stringify([schema]));
            }
            return schema;
        });
    }
    publishAsset(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let asset = lodash_1.cloneDeep(data);
                // to get asset folder path 
                const assetPathKeys = index_1.getPathKeys(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                // to remove unwanted keys and change structure
                asset = index_1.removeUnwantedKeys(this.unwanted.asset, asset);
                if (asset.hasOwnProperty('_version')) {
                    // unpublish the published version of asset
                    yield this.unpublishAsset(asset);
                }
                asset = yield this.assetStore.download(asset);
                if (fs_1.existsSync(assetFolderPath)) {
                    if (fs_1.existsSync(assetPath)) {
                        const contents = yield fs_2.readFile(assetPath, 'utf-8');
                        let assets = JSON.parse(contents);
                        if (asset.hasOwnProperty('_version')) {
                            assets.unshift(asset);
                            yield fs_2.writeFile(assetPath, JSON.stringify(assets));
                        }
                        else {
                            let rteMarkdownExists = false;
                            for (let i = 0, j = assets.length; i < j; i++) {
                                if (assets[i].download_id === asset.download_id) {
                                    rteMarkdownExists = true;
                                    break;
                                }
                            }
                            if (!rteMarkdownExists) {
                                assets.unshift(asset);
                                yield fs_2.writeFile(assetPath, JSON.stringify(assets));
                            }
                        }
                    }
                    else {
                        yield fs_2.writeFile(assetPath, JSON.stringify([asset]));
                    }
                }
                else {
                    // create folder, if it does not exist!
                    mkdirp_1.default.sync(assetFolderPath);
                    yield fs_2.writeFile(assetPath, JSON.stringify([data]));
                }
                return resolve(asset);
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
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                if (fs_1.existsSync(assetPath)) {
                    const data = yield fs_2.readFile(assetPath);
                    const assets = JSON.parse(data);
                    // will help in saving un-necessary writes
                    let unpublishedAsset = false;
                    let rteAsset = false;
                    let removedAsset;
                    for (let i = 0, j = assets.length; i < j; i++) {
                        if (assets[i].uid === asset.uid) {
                            if (assets[i].hasOwnProperty('_version')) {
                                // remove the matching asset
                                removedAsset = assets.splice(i, 1)[0];
                                unpublishedAsset = true;
                                i--;
                                j--;
                            }
                            else if (assets[i].hasOwnProperty('download_id')) {
                                rteAsset = true;
                            }
                        }
                    }
                    // decide, if the on-premise media file is to be removed
                    if (unpublishedAsset && !(rteAsset)) {
                        yield this.assetStore.unpublish(removedAsset);
                    }
                    // if any asset object has been removed, only then write to disk
                    if (unpublishedAsset) {
                        yield fs_2.writeFile(assetPath, JSON.stringify(assets));
                    }
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
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                if (fs_1.existsSync(entryFolderPath)) {
                    if (fs_1.existsSync(entryPath)) {
                        const data = yield fs_2.readFile(entryPath, 'utf-8');
                        const entries = JSON.parse(data);
                        let entryUnpublished = false;
                        for (let i = 0, j = entries.length; i < j; i++) {
                            if (entries[i].uid === entry.uid) {
                                entries.splice(i, 1);
                                entryUnpublished = true;
                                break;
                            }
                        }
                        if (entryUnpublished) {
                            yield fs_2.writeFile(entryPath, JSON.stringify(entries));
                        }
                    }
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
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                if (fs_1.existsSync(assetPath)) {
                    const data = yield fs_2.readFile(assetPath, 'utf-8');
                    const assets = JSON.parse(data);
                    let assetsRemoved = false;
                    const bucket = [];
                    for (let i = 0, j = assets.length; i < j; i++) {
                        if (assets[i].uid === asset.uid) {
                            assetsRemoved = true;
                            bucket.unshift(assets.splice(i, 1)[0]);
                            i--;
                            j--;
                        }
                    }
                    if (!assetsRemoved) {
                        return resolve(asset);
                    }
                    return this.assetStore.delete(bucket)
                        .then(() => fs_2.writeFile(assetPath, JSON.stringify(assets)))
                        .then(() => resolve(asset))
                        .catch(reject);
                }
                return resolve(asset);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    deleteContentType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            validations_1.validateContentTypeDeletedObject(data);
            const content = yield fs_2.readFile(this.localePath, 'utf-8');
            const locales = JSON.parse(content);
            return Promise
                .all([this.deleteSchema(data, locales), this.deleteAllEntries(data, locales)])
                .then(() => console.log('Content type deleted successfully!\n', JSON.stringify(data)));
        });
    }
    deleteAllEntries(data, locales) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = data.uid;
            for (let i = 0, j = locales.length; i < j; i++) {
                const locale = locales[i];
                const deleteContentTypeObject = {
                    _content_type_uid: uid,
                    locale,
                };
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, deleteContentTypeObject);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                if (fs_1.existsSync(entryPath)) {
                    const contents = yield fs_2.readFile(entryPath, 'utf-8');
                    // its possible to put all entries in one file
                    const entries = JSON.parse(contents);
                    for (let k = 0, l = entries.length; k < l; k++) {
                        if (entries[k]._content_type_uid === uid) {
                            entries.splice(k, 1);
                            k--;
                            l--;
                        }
                    }
                    yield fs_2.writeFile(entryPath, JSON.stringify(entries));
                }
            }
            return;
        });
    }
    deleteSchema(data, locales) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0, j = locales.length; i < j; i++) {
                const locale = locales[i];
                const deleteContentTypeObject = {
                    _content_type_uid: '_content_types',
                    locale,
                    uid: data.uid
                };
                const contentTypePathKeys = index_1.getPathKeys(this.pattern.contentTypeKeys, deleteContentTypeObject);
                const contentTypePath = path_1.join.apply(this, contentTypePathKeys) + '.json';
                if (fs_1.existsSync(contentTypePath)) {
                    const content = yield fs_2.readFile(contentTypePath, 'utf-8');
                    const jsonData = JSON.parse(content);
                    if (jsonData instanceof Array) {
                        for (let i = 0, j = jsonData.length; i < j; i++) {
                            if (jsonData[i].uid === data.uid) {
                                jsonData.splice(i, 1);
                                break;
                            }
                        }
                        yield fs_2.writeFile(contentTypePath, JSON.stringify(jsonData));
                    }
                    else {
                        fs_1.unlinkSync(contentTypePath);
                    }
                }
            }
            return;
        });
    }
    deleteEntry(entry) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateEntryAssetDeletedObject(entry);
                const entryPathKeys = index_1.getPathKeys(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                if (fs_1.existsSync(entryPath)) {
                    const data = yield fs_2.readFile(entryPath, 'utf-8');
                    const entries = JSON.parse(data);
                    let entryDeleted = false;
                    for (let i = 0, j = entries.length; i < j; i++) {
                        if (entries[i].uid === entry.uid) {
                            entries.splice(i, 1);
                            entryDeleted = true;
                            break;
                        }
                    }
                    if (entryDeleted) {
                        yield fs_2.writeFile(entryPath, JSON.stringify(entries));
                    }
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
