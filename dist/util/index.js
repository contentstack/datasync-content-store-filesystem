"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const path_1 = require("path");
const filterKeys = ['_content_type', '_checkpoint', '_type'];
exports.filter = (data) => {
    const result = {};
    for (const key in data) {
        if (filterKeys.indexOf(key) === -1) {
            result[key] = data[key];
        }
    }
    return result;
};
exports.getPathKeys = (patternKeys, json) => {
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
exports.removeUnwantedKeys = (unwanted, json) => {
    for (const key in unwanted) {
        if (unwanted[key] && json.hasOwnProperty(key)) {
            delete json[key];
        }
    }
    return json;
};
exports.normalizeBaseDir = (config) => {
    if (path_1.isAbsolute(config.baseDir)) {
        if (!fs_1.existsSync(config.baseDir)) {
            mkdirp_1.sync(config.baseDir);
        }
    }
    else {
        const projectDir = path_1.join(__dirname, '..', '..', '..', '..', '..');
        const contentDir = path_1.join(projectDir, config.baseDir);
        if (!fs_1.existsSync(contentDir)) {
            mkdirp_1.sync(contentDir);
        }
    }
    return config;
};
exports.buildLocalePath = (appConfig) => {
    const localePath = path_1.join(appConfig.baseDir, appConfig.internal.locale);
    const localePathArr = localePath.split(path_1.sep);
    localePathArr.splice(localePathArr.length - 1);
    const localeFolderPath = path_1.join.apply(this, localePathArr);
    if (!fs_1.existsSync(localeFolderPath)) {
        mkdirp_1.sync(localeFolderPath);
    }
    return localePath;
};
