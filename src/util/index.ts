import {
  existsSync,
} from 'fs'
import {
  sync
} from 'mkdirp'
import {
  join,
  isAbsolute,
  sep
} from 'path'

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
      let k = patternKeys[i].substring(1)
      const idx = k.indexOf('.json')
      if (~idx) {
        k = k.slice(0, idx)
      }
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

export const normalizeBaseDir = (config) => {
  if (isAbsolute(config.baseDir)) {
    if (!existsSync(config.baseDir)) {
      sync(config.baseDir)
    } 
  } else {
    const projectDir = join(__dirname, '..', '..', '..', '..', '..')
    const contentDir = join(projectDir, config.baseDir)
    if (!existsSync(contentDir)) {
      sync(contentDir)
    }
  }

  return config
}

export const buildLocalePath = (path, appConfig) => {
  const localePath = join(appConfig.baseDir, appConfig.internal.locale)
  const localePathArr = localePath.split(sep)
  localePathArr.splice(localePathArr.length - 1)
  const localeFolderPath = join.apply(this, localePathArr)
  console.log('locale folder path', localeFolderPath, existsSync(localeFolderPath))
  console.log('locale path', localePath)

  if (!existsSync(localeFolderPath)) {
    sync(localeFolderPath)
  }

  return localePath
}
