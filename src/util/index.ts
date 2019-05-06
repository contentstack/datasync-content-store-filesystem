// import { existsSync, readdirSync, statSync } from 'fs'
// import { compact } from 'lodash'
// import { isAbsolute, join, resolve } from 'path'

export const getPathKeys = (patternKeys, json) => {
  const pathKeys = [];
  for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
    if (patternKeys[i].charAt(0) === ':') {
      const k = patternKeys[i].substring(1);
      if (json[k]) {
        pathKeys.push(json[k]);
      } else {
        throw new TypeError(`The key ${pathKeys[i]} did not exist on ${JSON.stringify(json)}`);
      }
    } else {
      pathKeys.push(patternKeys[i]);
    }
  }
  return pathKeys;
  // return join.apply(this, pathKeys)
};

export const removeUnwantedKeys = (keyDetails, json) => {
  for (const key in keyDetails) {
    if (keyDetails[key] && (key in json)) {
      delete json[key];
    }
  }

  return json;
};
