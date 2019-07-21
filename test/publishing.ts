/**
 * @description Tests filesystem publishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setConfig } from '../src'
import { config as appConfig } from '../src/config'
import { FilesystemStore } from '../src/fs'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { contentType as sampleContentType } from './mock/data/content-type-schema'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config.contentStore.collectionName = 'publishing'

// tslint:disable-next-line: one-variable-per-declaration
let db

describe('publish', () => {
  beforeAll(() => {
    setConfig(config)
    db = new FilesystemStore(connector, config)
  })

  describe('publish entry', () => {
    test('publish entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        delete entry.created_by
        expect(result).toMatchObject(entry)
      })
    })
  })

  describe('publish asset', () => {
    test('publish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toMatchObject(asset)
      })
    })
  })

  describe('publish should throw an error', () => {
    test('publish entry successfully', () => {
      return db.publish().catch((error) => {
        expect(error.message).toEqual('Publish object should be of type plain object and not empty!')
      })
    })
  })

  describe('publish a content type', () => {
    test('publish a content type successfully', () => {
      const contentType = cloneDeep(sampleContentType)

      return db.updateContentType(contentType).then((result) => {
        expect(result).toMatchObject(contentType)
      }).catch(console.error)
    })
  })
})
