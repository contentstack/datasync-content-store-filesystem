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
const rimraf_1 = __importDefault(require("rimraf"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const fs_2 = require("./util/fs");
const index_1 = require("./util/index");
const locale_management_1 = require("./util/locale-management");
const validations_1 = require("./util/validations");
const debug = debug_1.debug('core-fs');
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
                    // async - background operation!
                    fs_2.writeFile(localePath, JSON.stringify(locales), (err) => {
                        if (err) {
                            return reject(err);
                        }
                    });
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
                const entryPath = path_1.join.apply(this, entryPathKeys);
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
                            entries.push(entry);
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
    publishAsset(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let asset = lodash_1.cloneDeep(data);
                // to get asset folder path 
                const assetPathKeys = index_1.getPathKeys(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys);
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                // to remove unwanted keys and change structure
                asset = index_1.removeUnwantedKeys(this.unwanted.asset, asset);
                // unpublish the published version of asset
                yield this.unpublishAsset(asset);
                asset = yield this.assetStore.download(asset);
                if (fs_1.existsSync(assetFolderPath)) {
                    if (fs_1.existsSync(assetPath)) {
                        const data = yield fs_2.readFile(assetPath, 'utf-8');
                        const assets = JSON.parse(data);
                        assets.push(asset);
                        yield fs_2.writeFile(assetPath, JSON.stringify(assets));
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
                const assetPath = path_1.join.apply(this, assetPathKeys);
                if (fs_1.existsSync(assetPath)) {
                    const data = yield fs_2.readFile(assetPath, 'utf-8');
                    const assets = JSON.parse(data);
                    // will help in saving un-necessary writes
                    let unpublishedAsset = false;
                    let rteAsset = false;
                    let removedAsset;
                    for (let i = 0, j = assets.length; i < j; i++) {
                        if (assets[i].hasOwnProperty('_version')) {
                            // remove the matching asset
                            removedAsset = assets.splice(i, 1)[0];
                            unpublishedAsset = true;
                            i--;
                        }
                        else if (assets[i].hasOwnProperty('download_id')) {
                            rteAsset = true;
                        }
                    }
                    if (unpublishedAsset && !(rteAsset)) {
                        yield this.assetStore.unpublish(removedAsset);
                    }
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
                const entryPath = path_1.join.apply(this, entryPathKeys);
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                let entries;
                if (fs_1.existsSync(entryFolderPath)) {
                    if (fs_1.existsSync(entryPath)) {
                        const data = yield fs_2.readFile(entryPath, 'utf-8');
                        let entryUnpublished = false;
                        entries = JSON.parse(data);
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
                const assetPath = path_1.join.apply(this, assetPathKeys);
                let assets;
                if (fs_1.existsSync(assetPath)) {
                    const data = yield fs_2.readFile(assetPath, 'utf-8');
                    assets = JSON.parse(data);
                    let assetsRemoved = false;
                    const bucket = [];
                    for (let i = 0, j = assets.length; i < j; i++) {
                        if (assets[i].uid === asset.uid) {
                            assetsRemoved = true;
                            bucket.push(assets.splice(i, 1)[0]);
                            i--;
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateContentTypeDeletedObject(data);
                const ctPathKeys = this.pattern.contentTypeKeys;
                const localePath = path_1.join.apply(this, this.pattern.localeKeys);
                const locales = yield locale_management_1.readLocales(localePath);
                const localeKeyIndex = ctPathKeys.indexOf(':locale');
                const paths = [];
                ctPathKeys.splice(ctPathKeys.length - 1)(locales).forEach((locale, index) => {
                    ctPathKeys[localeKeyIndex] = locale;
                    const ctFolderPathKeys = index_1.getPathKeys(ctPathKeys, data);
                    const ctFolderPath = path_1.join.apply(this, ctFolderPathKeys);
                    paths.push(ctFolderPath);
                    if (index === locales.length - 1) {
                        paths.forEach((path) => {
                            if (fs_1.existsSync(path)) {
                                rimraf_1.default.sync(path);
                            }
                        });
                    }
                });
                return resolve(data);
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
                if (fs_1.existsSync(entryPath)) {
                    const data = yield fs_2.readFile(entryPath, 'utf-8');
                    entries = JSON.parse(data);
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
