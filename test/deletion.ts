/**
 * @description Tests filesystem deletion method
 */

import { cloneDeep, merge } from 'lodash'
import { setConfig } from '../src'
import { config as appConfig } from '../src/config'
import { FilesystemStore } from '../src/fs'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as content_type } from './mock/data/content-types'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))

// tslint:disable-next-line: one-variable-per-declaration
let db

describe('delete', () => {
  beforeAll(() => {
    setConfig(config)
    db = new FilesystemStore(connector, config)
  })

  describe('delete an entry', () => {
    test('delete entry successfully', () => {
      const entry = cloneDeep(entries[1])

      return db.publish(entry).then((result) => {
        delete entry.created_by
        expect(result).toMatchObject(entry)

        return db.delete(entry).then((result2) => {
          expect(result2).toEqual(entry)
        })
      }).catch(console.error)
    })
  })

  describe('delete an asset', () => {
    test('delete asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)

        return db.delete(asset).then((result2) => {
          expect(result2).toEqual(asset)
        })
      }).catch(console.error)
    })
    test('delete asset that does not exist', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)
        asset.uid = 'does not exist'

        return db.delete(asset).then((result2) => {
          expect(result2).toEqual(asset)
        })
      }).catch(console.error)
    })
  })

  describe('delete a content type', () => {
    test('delete content type successfully', () => {
      const entry1 = cloneDeep(entries[0])
      const entry2 = cloneDeep(entries[1])
      const entry3 = cloneDeep(entries[2])
      const contentType = cloneDeep(content_type[0])

      return db.publish(entry1).then((result1) => {
        delete entry1.created_by
        expect(result1).toMatchObject(entry1)

        return db.publish(entry2)
      })
      .then((result2) => {
        delete entry2.created_by
        expect(result2).toMatchObject(entry2)

        return db.publish(entry3)
      })
      .then((result3) => {
        delete entry3.created_by
        expect(result3).toMatchObject(entry3)

        return db.delete(contentType)
      })
      .then((result4) => {
        expect(result4).toMatchObject(contentType)

        return
      })
      .catch(console.error)
    })
  })

  describe('delete should throw an error', () => {
    test('delete entry with error', () => {

      return db.delete().catch((error) => {
        expect(error.message).toEqual("Cannot read property '_content_type_uid' of undefined")
      })
    })
  })
})
