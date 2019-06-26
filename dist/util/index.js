"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const path_1 = require("path");
const filterKeys = ['_content_type', 'checkpoint', 'type'];
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
                throw new TypeError(`The key ${pathKeys[i]} did not exist on ${JSON.stringify(json)}`);
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
exports.buildLocalePath = (path, appConfig) => {
    if (path_1.isAbsolute(path)) {
        const pathArr = path.split();
        // remove last elem
        pathArr.splice(path.length - 1, 0);
        const localeFolderPath = path_1.join.apply(this, pathArr);
        if (!fs_1.existsSync(localeFolderPath)) {
            mkdirp_1.sync(localeFolderPath);
        }
        return path_1.resolve(path);
    }
    const localePath = path_1.join(appConfig.baseDir, appConfig.internal.locale);
    const localePathArr = localePath.split(path_1.sep);
    localePathArr.splice(localePathArr.length - 1);
    const localeFolderPath = path_1.join.apply(this, localePathArr);
    if (!fs_1.existsSync(localeFolderPath)) {
        mkdirp_1.sync(localeFolderPath);
    }
    return localePath;
};
