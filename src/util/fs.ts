import { readFile as readFileNative } from 'fs'
import { promisify } from 'util'
import writeFileAtomic from 'write-file-atomic'

export const readFile = promisify(readFileNative)
export const writeFile = promisify(writeFileAtomic)
