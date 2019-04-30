"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
exports.getPathKeys = (patternKeys, json) => {
    const pathKeys = [];
    for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
        if (patternKeys[i].charAt(0) === ':') {
            const k = patternKeys[i].substring(1);
            if (json[k]) {
                pathKeys.push(json[k]);
            }
            else {
                throw new TypeError(`The key ${pathKeys[i]} did not exist on ${JSON.stringify(json)}`);
            }
        }
        else {
            pathKeys.push(json[i]);
        }
    }
    return pathKeys;
    // return join.apply(this, pathKeys)
};
exports.removeUnwantedKeys = (keyDetails, json) => {
    for (let key in keyDetails) {
        if (keyDetails[key] && (key in json)) {
            delete json[key];
        }
    }
    return json;
};
exports.getFilePaths = (baseDir, fileKeys) => {
    let path;
    if (path_1.isAbsolute(baseDir)) {
        path = baseDir;
    }
    else {
        /**
         * 1. util
         * 2. src
         * 3. @contentstack
         * 4. node_modules
         * 5. app directory
         */
        path = path_1.resolve(path_1.join(__dirname, '..', '..', '..', '..', '..', baseDir));
    }
    return traverse(path, fileKeys);
};
const traverse = (path, keys, idx = 0, filePaths = [], bucket = {}) => {
    if (idx === (keys.length)) {
        filePaths.push(path);
        return {
            filePaths,
            bucket
        };
    }
    let dirContents = fs_1.readdirSync(path);
    dirContents = dirContents.map((name) => {
        const stat = fs_1.statSync(path_1.join(path, name));
        // get only directories
        /**
         * if
         *  name === keys[idx]
         * is not added, it would load all the files, that aren't supposed to be present either
         * on the other hand, if its a variable, there's no way of telling!
         */
        if (stat.isDirectory() || (idx === (keys.length - 1) && stat.isFile())) {
            return name;
        }
        return;
    });
    // remove false values
    dirContents = lodash_1.compact(dirContents);
    let key;
    if (keys[idx].charAt(0) === ':') {
        key = keys[idx].slice(1);
        /**
         * ex:
         *
         * {
         *    locale: ['en-us', 'en-gb']
         * }
         */
        if (key in bucket) {
            bucket[key] = bucket[key].concat(dirContents);
        }
        else {
            bucket[key] = dirContents;
        }
    }
    else {
        key = keys[idx];
    }
    idx++;
    dirContents.forEach((name) => {
        const subDirectoryPath = path_1.join(path, name);
        if (!(fs_1.existsSync(subDirectoryPath))) {
            return;
        }
        return traverse(subDirectoryPath, keys, idx, filePaths, bucket);
    });
    return { filePaths, bucket };
};
