/**
 * @description Test content-store-filesystem module export methods
 */

import { getConfig, getFilesystemClient, setAssetConnector, setConfig, start } from '../src'
import { assetConnector, connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'

describe('core', () => {
  test('set and get config without any errors', () => {
    expect(setConfig(mockConfig)).toBeUndefined()
    expect(getConfig()).toEqual(mockConfig)
  })

  test('set asset connector without issues', () => {
    expect(setAssetConnector((assetConnector as any))).toBeUndefined()
  })

  test('start filesystem driver successfully without errors', () => {
    setAssetConnector((connector as any))

    return start((connector as any), mockConfig).then((fsClient: any) => {
      expect(fsClient).toHaveProperty('publish')
      expect(fsClient).toHaveProperty('unpublish')
      expect(fsClient).toHaveProperty('delete')
      expect(fsClient).toHaveProperty('updateContentType')
      expect(fsClient).toEqual(getFilesystemClient())
    }).catch((error) => {
      expect(error).toBeNull()
    })
  })
})
