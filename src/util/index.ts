// import { existsSync, readdirSync, statSync } from 'fs'
// import { compact } from 'lodash'
// import { isAbsolute, join, resolve } from 'path'
import { cloneDeep, hasIn, merge } from 'lodash'
import { config } from '../index'

const filterKeys = ['_content_type', 'checkpoint', 'type']
export const filter: any = (data) => {
  const result = {};
  for (const key in data) {
    if (filterKeys.indexOf(key) === -1) {
      result[key] = data[key];
    }
  }
  return result;
};

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


export const structuralChanges = (entity) => {
  const contentStore = config.contentStore
  const indexedKeys = contentStore.indexedKeys
  if (indexedKeys && typeof indexedKeys === 'object' && Object.keys(indexedKeys).length) {
    let clone = cloneDeep(entity)
    // const obj: any = {}
    // //obj.synced_at = new Date().toISOString()
    // //clone.synced_at = obj.synced_at

    // for (let key in indexedKeys) {
    //   if (indexedKeys[key]) {
    //     if (hasIn(entity, key)) {
    //       obj[key] = entity[key]
    //       clone[key] = entity[key]
    //     }
    //   }
    // }
  
    if (hasIn(clone, 'publish_details')) {
      clone.published_at = clone.publish_details.time
      clone.locale = clone.publish_details.locale
      delete clone.publish_details
    } else {
      // most prolly for content types (though, not required)
      clone.published_at = new Date().toISOString()
    }
  
    //clone = merge(clone, obj)

    return clone
  }

  return entity
}
