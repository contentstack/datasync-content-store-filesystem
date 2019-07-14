import { cloneDeep, merge } from 'lodash'
import { config as appConfig } from '../src/config'
import { validateAssetConnectorInstance, validateConfig,
  // validateContentTypeDeletedObject, validateContentTypeObj, validateEntryAssetDeletedObject,
  validatePublishedObject, validateUnpublishedObject } from '../src/util/validations'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'

const config = cloneDeep(merge({}, appConfig, mockConfig))

describe('validations', () => {
  test('validate app config should throw baseDir error', () => {
    const localConfig = cloneDeep(config)
    localConfig.contentStore = {
      baseDir: '',
    }
    expect(() => {validateConfig(localConfig)}).toThrow('Content connector baseDir cannot be empty!')
  })

  test('validate asset connector with errors', () => {
    const assetConnector = cloneDeep(connector)
    assetConnector.delete = ({} as any)
    expect(() => {
      validateAssetConnectorInstance(assetConnector)
    }).toThrow(`Asset connector ${JSON.stringify(assetConnector)} does not have delete`)
  })
})

describe('Negative validations', () => {
  test('publish entry: mandatory-key not present, should throw error', () => {
    const entry: any = {
      locale: 'en-us',
      uid: 'e1',
    }
    expect(() => {
      validatePublishedObject(entry)
    })
    .toThrow(`_content_type_uid is missing from ${JSON.stringify(entry)}!`)
  })

  test('publish asset: incompatible type i.e. array instead of object', () => {
    const asset: any = [{
      _content_type_uid: '_assets',
      // locale: 'en-us',
      uid: 'e1',
    }]
    expect(() => {
      validatePublishedObject(asset)
    })
    .toThrow('Publish object should be of type plain object and not empty!')
  })

  test('publish asset: incompatible _content_type_uid type', () => {
    const asset: any = [{
      _content_type_uid: true,
      locale: 'en-us',
      uid: 'e1',
    }]
    expect(() => {
      validatePublishedObject(asset)
    })
    .toThrow('Publish object should be of type plain object and not empty!')
  })

  test('unpublish entry: mandatory-key not present, should throw error', () => {
    const entry: any = {
      locale: 'en-us',
      uid: 'e1',
    }
    expect(() => {
      validateUnpublishedObject(entry)
    })
    .toThrow(`_content_type_uid is missing from ${JSON.stringify(entry)}!`)
  })

  test('unpublish asset: incompatible type i.e. array instead of object', () => {
    const asset: any = [{
      _content_type_uid: '_assets',
      // locale: 'en-us',
      uid: 'e1',
    }]
    expect(() => {
      validateUnpublishedObject(asset)
    })
    .toThrow('Unpublish object should be of type plain object and not empty!')
  })

  test('unpublish asset: incompatible _content_type_uid type', () => {
    const asset: any = {
      _content_type_uid: true,
      locale: 'en-us',
      uid: 'e1',
    }
    expect(() => {
      validateUnpublishedObject(asset)
    })
    .toThrow('Unpublish object keys type do not match expected type!')
  })
})
