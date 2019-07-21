import { existsSync, readFile as readFileNative } from 'fs'
import { sync } from 'mkdirp'
import { join, sep } from 'path'
import { promisify } from 'util'
import writeFileAtomic from 'write-file-atomic'

const promisifiedReadFile = promisify(readFileNative)
// const promisifiedWriteFile = promisify(writeFileAtomic)

export const readFile = (path, type = 'utf-8') => {
  if (existsSync(path)) {
    return promisifiedReadFile(path, type)
  }

  return Promise.resolve('[]')
}

export const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    try {
      if (!existsSync(path)) {
        const pathArr = path.split(sep)
        pathArr.splice(pathArr.length - 1, 1)
        const folderPath = join.apply(this, pathArr)
        if (!existsSync(folderPath)) {
          sync(folderPath)
        }
      }

      return writeFileAtomic(path, data, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve()
      })
    } catch (error) {
      return reject(error)
    }
  })
  // TODO
  // The current one is anti-pattern, but jest@24.8.0 throws errors when promisified
  // return promisifiedWriteFile(path, data)
}
