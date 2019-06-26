import { existsSync, readFile as readFileNative } from 'fs'
import { join, sep } from 'path'
import { sync } from 'mkdirp'
import { promisify } from 'util'
import writeFileAtomic from 'write-file-atomic'

const promisifiedReadFile = promisify(readFileNative)
const promisifiedWriteFile = promisify(writeFileAtomic)

export const readFile = (path, type = 'utf-8') => {
  if (existsSync(path)) {
    return promisifiedReadFile(path, type)
  }

  return Promise.resolve('[]')
}

export const writeFile = (path, data) => {
  if (!existsSync(path)) {
    const pathArr = path.split(sep)
    pathArr.splice(pathArr.length - 1, 1)
    const folderPath = join.apply(this, pathArr)
    if (!existsSync(folderPath)) {
      sync(folderPath)
    }
  }

  return promisifiedWriteFile(path, data)
}
