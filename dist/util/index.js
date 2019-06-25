"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            const k = patternKeys[i].substring(1);
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
