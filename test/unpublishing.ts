/**
 * @description Tests filesystem unpublishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setConfig } from '../src'
import { config as appConfig } from '../src/config'
import { FilesystemStore } from '../src/fs'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))

// tslint:disable-next-line: one-variable-per-declaration
let db

describe('unpublish', () => {
  beforeAll(() => {
    setConfig(config)
    db = new FilesystemStore(connector, config)
  })

  describe('unpublish an entry', () => {
    test('unpublish an entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        delete entries[0].created_by
        expect(result).toMatchObject(entries[0])

        return db.unpublish(entry).then((result2) => {
          expect(result2).toMatchObject(entries[0])
        })
      }).catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('unpublish an asset', () => {
    test('unpublish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        // delete assets[0].created_by
        expect(result).toMatchObject(assets[0])

        return db.unpublish(asset).then((result2) => {
          expect(result2).toMatchObject(assets[0])
        })
      }).catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('unpublish should throw an error', () => {
    test('unpublish entry with error', () => {

      return db.unpublish().then((result) => {
        expect(result).toBeUndefined()
      }).catch((error) => {
        expect(error.message).toEqual('Unpublish object should be of type plain object and not empty!')
      })
    })
  })
})
