"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLocalePath = exports.normalizeBaseDir = exports.removeUnwantedKeys = exports.getPathKeys = exports.filter = void 0;
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const path_1 = require("path");
const filterKeys = ['_content_type', '_checkpoint', '_type'];
const filter = (data) => {
    const result = {};
    for (const key in data) {
        if (filterKeys.indexOf(key) === -1) {
            result[key] = data[key];
        }
    }
    return result;
};
exports.filter = filter;
const getPathKeys = (patternKeys, json) => {
    const pathKeys = [];
    for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
        if (patternKeys[i].charAt(0) === ':') {
            let k = patternKeys[i].substring(1);
            const idx = k.indexOf('.json');
            if (~idx) {
                k = k.slice(0, idx);
            }
            if (json[k]) {
                pathKeys.push(json[k]);
            }
            else {
                throw new TypeError(`The key ${k} did not exist on ${JSON.stringify(json)}`);
            }
        }
        else {
            pathKeys.push(patternKeys[i]);
        }
    }
    return pathKeys;
};
exports.getPathKeys = getPathKeys;
const removeUnwantedKeys = (unwanted, json) => {
    for (const key in unwanted) {
        if (unwanted[key] && json.hasOwnProperty(key)) {
            delete json[key];
        }
    }
    return json;
};
exports.removeUnwantedKeys = removeUnwantedKeys;
const normalizeBaseDir = (config) => {
    if ((0, path_1.isAbsolute)(config.baseDir)) {
        if (!(0, fs_1.existsSync)(config.baseDir)) {
            (0, mkdirp_1.sync)(config.baseDir);
        }
    }
    else {
        const projectDir = (0, path_1.join)(__dirname, '..', '..', '..', '..', '..');
        const contentDir = (0, path_1.join)(projectDir, config.baseDir);
        if (!(0, fs_1.existsSync)(contentDir)) {
            (0, mkdirp_1.sync)(contentDir);
        }
    }
    return config;
};
exports.normalizeBaseDir = normalizeBaseDir;
const buildLocalePath = (appConfig) => {
    const localePath = (0, path_1.join)(appConfig.baseDir, appConfig.internal.locale);
    const localePathArr = localePath.split(path_1.sep);
    localePathArr.splice(localePathArr.length - 1);
    const localeFolderPath = path_1.join.apply(this, localePathArr);
    if (!(0, fs_1.existsSync)(localeFolderPath)) {
        (0, mkdirp_1.sync)(localeFolderPath);
    }
    return localePath;
};
exports.buildLocalePath = buildLocalePath;
