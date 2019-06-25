import { getConfig } from '../index'

const filterKeys = ['_content_type', 'checkpoint', 'type']

export const filter: any = (data) => {
  const result = {}
  for (const key in data) {
    if (filterKeys.indexOf(key) === -1) {
      result[key] = data[key]
    }
  }
  return result
}

export const getPathKeys = (patternKeys, json) => {
  const pathKeys = []
  for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
    if (patternKeys[i].charAt(0) === ':') {
      const k = patternKeys[i].substring(1)
      if (json[k]) {
        pathKeys.push(json[k])
      } else {
        throw new TypeError(`The key ${pathKeys[i]} did not exist on ${JSON.stringify(json)}`)
      }
    } else {
      pathKeys.push(patternKeys[i])
    }
  }

  return pathKeys
}

export const removeUnwantedKeys = (unwanted, json) => {
  for (const key in unwanted) {
    if (unwanted[key] && json.hasOwnProperty(key)) {
      delete json[key]
    }
  }

  return json
}
