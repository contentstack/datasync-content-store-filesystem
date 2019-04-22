"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
