"use strict";
/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesystemStore = void 0;
const debug_1 = require("debug");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const fs_2 = require("./util/fs");
const get_file_fields_1 = require("./util/get-file-fields");
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = (0, debug_1.debug)('core-fs');
class FilesystemStore {
    constructor(assetStore, config) {
        this.assetStore = assetStore;
        this.config = config.contentStore;
        const baseDirKeys = this.config.baseDir.split(path_1.sep);
        this.pattern = {};
        this.unwanted = this.config.unwanted;
        if (config.contentstack.branch) {
            this.pattern.contentTypeKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patternsWithBranch.contentType.split('/')));
            this.pattern.entryKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patternsWithBranch.entry.split('/')));
            this.pattern.assetKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patternsWithBranch.asset.split('/')));
        }
        else {
            this.pattern.contentTypeKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patterns.contentType.split('/')));
            this.pattern.entryKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patterns.entry.split('/')));
            this.pattern.assetKeys = baseDirKeys.concat((0, lodash_1.compact)(this.config.patterns.asset.split('/')));
        }
        this.localePath = (0, index_1.buildLocalePath)(this.config);
    }
    publish(input) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                debug(`Publishing ${JSON.stringify(input)}`);
                (0, validations_1.validatePublishedObject)(input);
                if ((0, fs_1.existsSync)(this.localePath)) {
                    const data = yield (0, fs_2.readFile)(this.localePath, 'utf-8');
                    const locales = JSON.parse(data);
                    const idx = locales.indexOf(input.locale);
                    if (idx === -1) {
                        locales.unshift(input.locale);
                        yield (0, fs_2.writeFile)(this.localePath, JSON.stringify(locales));
                    }
                }
                else {
                    yield (0, fs_2.writeFile)(this.localePath, JSON.stringify([input.locale]));
                }
                if (input._content_type_uid === '_assets') {
                    return this.publishAsset(input)
                        .then(resolve)
                        .catch(reject);
                }
                const [publishEntryResult] = yield Promise.all([this.publishEntry(input), this.updateAssetReferences(input, input._content_type)]);
                return resolve(publishEntryResult);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    unpublish(input) {
        return new Promise((resolve, reject) => {
            try {
                (0, validations_1.validateUnpublishedObject)(input);
                if (input._content_type_uid === '_assets') {
                    return this.unpublishAsset(input)
                        .then(resolve)
                        .catch(reject);
                }
                return this.unpublishEntry(input)
                    .then(resolve)
                    .catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    delete(input) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let output;
                if (input._content_type_uid === '_assets') {
                    output = yield this.deleteAsset(input);
                }
                else if (input._content_type_uid === '_content_types') {
                    output = yield this.deleteContentType(input);
                }
                else {
                    output = yield this.deleteEntry(input);
                }
                return resolve(output);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    updateContentType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let schema = (0, lodash_1.cloneDeep)(data);
            (0, validations_1.validateContentTypeDeletedObject)(schema);
            schema = (0, index_1.removeUnwantedKeys)(this.unwanted.contentType, data);
            const contentTypePathKeys = (0, index_1.getPathKeys)(this.pattern.contentTypeKeys, data);
            const contentTypePath = path_1.join.apply(this, contentTypePathKeys) + '.json';
            if ((0, fs_1.existsSync)(contentTypePath)) {
                const content = yield (0, fs_2.readFile)(contentTypePath, 'utf-8');
                const jsonData = JSON.parse(content);
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
                yield (0, fs_2.writeFile)(contentTypePath, JSON.stringify(jsonData));
            }
            else {
                contentTypePathKeys.splice(contentTypePathKeys.length - 1);
                const contentTypeFolderPath = path_1.join.apply(contentTypePathKeys);
                mkdirp_1.default.sync(contentTypeFolderPath);
                yield (0, fs_2.writeFile)(contentTypePath, JSON.stringify([schema]));
            }
            return schema;
        });
    }
    publishAsset(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let asset = (0, lodash_1.cloneDeep)(data);
                const assetPathKeys = (0, index_1.getPathKeys)(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                asset = (0, index_1.removeUnwantedKeys)(this.unwanted.asset, asset);
                if (asset.hasOwnProperty('_version')) {
                    yield this.unpublishAsset(asset);
                }
                asset = yield this.assetStore.download(asset);
                if ((0, fs_1.existsSync)(assetFolderPath)) {
                    if ((0, fs_1.existsSync)(assetPath)) {
                        const contents = yield (0, fs_2.readFile)(assetPath, 'utf-8');
                        const assets = JSON.parse(contents);
                        if (asset.hasOwnProperty('_version')) {
                            assets.unshift(asset);
                            yield (0, fs_2.writeFile)(assetPath, JSON.stringify(assets));
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
                                yield (0, fs_2.writeFile)(assetPath, JSON.stringify(assets));
                            }
                        }
                    }
                    else {
                        yield (0, fs_2.writeFile)(assetPath, JSON.stringify([asset]));
                    }
                }
                else {
                    mkdirp_1.default.sync(assetFolderPath);
                    yield (0, fs_2.writeFile)(assetPath, JSON.stringify([data]));
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
                const assetPathKeys = (0, index_1.getPathKeys)(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                if ((0, fs_1.existsSync)(assetPath)) {
                    const data = yield (0, fs_2.readFile)(assetPath);
                    const assets = JSON.parse(data);
                    let unpublishedAsset = false;
                    let rteAsset = false;
                    let removedAsset;
                    for (let i = 0, j = assets.length; i < j; i++) {
                        if (assets[i].uid === asset.uid) {
                            if (assets[i].hasOwnProperty('_version')) {
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
                    if (unpublishedAsset && !(rteAsset)) {
                        yield this.assetStore.unpublish(removedAsset);
                    }
                    if (unpublishedAsset) {
                        yield Promise.all([(0, fs_2.writeFile)(assetPath, JSON.stringify(assets)), this.updateDeletedAssetReferences(asset)]);
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
                const entryPathKeys = (0, index_1.getPathKeys)(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                if ((0, fs_1.existsSync)(entryFolderPath)) {
                    if ((0, fs_1.existsSync)(entryPath)) {
                        const data = yield (0, fs_2.readFile)(entryPath, 'utf-8');
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
                            yield (0, fs_2.writeFile)(entryPath, JSON.stringify(entries));
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
                (0, validations_1.validateEntryAssetDeletedObject)(asset);
                const assetPathKeys = (0, index_1.getPathKeys)(this.pattern.assetKeys, asset);
                const assetPath = path_1.join.apply(this, assetPathKeys) + '.json';
                if ((0, fs_1.existsSync)(assetPath)) {
                    const data = yield (0, fs_2.readFile)(assetPath, 'utf-8');
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
                    this.updateDeletedAssetReferences(asset).catch(reject);
                    return this.assetStore.delete(bucket)
                        .then(() => (0, fs_2.writeFile)(assetPath, JSON.stringify(assets)))
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
            (0, validations_1.validateContentTypeDeletedObject)(data);
            const content = yield (0, fs_2.readFile)(this.localePath, 'utf-8');
            const locales = JSON.parse(content);
            return Promise
                .all([this.deleteSchema(data, locales), this.deleteAllEntries(data, locales)])
                .then(() => {
                return data;
            });
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
                const entryPathKeys = (0, index_1.getPathKeys)(this.pattern.entryKeys, deleteContentTypeObject);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                if ((0, fs_1.existsSync)(entryPath)) {
                    const contents = yield (0, fs_2.readFile)(entryPath, 'utf-8');
                    const entries = JSON.parse(contents);
                    for (let k = 0, l = entries.length; k < l; k++) {
                        if (entries[k]._content_type_uid === uid) {
                            entries.splice(k, 1);
                            k--;
                            l--;
                        }
                    }
                    yield (0, fs_2.writeFile)(entryPath, JSON.stringify(entries));
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
                    uid: data.uid,
                    branch: data.branch
                };
                const contentTypePathKeys = (0, index_1.getPathKeys)(this.pattern.contentTypeKeys, deleteContentTypeObject);
                const contentTypePath = path_1.join.apply(this, contentTypePathKeys) + '.json';
                if ((0, fs_1.existsSync)(contentTypePath)) {
                    const content = yield (0, fs_2.readFile)(contentTypePath, 'utf-8');
                    const jsonData = JSON.parse(content);
                    if (jsonData instanceof Array) {
                        for (let k = 0, m = jsonData.length; k < m; k++) {
                            if (jsonData[k].uid === data.uid) {
                                jsonData.splice(k, 1);
                                break;
                            }
                        }
                        yield (0, fs_2.writeFile)(contentTypePath, JSON.stringify(jsonData));
                    }
                    else {
                        (0, fs_1.unlinkSync)(contentTypePath);
                    }
                }
            }
            return;
        });
    }
    deleteEntry(entry) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validations_1.validateEntryAssetDeletedObject)(entry);
                const entryPathKeys = (0, index_1.getPathKeys)(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                if ((0, fs_1.existsSync)(entryPath)) {
                    const data = yield (0, fs_2.readFile)(entryPath, 'utf-8');
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
                        yield (0, fs_2.writeFile)(entryPath, JSON.stringify(entries));
                    }
                }
                return resolve(entry);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    publishEntry(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let entry = (0, lodash_1.cloneDeep)(data);
                entry = (0, index_1.filter)(entry);
                const entryPathKeys = (0, index_1.getPathKeys)(this.pattern.entryKeys, entry);
                const entryPath = path_1.join.apply(this, entryPathKeys) + '.json';
                entryPathKeys.splice(entryPathKeys.length - 1);
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                entry = (0, index_1.removeUnwantedKeys)(this.unwanted.entry, entry);
                if ((0, fs_1.existsSync)(entryFolderPath)) {
                    if ((0, fs_1.existsSync)(entryPath)) {
                        const contents = yield (0, fs_2.readFile)(entryPath, 'utf-8');
                        const entries = JSON.parse(contents);
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
                        yield (0, fs_2.writeFile)(entryPath, JSON.stringify(entries));
                    }
                    else {
                        yield (0, fs_2.writeFile)(entryPath, JSON.stringify([entry]));
                    }
                }
                else {
                    mkdirp_1.default.sync(entryFolderPath);
                    yield (0, fs_2.writeFile)(entryPath, JSON.stringify([entry]));
                }
                return resolve(entry);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    updateAssetReferences(data, schema) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileFieldPaths = (0, get_file_fields_1.getFileFieldPaths)(schema);
                const assetPathKeys = (0, index_1.getPathKeys)(this.pattern.assetKeys, { locale: data.publish_details ? data.publish_details.locale : data.locale, branch: data.branch });
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                let assetMap = yield (0, fs_2.readFile)(assetFolderPath + '/asset_map.json', 'utf-8');
                try {
                    assetMap = JSON.parse(assetMap);
                    if (Array.isArray(assetMap)) {
                        assetMap = {};
                    }
                }
                catch (error) {
                    assetMap = {};
                }
                const entryData = {
                    uid: data.uid,
                    contentTypeUid: data._content_type_uid,
                    locale: data.publish_details ? data.publish_details.locale : data.locale,
                    branch: data.branch,
                };
                for (const fileFieldPath of fileFieldPaths) {
                    this._getAssetFieldsHelper(data, fileFieldPath.split('.'), 0, assetMap, entryData);
                }
                yield (0, fs_2.writeFile)(assetFolderPath + '/asset_map.json', JSON.stringify(assetMap));
                return resolve(assetFolderPath);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    updateDeletedAssetReferences(asset) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const assetPathKeys = (0, index_1.getPathKeys)(this.pattern.assetKeys, { locale: asset.publish_details ? asset.publish_details.locale : asset.locale, branch: asset.branch });
                assetPathKeys.splice(assetPathKeys.length - 1);
                const assetFolderPath = path_1.join.apply(this, assetPathKeys);
                let assetMap = yield (0, fs_2.readFile)(assetFolderPath + '/asset_map.json', 'utf-8');
                try {
                    assetMap = JSON.parse(assetMap);
                    if (Array.isArray(assetMap)) {
                        assetMap = {};
                    }
                }
                catch (error) {
                    assetMap = {};
                }
                if (!assetMap[asset.uid]) {
                    return resolve({});
                }
                const entries = assetMap[asset.uid];
                for (const entry of entries) {
                    this._updateEntryAssetReference(entry, asset.uid);
                }
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    _getAssetFieldsHelper(data, fileFieldPathArray, index, assetFieldMap, entryData) {
        if (fileFieldPathArray.length <= index) {
            if (Array.isArray(data)) {
                for (const d of data) {
                    if (!assetFieldMap[d]) {
                        assetFieldMap[d] = [];
                    }
                    assetFieldMap[d].push(Object.assign({ path: fileFieldPathArray }, entryData));
                }
            }
            else {
                if (!assetFieldMap[data]) {
                    assetFieldMap[data] = [];
                }
                assetFieldMap[data].push(Object.assign({ path: fileFieldPathArray }, entryData));
            }
            return;
        }
        if (Array.isArray(data)) {
            for (const d of data) {
                this._getAssetFieldsHelper(d, fileFieldPathArray, index + 1, assetFieldMap, entryData);
            }
        }
        else {
            if (data[fileFieldPathArray[index]]) {
                this._getAssetFieldsHelper(data[fileFieldPathArray[index]], fileFieldPathArray, index + 1, assetFieldMap, entryData);
            }
        }
    }
    _updateEntryAssetReference(data, assetId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entryPathKeys = (0, index_1.getPathKeys)(this.pattern.entryKeys, Object.assign(Object.assign({}, data), { _content_type_uid: data.contentTypeUid }));
                const entryFolderPath = path_1.join.apply(this, entryPathKeys);
                let entries = yield (0, fs_2.readFile)(entryFolderPath + '.json', 'utf-8');
                entries = JSON.parse(entries);
                let _entry;
                for (const entry of entries) {
                    if (entry.uid === data.uid) {
                        _entry = entry;
                        break;
                    }
                }
                if (_entry) {
                    this._nullifyDeletedAssetField(_entry, data.path, 0, assetId);
                    yield (0, fs_2.writeFile)(entryFolderPath + '.json', JSON.stringify(entries));
                }
                return resolve(entries);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    _nullifyDeletedAssetField(data, fileFieldPathArray, index, assetId) {
        if (fileFieldPathArray.length - 1 <= index) {
            if (Array.isArray(data[fileFieldPathArray[index]])) {
                const _d = data[fileFieldPathArray[index]];
                for (let i = 0; i < _d.length; i++) {
                    if (_d[i] === assetId) {
                        _d[i] = null;
                    }
                }
            }
            else {
                if (data[fileFieldPathArray[index]] === assetId) {
                    data[fileFieldPathArray[index]] = null;
                }
            }
            return;
        }
        if (Array.isArray(data)) {
            for (const d of data) {
                this._nullifyDeletedAssetField(d, fileFieldPathArray, index + 1, assetId);
            }
        }
        else {
            if (data[fileFieldPathArray[index]]) {
                this._nullifyDeletedAssetField(data[fileFieldPathArray[index]], fileFieldPathArray, index + 1, assetId);
            }
        }
    }
}
exports.FilesystemStore = FilesystemStore;
