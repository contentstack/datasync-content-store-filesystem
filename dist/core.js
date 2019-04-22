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
const util_1 = require("util");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(write_file_atomic_1.default);
const debug = debug_1.debug('content-store-filesystem');
class FilesystemStore {
    constructor(assetStore, config) {
        this.assetStore = assetStore;
        this.config = config.contentStore;
        const baseDirKeys = [];
        // unwanted keys
        this.unwanted = this.config.unwanted;
        // path keys for entry, assets & content types
        this.pattern.contentTypeKeys = baseDirKeys.concat(lodash_1.compact(this.config.pattern.contentType.split('/')));
        this.pattern.entryKeys = baseDirKeys.concat(lodash_1.compact(this.config.pattern.entry.split('/')));
        this.pattern.assetKeys = baseDirKeys.concat(lodash_1.compact(this.config.pattern.asset.split('/')));
    }
    publish(input) {
        return new Promise((resolve, reject) => {
            try {
                validations_1.validatePublishedObject(input);
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
                    uid: publishedEntry.uid
                };
                const contentType = {
                    content_type_uid: '_content_types',
                    data: publishedEntry.content_type,
                    locale: publishedEntry.locale,
                    uid: publishedEntry.content_type_uid
                };
                const ctPathKeys = index_1.getPathKeys(this.pattern.contentTypeKeys, contentType);
                const ctPath = path_1.join.apply(this, ctPathKeys);
                ctPathKeys.splice(ctPathKeys.length - 1);
                const ctFolderPath = path_1.join.apply(this, ctPathKeys);
                const entryPathKeys = index_1.getPathKeys(this.pattern.entry, entry);
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
                    return writeFile(entryPath, JSON.stringify(entries))
                        .then(() => {
                        return writeFile(ctPath, JSON.stringify(contentType));
                    })
                        .then(resolve)
                        .catch(reject);
                }
                mkdirp_1.default.sync(ctFolderPath);
                if (!(fs_1.default.existsSync(entryFolderPath))) {
                    mkdirp_1.default.sync(entryFolderPath);
                }
                // the content type prolly doesn't exist, thus the entry too does not exist!
                return writeFile(entryPath, JSON.stringify(entry))
                    .then(() => {
                    return writeFile(ctPath, JSON.stringify(contentType));
                })
                    .then(resolve)
                    .catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    publishAsset(asset) {
        return new Promise((resolve, reject) => {
        });
    }
    unpublish(input) {
        return new Promise((resolve, reject) => {
        });
    }
    delete(input) {
        return new Promise((resolve, reject) => {
        });
    }
}
exports.FilesystemStore = FilesystemStore;
